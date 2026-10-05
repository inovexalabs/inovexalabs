-- Site-wide editable content: contact details, social links, footer copy,
-- analytics, Open Graph image, the closing homepage CTA, plus the editable
-- navigation rows used by the header and footer.
--
-- New columns carry defaults so the existing singleton row keeps working and
-- the homepage always has a final CTA to render.

create or replace function public.is_valid_social_map(map jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(map) = 'object'
    and not exists (
      select 1
      from jsonb_each(map) as entry
      where entry.key not in (
        'github', 'linkedin', 'twitter', 'x', 'youtube', 'instagram', 'discord'
      )
      or jsonb_typeof(entry.value) is distinct from 'string'
      or (btrim(entry.value #>> '{}') <> '' and entry.value #>> '{}' !~ '^https://[^\s]+$')
    );
$$;

alter table public.site_settings
  add column contact_email text,
  add column contact_phone text,
  add column contact_address text,
  add column social_links jsonb not null default '{}'::jsonb,
  add column footer_text text,
  add column og_image_path text,
  add column analytics_id text,
  add column final_cta_title text not null default 'Have an idea?',
  add column final_cta_description text not null default 'Tell us what you are building. We will reply within two working days with next steps.',
  add column final_cta_label text not null default 'Start a Project',
  add column final_cta_href text not null default '/contact';

alter table public.site_settings
  add constraint site_settings_contact_email_format check (
    contact_email is null or contact_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  add constraint site_settings_contact_phone_length check (
    contact_phone is null or char_length(contact_phone) between 5 and 30
  ),
  add constraint site_settings_contact_address_length check (
    contact_address is null or char_length(contact_address) between 5 and 160
  ),
  add constraint site_settings_social_links_valid check (public.is_valid_social_map(social_links)),
  add constraint site_settings_footer_text_length check (
    footer_text is null or char_length(footer_text) between 10 and 280
  ),
  add constraint site_settings_analytics_id_length check (
    analytics_id is null or char_length(analytics_id) between 2 and 64
  ),
  add constraint site_settings_final_cta_length check (
    char_length(final_cta_title) between 3 and 80
    and char_length(final_cta_description) between 10 and 280
    and char_length(final_cta_label) between 2 and 32
  ),
  add constraint site_settings_final_cta_href_format check (
    final_cta_href ~ '^(/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https://[^\s]+)$'
  );

-- Editable navigation. The app falls back to its built-in route list whenever
-- no rows are published, so a site never renders an empty header.
create type public.nav_location as enum ('header', 'footer');

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  location public.nav_location not null default 'header',
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint navigation_label_length check (char_length(label) between 2 and 32),
  constraint navigation_href_format check (
    href ~ '^(/[^\s]*|https://[^\s]+)$'
  )
);

create index navigation_location_sort_idx on public.navigation_items (location, status, sort_order);

create trigger navigation_items_set_updated_at
  before update on public.navigation_items
  for each row execute function public.set_updated_at();

alter table public.navigation_items enable row level security;

create policy "Published navigation is public"
  on public.navigation_items for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all navigation"
  on public.navigation_items for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create navigation"
  on public.navigation_items for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update navigation"
  on public.navigation_items for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete navigation"
  on public.navigation_items for delete
  to authenticated
  using ((select public.is_admin()));
