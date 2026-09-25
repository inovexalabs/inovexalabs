# Inovexa Labs

The website for **Inovexa Labs** — an on-demand software development company and a
product innovation lab.

The site is built as *The Inovexa Lab*: a visitor moves through one journey —
**Idea → Experiment → Build → Launch → Impact** — and every section on it is driven
by the same Postgres database the team works from.

> We build software for today. We invent products for tomorrow.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, Server Components) |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS v4 (CSS-first tokens in `src/app/globals.css`) |
| Components | shadcn-style primitives on Radix (Dialog, Select, Tabs, Slot) |
| Data | Supabase — Postgres, Auth, Storage, Row Level Security |
| Caching | `unstable_cache` with tag-based invalidation |
| Deployment | Vercel |
| Icons / validation | `lucide-react`, `zod` |

No animation library. Motion is CSS plus one small `IntersectionObserver`
component, so the site stays fast on low-end mobile devices.

---

## Getting started

### 1. Install and configure

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # server-only, required for the contact form
ADMIN_ALLOWED_EMAILS=you@example.com # optional bootstrap for admin access
```

### 2. Create the database

Run the migrations in order, in the Supabase SQL editor or with the Supabase CLI:

```
supabase/migrations/0001_init.sql   # schema, indexes, storage buckets
supabase/migrations/0002_rls.sql    # row level security policies
supabase/migrations/0003_seed.sql   # real editorial baseline
```

Then create your admin user (Supabase dashboard → Authentication → Users), and make
them an administrator:

```sql
insert into public.admin_users (user_id, email, full_name)
select id, email, 'Founder' from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;
```

Alternatively, set `ADMIN_ALLOWED_EMAILS` and sign in once — the account is added to
the allowlist automatically. Only addresses named in that variable can self-promote.

### 3. Run

```bash
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # production build
```

The public site renders immediately, even before Supabase is configured — see
*Editorial baseline* below.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # document shell + Organisation/WebSite JSON-LD
│   ├── (site)/                 # public site: header, main, footer
│   │   ├── page.tsx            # homepage, composed from section components
│   │   ├── services/[slug]/     products/[slug]/   work/[slug]/
│   │   ├── lab/[slug]/          insights/[slug]/
│   │   ├── about/  contact/  search/  privacy/  terms/  cookies/
│   │   ├── sitemap.ts  error.tsx  loading.tsx
│   ├── admin/
│   │   ├── login/              # unauthenticated sign-in
│   │   └── (dashboard)/        # authenticated control room
│   ├── not-found.tsx  robots.ts
├── actions/                    # server actions (contact, admin CRUD, auth)
├── components/
│   ├── ui/                     # primitives: button, badge, input, select
│   ├── site/                   # chrome: header, footer, LAB SIGNAL, breadcrumbs
│   ├── lab/                    # LAB concepts: graph, pipeline, tech wall, BUILD SIGNAL
│   ├── cards/                  # product, project, service, experiment, post
│   ├── sections/               # homepage sections
│   └── admin/                  # shell, resource table, generated form
├── config/site.ts              # structural config: taxonomy, nav baseline, process
├── content/fallback.ts         # editorial baseline (see below)
├── lib/
│   ├── queries/                # cached read layer (content, metrics, search, legal)
│   ├── supabase/               # clients: public, server, browser, admin, middleware
│   ├── admin/                  # resource registry, auth, form coercion
│   ├── seo.ts                  # the metadata factory
│   └── structured-data.ts      # JSON-LD builders
├── types/content.ts            # row shapes for every entity
└── middleware.ts               # session refresh + /admin gate
```

### Two deliberate design decisions

**Two root layouts, one per audience.** Public pages live in the `(site)` route
group; `/admin` sits outside it. The control room never inherits the marketing
header and footer, and vice versa.

**A resource registry instead of bespoke admin pages.** Everything manageable is
described once in `src/lib/admin/resources.ts` — table, fields, list columns, cache
tags, SEO surface. The list, create and edit screens are generated from it. Adding a
content type is a registry entry, and every type gets identical validation, cache
invalidation and SEO handling for free.

---

## The real-data rule

This is the most important convention in the codebase, and it is enforced in the
architecture rather than by good intentions.

**Nothing on the public site is invented.** `src/lib/queries/metrics.ts` counts every
figure from real published rows and returns `null` when there is nothing to count. The
UI filters those nulls out, so a metric with no supporting data is *hidden*, never
estimated. There is no placeholder arithmetic anywhere in this repository.

`supabase/migrations/0003_seed.sql` therefore seeds only what is genuinely true:

- ✅ the eight services the company offers
- ✅ the technology stack it uses, with a note on what each part is for
- ✅ **Restra**, the real product in development
- ✅ experiments #014–#016, with their hypotheses published
- ✅ a small number of genuinely useful articles
- ❌ **no** customers, testimonials, projects, client logos or team photos

Those tables ship empty and the site renders honest empty states instead:

> **Your success story could be next.**
> We publish client work only with permission and only with accurate detail.

> **No borrowed praise here.**
> We have not published testimonials yet, because we would rather quote a client who
> is genuinely happy than invent one.

Every unverified section is designed to read as *"not yet"* rather than *"broken"*.
Fill those tables with real records and the sections populate themselves.

### Editorial baseline

`src/content/fallback.ts` mirrors the seed as typed data. It is used **only** when
`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` are absent, so the site is fully reviewable
before the database exists, and preview deployments never show an empty shell.
Components never import it directly — only the query layer does. The moment Supabase
is configured, the database becomes the single source of truth.

---

## Content management

Everything public is edited from `/admin`. Saving invalidates the affected cache tags
and revalidates the layout, so changes appear on the live site immediately — no
redeploy, no rebuild.

| Area | What it covers |
| --- | --- |
| Products | Status, features, gallery, technology, SEO |
| Client work | Case studies, verified metrics, **BUILD SIGNAL** phases |
| Services | Deliverables, approach, FAQs, engagement models |
| Experiments | Code, hypothesis, finding, progress |
| Insights | Articles, categories, tags, reading time, search intent |
| Team / Customers / Testimonials | People and proof, with a consent flag |
| Technologies | The stack wall, with proficiency indicators |
| Navigation | Header, footer and legal menus |
| Inquiries | Triage, status, internal notes |
| Settings | Company details, hero copy, SEO defaults, legal documents |

### SEO is a field, not an afterthought

Every publishable table carries its own `seo_title`, `seo_description`,
`seo_keywords`, `canonical_url`, `og_*` and `robots` columns. `buildMetadata()` in
`src/lib/seo.ts` resolves each field in one order:

1. the entity's own column (so `/products/restra` uses Restra's metadata automatically)
2. a route-level override in `seo_metadata` (for pages with no content entity)
3. site-wide defaults from `site_settings`

Switching a record to `noindex` in the admin panel is respected by the metadata, and
the sitemap omits anything that is unpublished, future-dated, or canonically hosted
elsewhere.

---

## Security

- **Row Level Security on every table.** `anon` may read published rows only.
  Writes require `public.is_admin()`, which consults the `admin_users` allowlist.
- **`contact_inquiries` has no public policy at all.** The form is submitted through
  a Server Action holding the service-role key, so the anon key can neither read
  inquiries nor inject rows directly.
- **The service-role key never reaches the browser.** It lives in
  `src/lib/supabase/admin.ts`, which is imported only from server code.
- **Form input is untrusted.** `coerceForm()` validates types, caps lengths, rejects
  unknown keys, and restricts `select` values to the options the registry declares.
- **Spam gates:** a honeypot field, a minimum fill time, and optional Cloudflare
  Turnstile verification — all checked server-side.
- **`/admin` is gated twice:** `middleware.ts` bounces unauthenticated requests before
  rendering, and `requireAdmin()` re-checks the allowlist before any query runs.

---

## SEO surface

- Dynamic `sitemap.xml` generated from published records only
- `robots.txt` disallowing `/admin`, `/api`, `/auth` and `/search`
- Canonical URLs on every route, plus `og:*` and Twitter metadata
- JSON-LD: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `Service`,
  `Article`/`BlogPosting`, `SoftwareApplication`, `ResearchProject`, `FAQPage`,
  `ItemList`
- Semantic heading hierarchy, breadcrumbs, descriptive alt text
- `noindex` on search results, the admin area, and the 404 page

Structured data is generated **only** from content that is also visible on the page.
There is no `aggregateRating`, no `review`, no `price` and no postal address unless a
real one is configured in settings — inventing those is misleading data.

### Keyword targets

Content and service pages target genuine search intent around custom software, web
and SaaS development, AI and automation, business software, and the Nepal technology
market. Nothing is keyword-stuffed, and no rankings are promised anywhere on the site.

---

## Performance and accessibility

- Server Components by default; client components are limited to interactive islands
  (mobile menu, lab graph, technology tabs, forms)
- Cookieless anon client for public reads so they stay cacheable
- `next/image` with AVIF/WebP, lazy loading below the fold
- Fonts self-hosted through `next/font`; no layout shift
- No animation library — CSS transitions plus one `IntersectionObserver`
- `prefers-reduced-motion` honoured globally
- Skip link, visible focus rings, labelled fields, `aria-invalid` + inline errors,
  accessible dialogs and tabs, `role="progressbar"` on all progress readouts

---

## Deploying

1. Push to a Git repository and import it into Vercel.
2. Set the environment variables from `.env.example` in the Vercel project.
   `SUPABASE_SERVICE_ROLE_KEY` must be set for the contact form to store inquiries.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin — canonical URLs, the sitemap
   and structured data all derive from it.
4. Run the migrations against the production database.
5. Add your admin user to `admin_users`.

---

## Manual verification checklist

Both `npm run typecheck` and `npm run build` pass cleanly. Beyond that, these are the
checks that matter and how to run them:

| Check | How |
| --- | --- |
| Every route resolves | `/services`, `/products/restra`, `/work`, `/lab`, `/insights`, `/about`, `/contact`, `/search`, legal pages, an unknown URL → 404 |
| Metadata is per-entity | `curl -s /products/restra \| grep -o '<title>[^<]*'` |
| Structured data is valid | Inspect the `application/ld+json` scripts, or use Google's Rich Results Test |
| Sitemap excludes drafts | Unpublish a record, then re-request `/sitemap.xml` |
| RLS blocks anonymous writes | With the anon key, `supabase.from('products').insert(...)` should fail |
| Inquiries are private | With the anon key, `select` on `contact_inquiries` should return nothing |
| Form states | Submit `/contact` empty (validation), filled (success), and with Supabase unset (graceful error) |
| Empty states | Unpublish all products — the homepage shows *"The lab is building."* |
| No horizontal overflow | Check at 320px, 375px, 768px, 1024px, 1440px |
| Keyboard only | Tab from the top: skip link → header → menu; Escape closes the mobile drawer |
| Reduced motion | Enable the OS setting and confirm reveals appear without animating |
