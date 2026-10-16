-- Stripe deposit booking flow. Review and apply only to a dedicated TEST Supabase project first.
-- This migration does not create Stripe resources or deploy any Edge Function.

create table if not exists public.booking_payment_holds (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  amount_total_cents integer not null check (amount_total_cents > 0),
  currency text not null default 'eur' check (currency = 'eur'),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'expired', 'released', 'failed')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  appointment_id uuid references public.appointments(id),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint booking_payment_holds_valid_interval check (ends_at > starts_at)
);

create index if not exists booking_payment_holds_active_slot_idx
  on public.booking_payment_holds (starts_at, ends_at)
  where status in ('pending', 'processing');

alter table public.booking_payment_holds enable row level security;
revoke all on public.booking_payment_holds from anon, authenticated;

-- Keep this table private. Only Edge Functions using service_role may read/write it.
-- Serializes the single-practitioner booking/payment critical section.
create or replace function public.create_booking_payment_hold(
  p_service_id text,
  p_starts_at timestamptz,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_amount_total_cents integer
)
returns table (hold_id uuid, ends_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_service public.services%rowtype;
  v_end timestamptz;
  v_local_start timestamp;
  v_local_end timestamp;
  v_weekday integer;
  v_hours public.business_hours%rowtype;
  v_has_reschedule_conflict boolean := false;
begin
  perform pg_advisory_xact_lock(721904116);

  if p_starts_at is null or p_starts_at <= now() then
    raise exception 'Appointment time must be in the future.';
  end if;
  if p_customer_name is null or length(trim(p_customer_name)) not between 1 and 120
     or p_customer_phone is null or length(trim(p_customer_phone)) not between 1 and 40
     or p_customer_email is null or length(trim(p_customer_email)) not between 3 and 254
     or p_customer_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then
    raise exception 'Invalid customer details.';
  end if;
  if p_amount_total_cents is null or p_amount_total_cents < 1 then
    raise exception 'Invalid deposit amount.';
  end if;

  select * into v_service
    from public.services
    where id = p_service_id and is_active = true;
  if not found then raise exception 'Service is unavailable.'; end if;
  if v_service.price_eur is null or v_service.price_eur <= 0
     or v_service.duration_minutes is null or v_service.duration_minutes <= 0 then
    raise exception 'Service price or duration is not configured.';
  end if;

  v_end := p_starts_at + make_interval(mins => v_service.duration_minutes);
  v_local_start := p_starts_at at time zone 'Europe/Paris';
  v_local_end := v_end at time zone 'Europe/Paris';
  v_weekday := extract(dow from v_local_start)::integer;

  select * into v_hours from public.business_hours where weekday = v_weekday;
  if not found or v_hours.is_closed
     or v_local_start::time < v_hours.opens_at
     or v_local_end::time > v_hours.closes_at
     or v_local_start::date <> v_local_end::date then
    raise exception 'Appointment is outside business hours.';
  end if;

  if exists (
    select 1 from public.appointments a
    where a.status in ('pending', 'confirmed')
      and a.starts_at < v_end and a.ends_at > p_starts_at
  ) then
    raise exception 'This time slot is no longer available.';
  end if;

  if exists (
    select 1 from public.blocked_periods b
    where b.starts_at < v_end and b.ends_at > p_starts_at
  ) then
    raise exception 'This time slot is blocked.';
  end if;

  if to_regclass('public.reschedule_proposals') is not null then
    execute
      'select exists (
         select 1 from public.reschedule_proposals rp
         where rp.status = ''pending'' and rp.expires_at > now()
           and rp.proposed_starts_at < $1 and rp.proposed_ends_at > $2
       )'
      into v_has_reschedule_conflict
      using v_end, p_starts_at;
    if v_has_reschedule_conflict then
      raise exception 'This time is held for a rescheduling proposal.';
    end if;
  end if;

  update public.booking_payment_holds
    set status = 'expired'
    where status = 'pending' and expires_at <= now();

  if exists (
    select 1 from public.booking_payment_holds h
    where h.status in ('pending', 'processing')
      and h.expires_at > now()
      and h.starts_at < v_end and h.ends_at > p_starts_at
  ) then
    raise exception 'This time slot is being checked out by another customer.';
  end if;

  return query
  insert into public.booking_payment_holds (
    service_id, starts_at, ends_at, customer_name, customer_phone,
    customer_email, amount_total_cents, expires_at
  ) values (
    p_service_id, p_starts_at, v_end, trim(p_customer_name), trim(p_customer_phone),
    lower(trim(p_customer_email)), p_amount_total_cents, now() + interval '36 minutes'
  )
  returning id, booking_payment_holds.ends_at, booking_payment_holds.expires_at;
end;
$$;

revoke all on function public.create_booking_payment_hold(text, timestamptz, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.create_booking_payment_hold(text, timestamptz, text, text, text, integer) to service_role;

create or replace function public.release_booking_payment_hold(p_hold_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.booking_payment_holds
  set status = 'released'
  where id = p_hold_id and status = 'pending';
$$;
revoke all on function public.release_booking_payment_hold(uuid) from public, anon, authenticated;
grant execute on function public.release_booking_payment_hold(uuid) to service_role;

create or replace function public.complete_paid_booking(
  p_hold_id uuid,
  p_stripe_session_id text,
  p_payment_intent_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_hold public.booking_payment_holds%rowtype;
  v_result jsonb;
  v_appointment jsonb;
begin
  perform pg_advisory_xact_lock(721904116);

  select * into v_hold
  from public.booking_payment_holds
  where id = p_hold_id
  for update;

  if not found then raise exception 'Payment hold not found.'; end if;

  if v_hold.status = 'paid' and v_hold.appointment_id is not null then
    return jsonb_build_object('status', 'paid', 'appointment_id', v_hold.appointment_id);
  end if;

  if v_hold.status <> 'pending' or v_hold.expires_at <= now() then
    raise exception 'Payment hold expired or is no longer active.';
  end if;

  if v_hold.stripe_session_id is distinct from p_stripe_session_id then
    raise exception 'Checkout session does not match the hold.';
  end if;

  update public.booking_payment_holds set status = 'processing' where id = p_hold_id;

  -- Existing server-side booking RPC remains the source of truth for creating an appointment.
  select to_jsonb(x) into v_appointment
  from public.create_appointment(
    v_hold.service_id,
    v_hold.starts_at,
    v_hold.customer_name,
    v_hold.customer_phone,
    v_hold.customer_email
  ) x;

  if v_appointment is null or coalesce(v_appointment->>'appointment_id', '') = '' then
    raise exception 'Appointment creation did not return an appointment id.';
  end if;

  -- A verified deposit is the condition that confirms the appointment.
  update public.appointments
    set status = 'confirmed',
        payment_status = 'deposit_paid'
    where id = (v_appointment->>'appointment_id')::uuid
      and status in ('pending', 'confirmed');
  if not found then
    raise exception 'Paid appointment could not be confirmed.';
  end if;

  update public.booking_payment_holds
    set status = 'paid',
        stripe_payment_intent_id = p_payment_intent_id,
        appointment_id = (v_appointment->>'appointment_id')::uuid,
        paid_at = now()
    where id = p_hold_id;

  return jsonb_build_object(
    'status', 'paid',
    'appointment_id', (v_appointment->>'appointment_id')::uuid
  );
end;
$$;
revoke all on function public.complete_paid_booking(uuid, text, text) from public, anon, authenticated;
grant execute on function public.complete_paid_booking(uuid, text, text) to service_role;


-- Defense in depth: appointments created by admins or other server paths must not
-- take a slot currently held for an in-progress Checkout session. The webhook marks
-- its own hold as 'processing' in the same transaction before creating the appointment.
create or replace function public.prevent_appointment_over_active_payment_hold()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status in ('pending', 'confirmed') and exists (
    select 1
    from public.booking_payment_holds h
    where h.status = 'pending'
      and h.expires_at > now()
      and h.starts_at < new.ends_at
      and h.ends_at > new.starts_at
  ) then
    raise exception 'This time is temporarily held for an online deposit payment.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_appointment_over_active_payment_hold on public.appointments;
create trigger prevent_appointment_over_active_payment_hold
before insert or update of starts_at, ends_at, status on public.appointments
for each row execute function public.prevent_appointment_over_active_payment_hold();
