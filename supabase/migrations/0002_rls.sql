-- ===========================================================================
-- INOVEXA LABS — 0002 ROW LEVEL SECURITY
--
-- Model:
--   * anon / unauthenticated  -> may read PUBLISHED content only.
--   * authenticated + admin   -> full read and write.
--   * authenticated non-admin -> treated exactly like anon.
--   * contact_inquiries       -> no public policy at all. Writes go through a
--                                server action using the service-role key, so
--                                the anon key can never read or inject leads.
--   * storage                 -> public read of published media buckets,
--                                admin-only writes.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- admin_users — never publicly readable; managed out-of-band or by an admin.
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin_users_admin_manage" on public.admin_users;
create policy "admin_users_admin_manage" on public.admin_users
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Helper to install the standard policy set on a content table.
--   publicReadExpression: SQL predicate granting anon read, or NULL for none.
-- ---------------------------------------------------------------------------
create or replace function public.apply_content_policies(
  tbl text,
  public_read_expression text
)
returns void
language plpgsql
as $$
begin
  execute format('alter table public.%I enable row level security;', tbl);

  if public_read_expression is not null then
    execute format('drop policy if exists %I on public.%I;', tbl || '_public_read', tbl);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (%s);',
      tbl || '_public_read', tbl, public_read_expression
    );
  end if;

  execute format('drop policy if exists %I on public.%I;', tbl || '_admin_read', tbl);
  execute format(
    'create policy %I on public.%I for select to authenticated using (public.is_admin());',
    tbl || '_admin_read', tbl
  );

  execute format('drop policy if exists %I on public.%I;', tbl || '_admin_write', tbl);
  execute format(
    'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());',
    tbl || '_admin_write', tbl
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Apply the standard content policy set
-- ---------------------------------------------------------------------------
select public.apply_content_policies('services',        'published = true');
select public.apply_content_policies('products',        'published = true');
select public.apply_content_policies('product_features',
  'exists (select 1 from public.products p where p.id = product_features.product_id and p.published)');
select public.apply_content_policies('product_images',
  'exists (select 1 from public.products p where p.id = product_images.product_id and p.published)');
select public.apply_content_policies('projects',        'published = true');
select public.apply_content_policies('project_images',
  'exists (select 1 from public.projects p where p.id = project_images.project_id and p.published)');
select public.apply_content_policies('project_phases',
  'exists (select 1 from public.projects p where p.id = project_phases.project_id and p.published)');
select public.apply_content_policies('experiments',     'published = true');
select public.apply_content_policies('customers',       'published = true and is_public = true');
select public.apply_content_policies('testimonials',    'published = true');
select public.apply_content_policies('team_members',    'published = true');
select public.apply_content_policies('blog_posts',      'published = true and published_at is not null and published_at <= now()');
select public.apply_content_policies('blog_categories',  'true');
select public.apply_content_policies('blog_tags',        'true');
select public.apply_content_policies('authors',          'true');
select public.apply_content_policies('technologies',     'published = true');
select public.apply_content_policies('navigation_items', 'published = true');
select public.apply_content_policies('seo_metadata',     'not noindex');

-- blog join tables inherit their post's visibility.
select public.apply_content_policies('blog_post_tags',
  'exists (select 1 from public.blog_posts b where b.id = blog_post_tags.post_id and b.published)');
select public.apply_content_policies('blog_post_relations',
  'exists (select 1 from public.blog_posts b where b.id = blog_post_relations.post_id and b.published)');

-- ---------------------------------------------------------------------------
-- site_settings — public read except the "internal" group.
-- ---------------------------------------------------------------------------
select public.apply_content_policies('site_settings', 'group_name <> ''internal''');

-- ---------------------------------------------------------------------------
-- contact_inquiries — locked down completely. No anon policy is created on
-- purpose; the public form submits through a server action holding the
-- service-role key, and the key never reaches the browser.
-- ---------------------------------------------------------------------------
alter table public.contact_inquiries enable row level security;

drop policy if exists "contact_inquiries_admin_read" on public.contact_inquiries;
create policy "contact_inquiries_admin_read" on public.contact_inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "contact_inquiries_admin_write" on public.contact_inquiries;
create policy "contact_inquiries_admin_write" on public.contact_inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- search_index view — respect the caller's RLS, then expose to anon.
-- ---------------------------------------------------------------------------
alter view public.search_index set (security_invoker = on);
grant select on public.search_index to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage policies
-- ---------------------------------------------------------------------------
drop policy if exists "inovexa_public_media_read" on storage.objects;
create policy "inovexa_public_media_read" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id in ('product-media','project-media','team-media','customer-logos','blog-media','og-images')
  );

drop policy if exists "inovexa_admin_media_write" on storage.objects;
create policy "inovexa_admin_media_write" on storage.objects
  for all to authenticated
  using (
    bucket_id in ('product-media','project-media','team-media','customer-logos','blog-media','og-images')
    and public.is_admin()
  )
  with check (
    bucket_id in ('product-media','project-media','team-media','customer-logos','blog-media','og-images')
    and public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- Convenience: promote the founding email to admin.
-- Replace the address before running, or add admin_users rows manually.
-- ---------------------------------------------------------------------------
-- insert into public.admin_users (user_id, email, full_name)
-- select id, email, 'Founder' from auth.users where email = 'you@inovexalabs.com'
-- on conflict (user_id) do nothing;
