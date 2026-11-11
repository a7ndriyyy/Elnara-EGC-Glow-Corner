-- TZ step 9: promotions & news managed from the admin panel.
-- Public visitors read only live rows; only admins (public.admin_users) write.

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  -- Uploaded to the "promotions" storage bucket; https only.
  image_url text check (image_url is null or image_url ~ '^https://'),
  type text not null default 'promotion' check (type in ('promotion', 'new')),
  old_price numeric(10, 2) check (old_price is null or old_price >= 0),
  new_price numeric(10, 2) check (new_price is null or new_price >= 0),
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_dates_order check (
    start_date is null or end_date is null or end_date >= start_date
  )
);

create index if not exists promotions_live_idx
  on public.promotions (is_active, end_date, created_at desc);

-- Keep updated_at current.
create or replace function public.promotions_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists promotions_touch_updated_at on public.promotions;
create trigger promotions_touch_updated_at
  before update on public.promotions
  for each row execute function public.promotions_touch_updated_at();

alter table public.promotions enable row level security;

-- Visitors: active rows inside their date window (dates in the salon's time zone).
drop policy if exists "Public can read live promotions" on public.promotions;
create policy "Public can read live promotions"
  on public.promotions
  for select
  to anon, authenticated
  using (
    is_active
    and (start_date is null or start_date <= (now() at time zone 'Europe/Paris')::date)
    and (end_date is null or end_date >= (now() at time zone 'Europe/Paris')::date)
  );

-- Admins: everything (including inactive / expired rows).
drop policy if exists "Admins can read all promotions" on public.promotions;
create policy "Admins can read all promotions"
  on public.promotions
  for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

drop policy if exists "Admins can insert promotions" on public.promotions;
create policy "Admins can insert promotions"
  on public.promotions
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

drop policy if exists "Admins can update promotions" on public.promotions;
create policy "Admins can update promotions"
  on public.promotions
  for update
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

drop policy if exists "Admins can delete promotions" on public.promotions;
create policy "Admins can delete promotions"
  on public.promotions
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

revoke all on public.promotions from anon, authenticated;
grant select on public.promotions to anon, authenticated;
grant insert, update, delete on public.promotions to authenticated;

-- Image bucket: public read via URL, admin-only writes, images up to 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('promotions', 'promotions', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload promotion images" on storage.objects;
create policy "Admins can upload promotion images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'promotions'
    and exists (select 1 from public.admin_users au where au.user_id = (select auth.uid()))
  );

drop policy if exists "Admins can update promotion images" on storage.objects;
create policy "Admins can update promotion images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'promotions'
    and exists (select 1 from public.admin_users au where au.user_id = (select auth.uid()))
  );

drop policy if exists "Admins can delete promotion images" on storage.objects;
create policy "Admins can delete promotion images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'promotions'
    and exists (select 1 from public.admin_users au where au.user_id = (select auth.uid()))
  );
