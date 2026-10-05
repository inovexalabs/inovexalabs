-- Knowledge hub: blog posts behind /blog and /blog/[slug].
--
-- Content is a small, safe markup (## headings, - bullets, **bold**, `code`,
-- ``` fences). It is rendered as React elements by components/blog/article-body.tsx
-- — never through dangerouslySetInnerHTML — and parsed into a table of
-- contents. Category and tags live on the post, so an admin edits them in one
-- place and both filters stay in sync.

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null default '',
  cover_image_path text,
  cover_image_alt text,
  category text not null default 'General',
  tags text[] not null default '{}',
  author_name text,
  reading_time smallint not null default 1,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint blog_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint blog_title_length check (char_length(title) between 5 and 120),
  constraint blog_excerpt_length check (char_length(excerpt) between 20 and 260),
  constraint blog_content_length check (char_length(content) between 100 and 120000),
  constraint blog_category_length check (char_length(category) between 2 and 40),
  constraint blog_tags_valid check (public.is_valid_tags(tags, 8, 30)),
  constraint blog_author_length check (author_name is null or char_length(author_name) between 2 and 60),
  constraint blog_reading_time_range check (reading_time between 1 and 240),
  constraint blog_cover_alt_required check (
    cover_image_path is null or char_length(btrim(coalesce(cover_image_alt, ''))) > 0
  ),
  constraint blog_cover_alt_length check (cover_image_alt is null or char_length(cover_image_alt) <= 200),
  constraint blog_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  constraint blog_seo_description_length check (seo_description is null or char_length(seo_description) <= 170),
  constraint blog_canonical_url_format check (canonical_url is null or canonical_url ~ '^https://[^\s]+$')
);

create index blog_status_published_idx on public.blog_posts (status, published_at desc);
create index blog_featured_idx on public.blog_posts (status, featured, published_at desc);
create index blog_category_idx on public.blog_posts (status, category);
create index blog_tags_idx on public.blog_posts using gin (tags);
create index blog_search_idx on public.blog_posts using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')
  )
);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

create policy "Published posts are public"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all posts"
  on public.blog_posts for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create posts"
  on public.blog_posts for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update posts"
  on public.blog_posts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using ((select public.is_admin()));
