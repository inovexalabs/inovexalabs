-- Portfolio projects behind /projects and /projects/[slug]. Public visitors see
-- published rows only. Metrics (results) are optional and admin-entered: the
-- site never invents numbers.

-- Validates a JSONB array of {path, alt} gallery entries.
create or replace function public.is_valid_gallery(items jsonb, max_items integer)
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
        or jsonb_typeof(item -> 'path') is distinct from 'string'
        or jsonb_typeof(item -> 'alt') is distinct from 'string'
        or char_length(btrim(item ->> 'path')) not between 1 and 300
        or char_length(btrim(item ->> 'alt')) not between 3 and 200
    );
$$;

-- Validates a JSONB array of {metric, label, description} result blocks.
create or replace function public.is_valid_metrics(items jsonb, max_items integer)
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
        or jsonb_typeof(item -> 'metric') is distinct from 'string'
        or jsonb_typeof(item -> 'label') is distinct from 'string'
        or jsonb_typeof(item -> 'description') is distinct from 'string'
        or char_length(btrim(item ->> 'metric')) not between 1 and 12
        or char_length(btrim(item ->> 'label')) not between 2 and 60
        or char_length(btrim(item ->> 'description')) not between 3 and 240
    );
$$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text not null default '',
  category text not null default 'Other',
  client_name text,
  industry text,
  cover_image_path text,
  cover_image_alt text,
  gallery jsonb not null default '[]'::jsonb,
  technologies text[] not null default '{}',
  challenge text,
  solution text,
  implementation text,
  results text,
  metrics jsonb not null default '[]'::jsonb,
  project_url text,
  github_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_title_length check (char_length(title) between 2 and 90),
  constraint projects_short_length check (char_length(short_description) between 20 and 220),
  constraint projects_description_length check (char_length(description) <= 12000),
  constraint projects_category_length check (char_length(category) between 2 and 40),
  constraint projects_client_length check (client_name is null or char_length(client_name) between 2 and 80),
  constraint projects_industry_length check (industry is null or char_length(industry) between 2 and 60),
  constraint projects_cover_alt_required check (
    cover_image_path is null or char_length(btrim(coalesce(cover_image_alt, ''))) > 0
  ),
  constraint projects_cover_alt_length check (cover_image_alt is null or char_length(cover_image_alt) <= 200),
  constraint projects_gallery_valid check (public.is_valid_gallery(gallery, 8)),
  constraint projects_technologies_valid check (public.is_valid_tags(technologies, 24, 40)),
  constraint projects_challenge_length check (challenge is null or char_length(challenge) <= 4000),
  constraint projects_solution_length check (solution is null or char_length(solution) <= 4000),
  constraint projects_implementation_length check (implementation is null or char_length(implementation) <= 6000),
  constraint projects_results_length check (results is null or char_length(results) <= 4000),
  constraint projects_metrics_valid check (public.is_valid_metrics(metrics, 6)),
  constraint projects_project_url_format check (
    project_url is null or project_url ~ '^https://[^\s]+$'
  ),
  constraint projects_github_url_format check (
    github_url is null or github_url ~ '^https://[^\s]+$'
  ),
  constraint projects_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint projects_seo_description_length check (seo_description is null or char_length(seo_description) <= 170)
);

create index projects_status_sort_idx on public.projects (status, sort_order);
create index projects_featured_idx on public.projects (status, featured, sort_order);
create index projects_category_idx on public.projects (status, category);

-- Case-insensitive title/summary search on the public listing.
create index projects_search_idx on public.projects using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(short_description, ''))
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "Published projects are public"
  on public.projects for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all projects"
  on public.projects for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create projects"
  on public.projects for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using ((select public.is_admin()));
