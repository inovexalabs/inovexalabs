-- Public media bucket for CMS images (service covers, later projects and posts).
-- Files are served from the public URL; only admins can write, replace or
-- delete them. No anonymous select policy, so the bucket cannot be listed.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Admins can read media objects" on storage.objects;
create policy "Admins can read media objects"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admins can replace media" on storage.objects;
create policy "Admins can replace media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
