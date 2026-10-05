-- Full service content for /services/[slug]: overview, problems, capabilities
-- (features), technologies, process, outcomes, FAQ and a per-service CTA.
-- Structured lists are JSONB arrays, validated here and mirrored by the Zod
-- schemas in lib/validations/service.ts.

-- Validates a JSONB array of objects with two required string keys.
create or replace function public.is_valid_text_pairs(
  items jsonb,
  first_key text,
  second_key text,
  max_items integer,
  first_min integer,
  first_max integer,
  second_min integer,
  second_max integer
)
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
        or jsonb_typeof(item -> first_key) is distinct from 'string'
        or jsonb_typeof(item -> second_key) is distinct from 'string'
        or char_length(btrim(item ->> first_key)) not between first_min and first_max
        or char_length(btrim(item ->> second_key)) not between second_min and second_max
    );
$$;

-- Validates a text[] of short, non-empty, unique tags.
create or replace function public.is_valid_tags(tags text[], max_items integer, max_length integer)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select cardinality(tags) <= max_items
    and not exists (
      select 1 from unnest(tags) as tag
      where char_length(btrim(tag)) not between 1 and max_length
    )
    and cardinality(tags) = (select count(distinct lower(tag)) from unnest(tags) as tag);
$$;

alter table public.services rename column body_md to overview;

alter table public.services
  add column problems jsonb not null default '[]'::jsonb,
  add column features jsonb not null default '[]'::jsonb,
  add column technologies text[] not null default '{}',
  add column process jsonb not null default '[]'::jsonb,
  add column outcomes jsonb not null default '[]'::jsonb,
  add column faqs jsonb not null default '[]'::jsonb,
  add column cta_title text not null default 'Have a project in mind?',
  add column cta_description text not null default 'Tell us what you are building and we will reply within two working days with next steps.',
  add column cta_label text not null default 'Start a Project',
  add column cta_href text not null default '/contact';

alter table public.services
  add constraint services_overview_length check (char_length(overview) <= 8000),
  add constraint services_problems_valid check (public.is_valid_text_pairs(problems, 'title', 'description', 8, 2, 80, 10, 400)),
  add constraint services_features_valid check (public.is_valid_text_pairs(features, 'title', 'description', 12, 2, 80, 10, 400)),
  add constraint services_process_valid check (public.is_valid_text_pairs(process, 'title', 'description', 8, 2, 80, 10, 400)),
  add constraint services_outcomes_valid check (public.is_valid_text_pairs(outcomes, 'title', 'description', 8, 2, 80, 10, 400)),
  add constraint services_faqs_valid check (public.is_valid_text_pairs(faqs, 'question', 'answer', 12, 5, 200, 10, 1200)),
  add constraint services_technologies_valid check (public.is_valid_tags(technologies, 30, 40)),
  add constraint services_cta_title_length check (char_length(cta_title) between 5 and 100),
  add constraint services_cta_description_length check (char_length(cta_description) between 10 and 280),
  add constraint services_cta_label_length check (char_length(cta_label) between 2 and 32),
  add constraint services_cta_href_format check (cta_href ~ '^(/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https://[^\s]+)$'),
  add constraint services_cover_alt_length check (cover_image_alt is null or char_length(cover_image_alt) <= 200);

-- The icon list gains "palette" for design services. Keep in sync with lib/constants/service-icons.ts
alter table public.services drop constraint services_icon_check;
alter table public.services add constraint services_icon_check check (
  icon in ('code', 'globe', 'smartphone', 'brain', 'shield', 'workflow', 'cloud', 'database', 'cpu', 'layers', 'shopping-cart', 'sparkles', 'palette')
);
