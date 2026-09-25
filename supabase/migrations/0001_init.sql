-- ===========================================================================
-- INOVEXA LABS — 0001 INIT
-- Normalized, RLS-ready schema. All primary keys are UUIDs.
-- Every content table carries: created_at, updated_at, published_at, slug,
-- published — plus a full SEO surface for per-entity dynamic metadata.
-- ===========================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------------
-- Shared: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin allowlist + RLS helper
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

-- Security-definer so policies can consult the allowlist without granting
-- anon read access to admin_users itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- site_settings — singleton-grouped key/value so the admin panel can edit
-- company info, homepage copy, SEO defaults and footer without a migration.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  group_name  text not null default 'general',
  label       text not null,
  description text,
  value       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists site_settings_group_idx on public.site_settings (group_name);

-- ---------------------------------------------------------------------------
-- navigation_items
-- ---------------------------------------------------------------------------
create table if not exists public.navigation_items (
  id            uuid primary key default gen_random_uuid(),
  location      text not null default 'header' check (location in ('header','footer','legal','social')),
  parent_id     uuid references public.navigation_items(id) on delete cascade,
  title         text not null,
  href          text not null,
  description   text,
  display_order integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists navigation_items_location_idx on public.navigation_items (location, display_order);

-- ---------------------------------------------------------------------------
-- authors (blog bylines)
-- ---------------------------------------------------------------------------
create table if not exists public.authors (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  role            text,
  bio             text,
  avatar_url      text,
  email           text,
  social_links    jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  tagline           text,
  summary           text not null,
  body              text,
  icon              text,
  category          text,
  deliverables      jsonb not null default '[]'::jsonb,
  process_notes     jsonb not null default '[]'::jsonb,
  engagement_models jsonb not null default '[]'::jsonb,
  faqs              jsonb not null default '[]'::jsonb,
  display_order     integer not null default 0,
  featured          boolean not null default false,
  published         boolean not null default false,
  published_at      timestamptz,
  seo_title         text,
  seo_description   text,
  seo_keywords      text[],
  canonical_url     text,
  og_title          text,
  og_description    text,
  og_image_url      text,
  robots            text not null default 'index,follow',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists services_slug_idx on public.services (slug);
create index if not exists services_published_idx on public.services (published, display_order);
create index if not exists services_category_idx on public.services (category);

-- ---------------------------------------------------------------------------
-- products — first-class. A product is a thing Inovexa built for itself.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  tagline           text not null,
  short_description text,
  full_description  text,
  logo_url          text,
  cover_image_url   text,
  gallery           jsonb not null default '[]'::jsonb,
  video_url         text,
  product_url       text,
  status            text not null default 'idea'
                      check (status in ('idea','experiment','in_development','live','archived')),
  category          text,
  technologies      text[] not null default '{}',
  launch_date       date,
  last_updated_note text,
  is_open_source    boolean not null default false,
  featured          boolean not null default false,
  published         boolean not null default false,
  published_at      timestamptz,
  seo_title         text,
  seo_description   text,
  seo_keywords      text[],
  canonical_url     text,
  og_title          text,
  og_description    text,
  og_image_url      text,
  robots            text not null default 'index,follow',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_published_idx on public.products (published, featured desc, created_at desc);
create index if not exists products_created_at_idx on public.products (created_at desc);

create table if not exists public.product_features (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  title       text not null,
  description text,
  icon        text,
  display_order integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists product_features_product_idx on public.product_features (product_id, display_order);

create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  url           text not null,
  alt           text not null default '',
  caption       text,
  width         integer,
  height        integer,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images (product_id, display_order);

-- ---------------------------------------------------------------------------
-- projects — client work / case studies
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  client_name    text,
  industry       text,
  summary        text not null,
  challenge      text,
  solution       text,
  outcome        text,           -- qualitative only unless a verified metric exists
  metrics        jsonb not null default '[]'::jsonb,  -- [{label, value, source}] — omit when unverified
  technologies   text[] not null default '{}',
  cover_image_url text,
  gallery        jsonb not null default '[]'::jsonb,
  website_url    text,
  case_study_url text,
  project_types  text[] not null default '{}',
  started_on     date,
  delivered_on   date,
  featured       boolean not null default false,
  published      boolean not null default false,
  published_at   timestamptz,
  seo_title      text,
  seo_description text,
  seo_keywords   text[],
  canonical_url  text,
  og_title       text,
  og_description text,
  og_image_url   text,
  robots         text not null default 'index,follow',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_industry_idx on public.projects (industry);
create index if not exists projects_published_idx on public.projects (published, featured desc, created_at desc);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

create table if not exists public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  url           text not null,
  alt           text not null default '',
  caption       text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists project_images_project_idx on public.project_images (project_id, display_order);

-- BUILD SIGNAL — optional per-project phase progress, admin-managed.
create table if not exists public.project_phases (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  phase_key     text not null check (phase_key in ('discover','design','development','testing')),
  label         text not null,
  progress      integer not null default 0 check (progress between 0 and 100),
  note          text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (project_id, phase_key)
);

-- ---------------------------------------------------------------------------
-- experiments — "Inside the Lab"
-- ---------------------------------------------------------------------------
create table if not exists public.experiments (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  code            text,                 -- e.g. "EXPERIMENT #014"
  title           text not null,
  summary         text not null,
  body            text,
  status          text not null default 'experiment'
                    check (status in ('idea','experiment','in_development','live','archived')),
  hypothesis      text,
  finding         text,
  progress        integer not null default 0 check (progress between 0 and 100),
  technologies    text[] not null default '{}',
  image_url       text,
  started_on      date,
  concluded_on    date,
  featured        boolean not null default false,
  published       boolean not null default false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keywords    text[],
  canonical_url   text,
  og_title        text,
  og_description  text,
  og_image_url    text,
  robots          text not null default 'index,follow',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists experiments_slug_idx on public.experiments (slug);
create index if not exists experiments_status_idx on public.experiments (status);
create index if not exists experiments_published_idx on public.experiments (published, featured desc, started_on desc);

-- ---------------------------------------------------------------------------
-- customers + testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  industry      text,
  website_url   text,
  logo_url      text,
  logo_alt      text,
  description   text,
  is_public     boolean not null default false,   -- consent flag: only show when true
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists customers_slug_idx on public.customers (slug);
create index if not exists customers_published_idx on public.customers (published, is_public);

create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid references public.customers(id) on delete set null,
  author_name    text not null,
  author_role    text,
  author_company text,
  author_image_url text,
  company_logo_url text,
  quote          text not null,
  project_id     uuid references public.projects(id) on delete set null,
  source_url     text,          -- where the quote can be verified
  given_on       date,
  featured       boolean not null default false,
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists testimonials_published_idx on public.testimonials (published, featured desc, given_on desc);

-- ---------------------------------------------------------------------------
-- team
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  role          text not null,
  bio           text,
  photo_url     text,
  skills        text[] not null default '{}',
  social_links  jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists team_members_published_idx on public.team_members (published, display_order);

-- ---------------------------------------------------------------------------
-- blog
-- ---------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  excerpt          text,
  content          text not null,
  cover_image_url  text,
  cover_image_alt  text,
  author_id        uuid references public.authors(id) on delete set null,
  category_id      uuid references public.blog_categories(id) on delete set null,
  reading_minutes  integer,
  intent           text,           -- the search intent this article answers
  is_pillar        boolean not null default false,
  featured         boolean not null default false,
  published        boolean not null default false,
  published_at     timestamptz,
  updated_note     text,
  seo_title        text,
  seo_description  text,
  seo_keywords     text[],
  canonical_url    text,
  og_title         text,
  og_description   text,
  og_image_url     text,
  robots           text not null default 'index,follow',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_category_idx on public.blog_posts (category_id);
create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);
create index if not exists blog_posts_created_at_idx on public.blog_posts (created_at desc);

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id  uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Related reading, curated by an editor rather than computed. Powers internal linking.
create table if not exists public.blog_post_relations (
  post_id        uuid not null references public.blog_posts(id) on delete cascade,
  related_post_id uuid not null references public.blog_posts(id) on delete cascade,
  display_order  integer not null default 0,
  primary key (post_id, related_post_id)
);

-- ---------------------------------------------------------------------------
-- technologies — the interactive stack wall
-- ---------------------------------------------------------------------------
create table if not exists public.technologies (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  category      text not null
                  check (category in ('Frontend','Backend','Database','Cloud','AI','Mobile','DevOps')),
  description   text,           -- what we actually use it for at Inovexa
  icon          text,
  website_url   text,
  proficiency   text check (proficiency in ('core','working','exploring')),
  display_order integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists technologies_category_idx on public.technologies (category, display_order);
create index if not exists technologies_published_idx on public.technologies (published);

-- ---------------------------------------------------------------------------
-- contact_inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.contact_inquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  company         text,
  phone           text,
  project_type    text,
  budget_range    text,
  timeline        text,
  description     text not null,
  referral_source text,
  status          text not null default 'new'
                    check (status in ('new','read','in_discussion','won','archived','spam')),
  notes           text,
  ip_hash         text,
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status, created_at desc);
create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);

-- ---------------------------------------------------------------------------
-- seo_metadata — SEO for routes that have no content entity
-- (static pages, landing pages, redirects).
-- ---------------------------------------------------------------------------
create table if not exists public.seo_metadata (
  id               uuid primary key default gen_random_uuid(),
  path             text not null unique,   -- "/about", "/services" — leading slash
  title            text,
  description      text,
  keywords         text[],
  canonical_url    text,
  og_title         text,
  og_description   text,
  og_image_url     text,
  twitter_card     text not null default 'summary_large_image',
  robots           text not null default 'index,follow',
  structured_data  jsonb,                  -- admin-supplied JSON-LD overrides
  noindex          boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists seo_metadata_path_idx on public.seo_metadata (path);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings','navigation_items','authors','services','products','product_features',
    'projects','project_phases','experiments','customers','testimonials','team_members',
    'blog_categories','blog_tags','blog_posts','technologies','contact_inquiries','seo_metadata'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Full-text search across the searchable public content types
-- ---------------------------------------------------------------------------
create or replace view public.search_index as
  select 'product'::text as kind, p.slug, p.name as title,
         coalesce(p.tagline, p.short_description, '') as subtitle,
         array_to_string(p.technologies, ' ') as keywords, p.published_at
    from public.products p where p.published
  union all
  select 'project', pr.slug, pr.name,
         coalesce(pr.client_name, pr.industry, ''),
         array_to_string(pr.technologies, ' '), pr.published_at
    from public.projects pr where pr.published
  union all
  select 'service', s.slug, s.title, coalesce(s.tagline, s.summary), s.category, s.published_at
    from public.services s where s.published
  union all
  select 'insight', b.slug, b.title, coalesce(b.excerpt, ''),
         coalesce(array_to_string(b.seo_keywords, ' '), ''), b.published_at
    from public.blog_posts b where b.published
  union all
  select 'experiment', e.slug, e.title, e.summary,
         array_to_string(e.technologies, ' '), e.published_at
    from public.experiments e where e.published;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-media','product-media', true, 10485760,
    array['image/png','image/jpeg','image/webp','image/avif','image/svg+xml']),
  ('project-media','project-media', true, 10485760,
    array['image/png','image/jpeg','image/webp','image/avif','image/svg+xml']),
  ('team-media','team-media', true, 5242880,
    array['image/png','image/jpeg','image/webp','image/avif','image/svg+xml']),
  ('customer-logos','customer-logos', true, 2097152,
    array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('blog-media','blog-media', true, 10485760,
    array['image/png','image/jpeg','image/webp','image/avif','image/svg+xml']),
  ('og-images','og-images', true, 5242880,
    array['image/png','image/jpeg','image/webp','image/avif'])
on conflict (id) do nothing;
