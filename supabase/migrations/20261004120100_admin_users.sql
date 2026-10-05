-- Admin authorization is separate from authentication: a signed-in user is
-- only an admin when they have a row here. Rows are created by an owner in
-- the Supabase dashboard (SQL editor); the app has no service-role key.

create type public.admin_role as enum ('owner', 'editor');

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.admin_role not null default 'editor',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER lets RLS policies on other tables check membership without
-- granting read access to admin_users itself (and without policy recursion).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid()) and au.role = 'owner'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_owner() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_owner() to anon, authenticated;

create policy "Admins can read their own membership"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Owners can read all memberships"
  on public.admin_users for select
  to authenticated
  using ((select public.is_owner()));

create policy "Owners can add admins"
  on public.admin_users for insert
  to authenticated
  with check ((select public.is_owner()));

create policy "Owners can change admin roles"
  on public.admin_users for update
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Owners can remove admins"
  on public.admin_users for delete
  to authenticated
  using ((select public.is_owner()));
