-- Services ("Solutions" in the navigation). Public visitors see published
-- rows only; admins manage everything.

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_md text not null default '',
  icon text not null default 'sparkles',
  cover_image_path text,
  cover_image_alt text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint services_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint services_title_length check (char_length(title) between 2 and 80),
  constraint services_summary_length check (char_length(summary) between 10 and 200),
  -- Keep in sync with lib/constants/service-icons.ts
  constraint services_icon_check check (
    icon in ('code', 'globe', 'smartphone', 'brain', 'shield', 'workflow', 'cloud', 'database', 'cpu', 'layers', 'shopping-cart', 'sparkles')
  ),
  constraint services_cover_alt_required check (
    cover_image_path is null or char_length(btrim(coalesce(cover_image_alt, ''))) > 0
  ),
  constraint services_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint services_seo_description_length check (seo_description is null or char_length(seo_description) <= 170)
);

create index services_status_sort_idx on public.services (status, sort_order);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;

create policy "Published services are public"
  on public.services for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all services"
  on public.services for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create services"
  on public.services for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update services"
  on public.services for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete services"
  on public.services for delete
  to authenticated
  using ((select public.is_admin()));
