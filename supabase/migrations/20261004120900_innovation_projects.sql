-- Innovation Lab: internal experiments, prototypes and research behind
-- /innovation and /innovation/[slug].
--
-- Two independent states:
--   status = publication state shared with every other table (draft/published/archived)
--   stage  = where the experiment is in its life cycle (research … archived)

create type public.lab_stage as enum (
  'research', 'prototype', 'building', 'testing', 'live', 'archived'
);

create type public.innovation_category as enum (
  'ai', 'cybersecurity', 'web3', 'robotics', 'automation',
  'developer-tools', 'experimental-interfaces', 'other'
);

create table public.innovation_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category public.innovation_category not null default 'other',
  stage public.lab_stage not null default 'research',
  description text not null,
  long_description text not null default '',
  problem text,
  experiment text,
  learnings text,
  future_direction text,
  cover_image_path text,
  cover_image_alt text,
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint innovation_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint innovation_title_length check (char_length(title) between 2 and 90),
  constraint innovation_description_length check (char_length(description) between 20 and 240),
  constraint innovation_long_description_length check (char_length(long_description) <= 12000),
  constraint innovation_problem_length check (problem is null or char_length(problem) <= 3000),
  constraint innovation_experiment_length check (experiment is null or char_length(experiment) <= 4000),
  constraint innovation_learnings_length check (learnings is null or char_length(learnings) <= 4000),
  constraint innovation_future_length check (future_direction is null or char_length(future_direction) <= 3000),
  constraint innovation_cover_alt_required check (
    cover_image_path is null or char_length(btrim(coalesce(cover_image_alt, ''))) > 0
  ),
  constraint innovation_cover_alt_length check (cover_image_alt is null or char_length(cover_image_alt) <= 200),
  constraint innovation_technologies_valid check (public.is_valid_tags(technologies, 16, 40)),
  constraint innovation_github_url_format check (github_url is null or github_url ~ '^https://[^\s]+$'),
  constraint innovation_demo_url_format check (demo_url is null or demo_url ~ '^https://[^\s]+$'),
  constraint innovation_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint innovation_seo_description_length check (seo_description is null or char_length(seo_description) <= 170)
);

create index innovation_status_sort_idx on public.innovation_projects (status, sort_order);
create index innovation_category_idx on public.innovation_projects (status, category);
create index innovation_stage_idx on public.innovation_projects (status, stage);
create index innovation_search_idx on public.innovation_projects using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

create trigger innovation_projects_set_updated_at
  before update on public.innovation_projects
  for each row execute function public.set_updated_at();

alter table public.innovation_projects enable row level security;

create policy "Published experiments are public"
  on public.innovation_projects for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all experiments"
  on public.innovation_projects for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create experiments"
  on public.innovation_projects for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update experiments"
  on public.innovation_projects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete experiments"
  on public.innovation_projects for delete
  to authenticated
  using ((select public.is_admin()));
