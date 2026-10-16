-- Appointment rescheduling proposals with a 24-hour customer response window.
-- Apply manually in Supabase SQL Editor after reviewing this migration.
create extension if not exists pgcrypto;

create table if not exists public.reschedule_proposals (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  proposed_starts_at timestamptz not null,
  proposed_ends_at timestamptz not null,
  original_starts_at timestamptz not null,
  original_ends_at timestamptz not null,
  token_hash text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  responded_at timestamptz,
  constraint reschedule_proposals_valid_interval
    check (proposed_ends_at > proposed_starts_at),
  constraint reschedule_proposals_token_hash_format
    check (token_hash ~ '^[0-9a-f]{64}$')
);

create index if not exists reschedule_proposals_pending_expiry_idx
  on public.reschedule_proposals (expires_at)
  where status = 'pending';

create index if not exists reschedule_proposals_appointment_idx
  on public.reschedule_proposals (appointment_id, created_at desc);

alter table public.reschedule_proposals enable row level security;

drop policy if exists "Admins can read reschedule proposals" on public.reschedule_proposals;
create policy "Admins can read reschedule proposals"
  on public.reschedule_proposals
  for select
  to authenticated
  using (
    exists (
      select 1 from public.admin_users au
      where au.user_id = (select auth.uid())
    )
  );

revoke all on public.reschedule_proposals from anon, authenticated;
grant select on public.reschedule_proposals to authenticated;

create or replace function public.create_reschedule_proposal(
  p_appointment_id uuid,
  p_proposed_starts_at timestamptz,
  p_token_hash text
)
returns table (proposal_id uuid, expires_at timestamptz, proposed_ends_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_appointment public.appointments%rowtype;
  v_service public.services%rowtype;
  v_start_local timestamp;
  v_end timestamptz;
  v_weekday integer;
  v_hours public.business_hours%rowtype;
begin
  if auth.uid() is null or not exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  ) then
    raise exception 'Administrator access required.';
  end if;

  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid proposal token.';
  end if;

  select * into v_appointment
  from public.appointments
  where id = p_appointment_id
  for update;

  if not found then raise exception 'Appointment not found.'; end if;
  if v_appointment.status not in ('pending', 'confirmed') then
    raise exception 'Only active appointments can be rescheduled.';
  end if;

  select * into v_service from public.services where id = v_appointment.service_id;
  if not found then raise exception 'Service not found.'; end if;

  if p_proposed_starts_at <= now() then
    raise exception 'The proposed time must be in the future.';
  end if;

  v_end := p_proposed_starts_at + make_interval(mins => v_service.duration_minutes);
  v_start_local := p_proposed_starts_at at time zone 'Europe/Paris';
  v_weekday := extract(dow from v_start_local)::integer;

  select * into v_hours from public.business_hours where weekday = v_weekday;
  if not found or v_hours.is_closed
     or v_start_local::time < v_hours.opens_at
     or (v_start_local + make_interval(mins => v_service.duration_minutes))::time > v_hours.closes_at then
    raise exception 'The proposed time is outside business hours.';
  end if;

  if exists (
    select 1 from public.appointments a
    where a.id <> p_appointment_id
      and a.status in ('pending', 'confirmed')
      and a.starts_at < v_end
      and a.ends_at > p_proposed_starts_at
  ) then
    raise exception 'The proposed time conflicts with another appointment.';
  end if;

  if exists (
    select 1 from public.blocked_periods b
    where b.starts_at < v_end and b.ends_at > p_proposed_starts_at
  ) then
    raise exception 'The proposed time is blocked.';
  end if;

  if exists (
    select 1 from public.reschedule_proposals rp
    where rp.status = 'pending'
      and rp.expires_at > now()
      and rp.appointment_id <> p_appointment_id
      and rp.proposed_starts_at < v_end
      and rp.proposed_ends_at > p_proposed_starts_at
  ) then
    raise exception 'The proposed time is held for another rescheduling request.';
  end if;

  update public.reschedule_proposals
    set status = 'cancelled', responded_at = now()
    where appointment_id = p_appointment_id and status = 'pending';

  insert into public.reschedule_proposals (
    appointment_id, proposed_starts_at, proposed_ends_at,
    original_starts_at, original_ends_at, token_hash, created_by, expires_at
  ) values (
    p_appointment_id, p_proposed_starts_at, v_end,
    v_appointment.starts_at, v_appointment.ends_at,
    p_token_hash, auth.uid(), now() + interval '24 hours'
  )
  returning id, reschedule_proposals.expires_at, reschedule_proposals.proposed_ends_at
    into proposal_id, expires_at, proposed_ends_at;

  return next;
end;
$$;

revoke all on function public.create_reschedule_proposal(uuid, timestamptz, text) from public, anon;
grant execute on function public.create_reschedule_proposal(uuid, timestamptz, text) to authenticated;

create or replace function public.respond_to_reschedule_proposal(
  p_token_hash text,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_proposal public.reschedule_proposals%rowtype;
  v_appointment public.appointments%rowtype;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid proposal link.';
  end if;
  if p_action not in ('accept', 'reject') then
    raise exception 'Invalid response.';
  end if;

  select * into v_proposal
  from public.reschedule_proposals
  where token_hash = p_token_hash
  for update;

  if not found then raise exception 'This proposal link is invalid.'; end if;

  if v_proposal.status = 'pending' and v_proposal.expires_at <= now() then
    update public.reschedule_proposals
      set status = 'expired', responded_at = now()
      where id = v_proposal.id;
    return jsonb_build_object('status', 'expired');
  end if;

  if v_proposal.status <> 'pending' then
    return jsonb_build_object('status', v_proposal.status);
  end if;

  select * into v_appointment
  from public.appointments
  where id = v_proposal.appointment_id
  for update;

  if not found or v_appointment.status not in ('pending', 'confirmed') then
    update public.reschedule_proposals
      set status = 'cancelled', responded_at = now()
      where id = v_proposal.id;
    return jsonb_build_object('status', 'cancelled');
  end if;

  if p_action = 'accept' then
    if exists (
      select 1 from public.appointments a
      where a.id <> v_appointment.id
        and a.status in ('pending', 'confirmed')
        and a.starts_at < v_proposal.proposed_ends_at
        and a.ends_at > v_proposal.proposed_starts_at
    ) or exists (
      select 1 from public.blocked_periods b
      where b.starts_at < v_proposal.proposed_ends_at
        and b.ends_at > v_proposal.proposed_starts_at
    ) then
      update public.reschedule_proposals
        set status = 'expired', responded_at = now()
        where id = v_proposal.id;
      return jsonb_build_object('status', 'unavailable');
    end if;

    update public.appointments
      set starts_at = v_proposal.proposed_starts_at,
          ends_at = v_proposal.proposed_ends_at
      where id = v_appointment.id;

    update public.reschedule_proposals
      set status = 'accepted', responded_at = now()
      where id = v_proposal.id;

    update public.reschedule_proposals
      set status = 'cancelled', responded_at = now()
      where appointment_id = v_appointment.id
        and id <> v_proposal.id
        and status = 'pending';
    return jsonb_build_object('status', 'accepted');
  end if;

  update public.reschedule_proposals
    set status = 'rejected', responded_at = now()
    where id = v_proposal.id;
  return jsonb_build_object('status', 'rejected');
end;
$$;

revoke all on function public.respond_to_reschedule_proposal(text, text) from public, anon, authenticated;
grant execute on function public.respond_to_reschedule_proposal(text, text) to service_role;

-- Defense in depth: active proposals reserve their intervals even if a stale
-- availability response still displays the time as selectable.
create or replace function public.prevent_booking_over_active_reschedule_proposal()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status in ('pending', 'confirmed') and exists (
    select 1 from public.reschedule_proposals rp
    where rp.status = 'pending'
      and rp.expires_at > now()
      and rp.appointment_id <> new.id
      and rp.proposed_starts_at < new.ends_at
      and rp.proposed_ends_at > new.starts_at
  ) then
    raise exception 'This time is temporarily held for a rescheduling proposal.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_booking_over_active_reschedule_proposal on public.appointments;
create trigger prevent_booking_over_active_reschedule_proposal
before insert or update of starts_at, ends_at, status on public.appointments
for each row execute function public.prevent_booking_over_active_reschedule_proposal();


-- Expose only the busy intervals for active proposals; no customer or token data.
create or replace function public.get_active_reschedule_holds(p_date date)
returns table (starts_at timestamptz, ends_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin

  return query
    select rp.proposed_starts_at, rp.proposed_ends_at
    from public.reschedule_proposals rp
    where rp.status = 'pending'
      and rp.expires_at > now()
      and (rp.proposed_starts_at at time zone 'Europe/Paris')::date = p_date;
end;
$$;

revoke all on function public.get_active_reschedule_holds(date) from public;
grant execute on function public.get_active_reschedule_holds(date) to anon, authenticated;


-- If an appointment is cancelled/completed, its pending customer links must
-- stop reserving time immediately.
create or replace function public.cancel_reschedule_proposals_for_inactive_appointment()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status in ('cancelled', 'completed')
     and old.status is distinct from new.status then
    update public.reschedule_proposals
      set status = 'cancelled', responded_at = now()
      where appointment_id = new.id and status = 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists cancel_reschedule_proposals_for_inactive_appointment on public.appointments;
create trigger cancel_reschedule_proposals_for_inactive_appointment
after update of status on public.appointments
for each row execute function public.cancel_reschedule_proposals_for_inactive_appointment();
