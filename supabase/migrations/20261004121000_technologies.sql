-- Technology ecosystem: the stack section on the homepage and /about, plus the
-- badges used across project and service pages.
-- Listing a technology is an explicit admin action — the site never claims
-- expertise in anything that has not been added here.

create type public.tech_category as enum (
  'frontend', 'backend', 'ai', 'cloud', 'database',
  'cybersecurity', 'devops', 'mobile', 'web3'
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.tech_category not null default 'backend',
  description text,
  logo_path text,
  logo_alt text,
  website text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint technologies_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint technologies_name_length check (char_length(name) between 2 and 40),
  constraint technologies_description_length check (description is null or char_length(description) between 5 and 140),
  constraint technologies_logo_alt_required check (
    logo_path is null or char_length(btrim(coalesce(logo_alt, ''))) > 0
  ),
  constraint technologies_logo_alt_length check (logo_alt is null or char_length(logo_alt) <= 120),
  constraint technologies_website_format check (website is null or website ~ '^https://[^\s]+$')
);

create index technologies_status_sort_idx on public.technologies (status, sort_order);
create index technologies_category_idx on public.technologies (status, category);

create trigger technologies_set_updated_at
  before update on public.technologies
  for each row execute function public.set_updated_at();

alter table public.technologies enable row level security;

create policy "Published technologies are public"
  on public.technologies for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all technologies"
  on public.technologies for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create technologies"
  on public.technologies for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update technologies"
  on public.technologies for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete technologies"
  on public.technologies for delete
  to authenticated
  using ((select public.is_admin()));
