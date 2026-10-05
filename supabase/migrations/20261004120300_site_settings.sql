-- Site-wide editable settings: a single row (id = true). Public read,
-- owner-only edits from /admin/settings.

create table public.site_settings (
  id boolean primary key default true,
  site_name text not null,
  hero_headline text not null,
  hero_subheadline text not null,
  hero_primary_cta_label text not null,
  hero_primary_cta_href text not null,
  hero_secondary_cta_label text not null,
  hero_secondary_cta_href text not null,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now(),

  constraint site_settings_singleton check (id),
  constraint site_settings_site_name_length check (char_length(site_name) between 2 and 60),
  -- One line break allowed: each line is revealed separately in the hero.
  constraint site_settings_hero_headline_length check (char_length(hero_headline) between 10 and 160),
  constraint site_settings_hero_subheadline_length check (char_length(hero_subheadline) between 20 and 320),
  constraint site_settings_cta_label_length check (
    char_length(hero_primary_cta_label) between 2 and 32
    and char_length(hero_secondary_cta_label) between 2 and 32
  ),
  -- Internal path, in-page anchor, or https URL
  constraint site_settings_cta_href_format check (
    hero_primary_cta_href ~ '^(/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https://[^\s]+)$'
    and hero_secondary_cta_href ~ '^(/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https://[^\s]+)$'
  ),
  constraint site_settings_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint site_settings_seo_description_length check (seo_description is null or char_length(seo_description) <= 170)
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "Site settings are public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Owners can update site settings"
  on public.site_settings for update
  to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

-- The singleton row must exist in every environment, so it is created here
-- rather than in seed.sql.
insert into public.site_settings (
  id,
  site_name,
  hero_headline,
  hero_subheadline,
  hero_primary_cta_label,
  hero_primary_cta_href,
  hero_secondary_cta_label,
  hero_secondary_cta_href,
  seo_title,
  seo_description
) values (
  true,
  'Inovexa Labs',
  E'Turning Ideas Into Technology.\nBuilding Products That Matter.',
  'Inovexa Labs is a technology studio building intelligent software, digital products, secure systems and experimental technologies for businesses and ambitious ideas.',
  'Start a Project',
  '/contact',
  'Explore Our Work',
  '/projects',
  'Inovexa Labs | Software, AI and Secure Systems Studio',
  'A technology studio building intelligent software, digital products, secure systems and experimental technologies for businesses and ambitious ideas.'
)
on conflict (id) do nothing;
