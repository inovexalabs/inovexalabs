-- Team members shown on /about. Social links are a JSONB array of {label, url}
-- validated below and mirrored by the Zod schema in lib/validations/team.ts.

create or replace function public.is_valid_social_links(items jsonb, max_items integer)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) <= max_items
    and not exists (
      select 1
      from jsonb_array_elements(items) as item
      where jsonb_typeof(item) <> 'object'
        or jsonb_typeof(item -> 'label') is distinct from 'string'
        or jsonb_typeof(item -> 'url') is distinct from 'string'
        or char_length(btrim(item ->> 'label')) not between 2 and 30
        or item ->> 'url' !~ '^https://[^\s]+$'
    );
$$;

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  bio text not null default '',
  photo_path text,
  photo_alt text,
  skills text[] not null default '{}',
  social_links jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint team_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint team_name_length check (char_length(name) between 2 and 60),
  constraint team_role_length check (char_length(role) between 2 and 70),
  constraint team_bio_length check (char_length(bio) <= 1200),
  constraint team_photo_alt_required check (
    photo_path is null or char_length(btrim(coalesce(photo_alt, ''))) > 0
  ),
  constraint team_photo_alt_length check (photo_alt is null or char_length(photo_alt) <= 120),
  constraint team_skills_valid check (public.is_valid_tags(skills, 10, 30)),
  constraint team_social_links_valid check (public.is_valid_social_links(social_links, 6))
);

create index team_status_sort_idx on public.team_members (status, sort_order);

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.team_members enable row level security;

create policy "Published team members are public"
  on public.team_members for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all team members"
  on public.team_members for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create team members"
  on public.team_members for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update team members"
  on public.team_members for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete team members"
  on public.team_members for delete
  to authenticated
  using ((select public.is_admin()));
