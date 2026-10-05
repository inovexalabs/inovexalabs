-- Reusable FAQ entries. Questions can be attached to a page (contact, services
-- list, general) and are published as FAQ structured data where they appear.
-- Service-specific FAQs stay embedded on the service itself.

create type public.faq_page as enum (
  'general', 'services', 'projects', 'innovation', 'blog', 'contact'
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  page public.faq_page not null default 'general',
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint faq_question_length check (char_length(question) between 5 and 200),
  constraint faq_answer_length check (char_length(answer) between 10 and 1200)
);

create index faq_page_sort_idx on public.faq_items (page, status, sort_order);

create trigger faq_items_set_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

create policy "Published FAQs are public"
  on public.faq_items for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all FAQs"
  on public.faq_items for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create FAQs"
  on public.faq_items for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update FAQs"
  on public.faq_items for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete FAQs"
  on public.faq_items for delete
  to authenticated
  using ((select public.is_admin()));
