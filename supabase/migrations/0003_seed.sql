-- ===========================================================================
-- INOVEXA LABS — 0003 SEED
--
-- Editorial baseline: the services Inovexa actually offers, the stack it
-- actually uses, the products and experiments actually running in the lab,
-- and a small number of genuinely useful articles.
--
-- DELIBERATELY EMPTY:
--   customers, testimonials, projects, team_members, product_images,
--   project_images, project_phases
-- These are populated only with verified information. The public site renders
-- honest empty states until then. Never seed invented logos, quotes or metrics.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, group_name, label, value) values
  ('company', 'general', 'Company details', jsonb_build_object(
    'name', 'Inovexa Labs',
    'legalName', 'Inovexa Labs',
    'positioning', 'On-demand software development company and product innovation lab.',
    'promise', 'We build software for today. We invent products for tomorrow.',
    'supportingLine', 'From custom software solutions to products born inside our lab, Inovexa Labs turns ideas into technology that works.',
    'shortDescription', 'Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.',
    'founded', '',
    'email', 'hello@inovexalabs.com',
    'phone', '',
    'addressLine', '',
    'city', 'Kathmandu',
    'region', 'Bagmati',
    'country', 'Nepal',
    'countryCode', 'NP',
    'postalCode', '',
    'latitude', '',
    'longitude', '',
    'businessHours', ''
  )),
  ('socials', 'general', 'Social profiles', jsonb_build_object(
    'x', '', 'linkedin', '', 'github', '', 'instagram', ''
  )),
  ('hero', 'homepage', 'Hero section', jsonb_build_object(
    'eyebrow', 'INOVEXA LABS · SOFTWARE × INNOVATION',
    'headlineLine1', 'We build software for today.',
    'headlineLine2', 'We invent products for tomorrow.',
    'supporting', 'Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.',
    'primaryCtaLabel', 'Start a Project',
    'primaryCtaHref', '/contact',
    'secondaryCtaLabel', 'Explore Our Products',
    'secondaryCtaHref', '/products'
  )),
  ('seo_defaults', 'seo', 'Default SEO', jsonb_build_object(
    'titleTemplate', '%s | Inovexa Labs',
    'defaultTitle', 'Inovexa Labs — Software Development & Product Innovation',
    'defaultDescription', 'Inovexa Labs is an on-demand software development company and product innovation lab. We build custom software for businesses and develop our own technology products.',
    'ogImageUrl', '',
    'twitterHandle', '',
    'robots', 'index,follow'
  )),
  ('legal', 'internal', 'Internal notes', jsonb_build_object(
    'reviewedOn', '',
    'note', 'The "internal" group is never exposed to the public site.'
  ))
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- navigation
-- ---------------------------------------------------------------------------
insert into public.navigation_items (location, title, href, display_order) values
  ('header', 'Products', '/products', 1),
  ('header', 'Services', '/services', 2),
  ('header', 'Work',     '/work',     3),
  ('header', 'Lab',      '/lab',      4),
  ('header', 'Insights', '/insights', 5),
  ('header', 'About',    '/about',    6),
  ('footer', 'Services', '/services', 1),
  ('footer', 'Products', '/products', 2),
  ('footer', 'Work',     '/work',     3),
  ('footer', 'Lab',      '/lab',      4),
  ('footer', 'Insights', '/insights', 5),
  ('footer', 'About',    '/about',    6),
  ('footer', 'Start a Project', '/contact', 7),
  ('legal', 'Privacy Policy', '/privacy', 1),
  ('legal', 'Terms of Service', '/terms', 2),
  ('legal', 'Cookie Policy', '/cookies', 3)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
insert into public.services
  (slug, title, tagline, summary, body, icon, category, deliverables, process_notes,
   engagement_models, faqs, display_order, featured, published, published_at,
   seo_title, seo_description)
values
(
  'web-development',
  'Web Development',
  'High-performance websites and web applications.',
  'Fast, accessible, server-rendered web applications built on Next.js and TypeScript — engineered for real traffic, not just for a design review.',
  $md$We build web products the way we would want them built for us: server-rendered first, typed end to end, and fast on a mid-range Android phone over a 3G connection.

That means real attention to Core Web Vitals, semantic HTML, and the boring details — caching headers, image pipelines, error boundaries, and a 404 page that helps rather than dead-ends.

Whether it is a marketing site that has to rank, a customer portal behind authentication, or an internal tool that replaces six spreadsheets, the engineering approach is the same: model the data properly, render on the server, and ship the smallest amount of JavaScript that does the job.$md$,
  'globe', 'Engineering',
  '["Server-rendered Next.js applications","Design system implementation","Technical SEO and structured data","Performance and Core Web Vitals work","CMS and headless integrations","Authentication and role-based access","Analytics and error monitoring","Accessibility to WCAG 2.2 AA"]'::jsonb,
  '["Architecture and data model first","Server Components by default, client only where interaction demands it","Deploy preview on every pull request","Lighthouse and axe checks before launch"]'::jsonb,
  '["Fixed-scope project","Monthly retainer","Embedded with your team"]'::jsonb,
  '[{"q":"How long does a web application take?","a":"A focused first release is typically six to twelve weeks. We scope the smallest version that delivers real value and iterate from production feedback."},{"q":"Do you work with an existing codebase?","a":"Yes. We start with a short audit covering architecture, test coverage, dependency risk and deployment, then agree on a remediation plan before writing features."}]'::jsonb,
  1, true, true, now(),
  'Web Development Company in Nepal | Next.js & TypeScript',
  'Inovexa Labs builds high-performance, server-rendered web applications and websites in Nepal with Next.js and TypeScript — engineered for speed, accessibility and search.'
),
(
  'saas-development',
  'SaaS Development',
  'Scalable software products from concept to production.',
  'Multi-tenant architecture, billing, onboarding, and the operational scaffolding that turns a feature set into a product people pay for.',
  $md$Most SaaS projects fail on the unglamorous parts: tenant isolation, billing edge cases, invitation flows, and knowing what happened when something broke at 3am.

We build the whole system. Multi-tenancy with row-level security rather than application-level filtering. Subscription state reconciled against the payment provider rather than trusted blindly. Audit trails, feature gating, and structured logging from the first commit.

Because we also run products of our own, we have lived with the consequences of these decisions. That shows up in what we refuse to ship.$md$,
  'layers', 'Product',
  '["Multi-tenant data architecture","Subscription billing and entitlement","Self-serve onboarding flows","Admin and back-office tooling","Usage metering and analytics","Transactional email and notifications","Role and permission models","Migration and scaling strategy"]'::jsonb,
  '["Tenant isolation enforced at the database, not the ORM","Billing state treated as a projection you can rebuild","Every background job idempotent and observable"]'::jsonb,
  '["MVP build (fixed scope)","Fractional product engineering","Technical co-founder partnership"]'::jsonb,
  '[{"q":"Can you take over an existing SaaS?","a":"Usually. We audit the data model, billing correctness and deployment story first, because those are the three areas where inherited problems compound fastest."},{"q":"Who owns the code?","a":"You do. We work in your repositories from the first commit and hand over documentation as part of the engagement."}]'::jsonb,
  2, true, true, now(),
  'SaaS Development Company in Nepal | Multi-tenant Product Engineering',
  'Inovexa Labs builds scalable SaaS products: multi-tenant architecture, billing, onboarding and the operational tooling that turns features into a product customers pay for.'
),
(
  'mobile-development',
  'Mobile Development',
  'Modern mobile applications.',
  'Cross-platform and native mobile apps designed for real devices, real networks, and users who will not tolerate a spinner.',
  $md$Mobile is where the constraints bite hardest: intermittent connectivity, limited memory, fragmented devices, and app-store review cycles you cannot hot-patch your way out of.

We build with React Native and Expo where a shared codebase is the right trade, and go closer to the platform when the product genuinely needs it. Offline-first data sync, background tasks, push notifications and deep linking are treated as first-class requirements, not stretch goals.

Every release goes through internal device testing before it reaches a reviewer.$md$,
  'smartphone', 'Engineering',
  '["React Native and Expo applications","Native iOS and Android modules","Offline-first sync and local storage","Push notifications and deep linking","App Store and Play Store release management","Crash reporting and release health","Mobile performance profiling"]'::jsonb,
  '["Test on low-end devices, not just flagships","Design for offline and error states first","Staged rollouts with crash-rate gates"]'::jsonb,
  '["Fixed-scope project","Retainer with release cadence","Prototype to validate an idea"]'::jsonb,
  '[{"q":"Cross-platform or native?","a":"Cross-platform unless the product depends on heavy hardware integration, advanced graphics or platform-specific UI conventions. We will tell you which side of that line you are on."}]'::jsonb,
  3, false, true, now(),
  'Mobile App Development Company in Nepal | iOS & Android',
  'Inovexa Labs develops modern mobile applications with React Native and Expo — offline-first, instrumented, and tested on real devices in real network conditions.'
),
(
  'ai-development',
  'AI & Automation',
  'AI-powered workflows, assistants, and intelligent systems.',
  'Applied AI that solves a defined business problem — retrieval, extraction, classification and agents wired into your actual systems, with evaluation harnesses so quality is measurable.',
  $md$There is a large gap between an AI demo and an AI system you can depend on. Closing it is mostly engineering: retrieval that returns the right context, prompts under version control, structured outputs validated against a schema, and an evaluation set that tells you when a change made things worse.

We build AI into existing workflows rather than bolting a chatbot onto the side. Document processing that writes to your database. Support triage that routes to the right queue with a confidence threshold and a human fallback. Internal assistants that answer from your own documentation and cite the source.

Where a deterministic rule does the job better than a model, we will say so.$md$,
  'sparkles', 'Intelligence',
  '["Retrieval-augmented generation over your data","Document extraction and classification","Workflow automation and agent pipelines","LLM evaluation harnesses and regression tests","Structured output validation","Vector search and embeddings","Human-in-the-loop review interfaces","Cost and latency optimisation"]'::jsonb,
  '["Start from a measurable task, not a model","Golden dataset before behaviour change","Humans stay in the loop for consequential actions","Never put a model in the path of a deterministic decision"]'::jsonb,
  '["Discovery sprint","Fixed-scope build","Retainer for ongoing model operations"]'::jsonb,
  '[{"q":"Will our data be used to train models?","a":"No. We use API providers with training opt-out alongside your data-protection requirements, and we will document exactly where data flows in the architecture."},{"q":"What if AI is the wrong answer?","a":"Then we say so and propose the simpler system. A rule engine or a better form is cheaper to run and easier to trust."}]'::jsonb,
  4, true, true, now(),
  'AI Development & Automation Company in Nepal | Applied AI Systems',
  'Inovexa Labs builds applied AI systems: retrieval, extraction, classification and agent workflows with evaluation harnesses — engineered to be measurable and dependable.'
),
(
  'business-software',
  'Business Software',
  'Custom systems designed around business processes.',
  'Software shaped around how your business actually operates — inventory, operations, field teams, reporting — replacing spreadsheet sprawl with one system of record.',
  $md$Off-the-shelf software forces your process into someone else's assumptions. Custom software is worth building when your process is the advantage, when the spreadsheets have become load-bearing, or when nobody can answer a straightforward question without three days of manual reconciliation.

These projects start with mapping the work as it really happens — including the exceptions and the person who is the unofficial integration layer. Then we build the smallest system that removes the most friction, and put it in front of users while it is still cheap to change.

Reporting is part of the build, not an afterthought. If the system cannot answer the questions the business asks weekly, it has not finished its job.$md$,
  'workflow', 'Engineering',
  '["Operations and inventory systems","Booking, scheduling and dispatch","Field and mobile workforce tools","Approval and document workflows","Custom reporting and dashboards","Legacy system and spreadsheet migration","Role-based internal tooling","Third-party and accounting integrations"]'::jsonb,
  '["Map the process before modelling the data","Ship one department at a time","Migrate data with a rollback plan","Measure adoption, not licence count"]'::jsonb,
  '["Discovery and scoping phase","Phased delivery","Support and maintenance retainer"]'::jsonb,
  '[{"q":"Should we replace our ERP?","a":"Usually not at once. We prefer to build the specific capability the ERP handles badly, integrate with it, and only replace the whole thing when the case is genuinely strong."}]'::jsonb,
  5, true, true, now(),
  'Custom Business Software Development in Nepal | Inovexa Labs',
  'Inovexa Labs builds custom business software in Nepal — operations, inventory, dispatch and reporting systems designed around how your business actually works.'
),
(
  'api-backend',
  'API & Backend Engineering',
  'Secure, scalable backend infrastructure.',
  'APIs and data platforms with clear contracts, sane migrations, real observability and the security model written down.',
  $md$Backends are where correctness lives. We design schemas that survive contact with reality, expose APIs with versioned contracts, and enforce authorisation at the data layer so a bug in one handler cannot leak another tenant's records.

Migrations are reversible, secrets never touch the client, and every endpoint has a defined failure mode. Background work is idempotent and observable, because silent job failures are the most expensive kind.

We are equally comfortable extending an existing service and greenfielding a platform, in TypeScript, Python or Go.$md$,
  'server', 'Engineering',
  '["REST and RPC API design","PostgreSQL schema and query optimisation","Authentication, authorisation and RLS","Event and job processing","Third-party API integrations","Rate limiting and abuse protection","Observability, tracing and alerting","Documentation and contract testing"]'::jsonb,
  '["Authorisation enforced at the database","Every migration reversible","Idempotency keys on all mutating endpoints","Load-test before you need to"]'::jsonb,
  '["Architecture review","Fixed-scope build","Ongoing platform ownership"]'::jsonb,
  '[{"q":"Can you review our existing backend?","a":"Yes — a structured audit covering schema, query performance, authorisation correctness and operational readiness, with prioritised findings and effort estimates."}]'::jsonb,
  6, false, true, now(),
  'API & Backend Engineering in Nepal | Secure Scalable Infrastructure',
  'Inovexa Labs engineers secure, scalable APIs and backend infrastructure — PostgreSQL, serverless and containerised workloads, with authorisation enforced at the data layer.'
),
(
  'ecommerce',
  'E-commerce',
  'Modern commerce platforms and digital stores.',
  'Storefronts and commerce systems that load fast, convert on mobile, and stay maintainable when merchandising, pricing and fulfilment get complicated.',
  $md$Commerce punishes sloppy engineering: every millisecond and every dropped edge case shows up in revenue. We build storefronts that render on the server, checkout flows that survive flaky mobile networks, and back-office tools that let a merchandising team work without filing a ticket.

We work with established platforms where they fit, and build custom commerce when catalogue logic, pricing rules or fulfilment workflows have outgrown the defaults.

Payments are handled through providers that keep card data out of your systems. We do not store what we do not need.$md$,
  'shopping-bag', 'Engineering',
  '["Headless and custom storefronts","Cart, checkout and payment integration","Product catalogue and pricing rules","Inventory and fulfilment workflows","Order management and notifications","Search and merchandising","Analytics, events and conversion tracking","Subscription and recurring billing"]'::jsonb,
  '["Mobile-first checkout, tested on real devices","Server-render catalogue and product pages for SEO","Never store card data","Instrument the funnel before optimising it"]'::jsonb,
  '["Fixed-scope build","Commerce retainer","Migration from a legacy platform"]'::jsonb,
  '[{"q":"Shopify or custom?","a":"Shopify when standard commerce fits and speed to market matters. Custom when catalogue rules, pricing logic or fulfilment genuinely cannot be expressed in the platform."}]'::jsonb,
  7, false, true, now(),
  'E-commerce Development in Nepal | Fast, Maintainable Commerce',
  'Inovexa Labs builds modern e-commerce storefronts and commerce systems — server-rendered for SEO, instrumented for conversion, and maintainable as your catalogue grows.'
),
(
  'product-design',
  'UI/UX & Product Design',
  'Interfaces designed around real users and business goals.',
  'Product design grounded in how the software actually gets used — flows, interface systems and design engineering that survives implementation.',
  $md$Design that only exists in a mockup is decoration. We design in the medium: real components, real data density, real edge cases, reviewed on the devices your users actually hold.

Work starts with the task, not the screen. What is the user trying to finish, what do they know already, and what happens when the happy path fails? From there we build an interface system — type scale, spacing, states, motion rules — that engineers can implement without interpretation.

We hand over design tokens and components that map to code, so the built product stays faithful to the design after the third sprint.$md$,
  'pen-tool', 'Design',
  '["Product and interaction design","Design systems and tokens","Design engineering in code","Prototyping and usability testing","Accessibility review","Information architecture","Data-dense dashboard and table design","Brand and visual identity for products"]'::jsonb,
  '["Design in the browser with real data","Every state designed: empty, loading, error","Accessibility reviewed alongside visuals","Tokens shared between design and code"]'::jsonb,
  '["Design sprint","Design partner retainer","Design system build"]'::jsonb,
  '[{"q":"Do you do design without development?","a":"Yes, though we always design with the implementation in mind, and we review the build to make sure the intent survives."}]'::jsonb,
  8, false, true, now(),
  'UI/UX & Product Design | Interfaces Built Around Real Users',
  'Inovexa Labs designs product interfaces grounded in real usage — design systems, states, accessibility and design engineering that survives implementation.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- technologies — every entry should be something Inovexa actually uses.
-- ---------------------------------------------------------------------------
insert into public.technologies (slug, name, category, description, proficiency, display_order) values
  ('nextjs',      'Next.js',       'Frontend',  'Server-rendered applications with the App Router, Server Components and streaming.', 'core', 1),
  ('react',       'React',         'Frontend',  'Component architecture for interactive product surfaces.', 'core', 2),
  ('typescript',  'TypeScript',    'Frontend',  'Strict typing from database schema to interface — our default language.', 'core', 3),
  ('tailwindcss', 'Tailwind CSS',  'Frontend',  'Design tokens expressed directly in the markup so systems stay consistent.', 'core', 4),
  ('react-native','React Native',  'Mobile',    'Shared mobile codebase with native modules where a product needs them.', 'working', 1),
  ('expo',        'Expo',          'Mobile',    'Build, over-the-air update and release pipeline for cross-platform apps.', 'working', 2),
  ('nodejs',      'Node.js',       'Backend',   'APIs, background jobs and integration services in TypeScript.', 'core', 1),
  ('python',      'Python',        'Backend',   'Data processing, AI pipelines and service automation.', 'working', 2),
  ('go',          'Go',            'Backend',   'Small, fast services where throughput and memory footprint matter.', 'exploring', 3),
  ('postgresql',  'PostgreSQL',    'Database',  'Relational modelling, row-level security, full-text search and query tuning.', 'core', 1),
  ('supabase',    'Supabase',      'Database',  'Postgres, auth, storage and realtime with security enforced in the database.', 'core', 2),
  ('redis',       'Redis',         'Database',  'Caching, rate limiting and ephemeral queues.', 'working', 3),
  ('pgvector',    'pgvector',      'Database',  'Vector similarity search living beside relational data.', 'working', 4),
  ('vercel',      'Vercel',        'Cloud',     'Edge delivery, preview deployments and incremental static regeneration.', 'core', 1),
  ('aws',         'AWS',           'Cloud',     'Object storage, queues, scheduled compute and managed networking.', 'working', 2),
  ('cloudflare',  'Cloudflare',    'Cloud',     'DNS, caching, WAF and edge workers.', 'working', 3),
  ('openai',      'OpenAI API',    'AI',        'Reasoning, extraction and generation behind a validated structured contract.', 'core', 1),
  ('anthropic',   'Anthropic API', 'AI',        'Long-context analysis and tool use for agentic workflows.', 'core', 2),
  ('langchain',   'LangChain',     'AI',        'Retrieval pipelines and tool orchestration for applied AI systems.', 'working', 3),
  ('pgvector-ai', 'RAG Pipelines', 'AI',        'Retrieval-augmented generation grounded in your own documents and data.', 'working', 4),
  ('docker',      'Docker',        'DevOps',    'Reproducible local and deployment environments.', 'working', 1),
  ('github-actions','GitHub Actions','DevOps',  'CI pipelines: typecheck, test, migration and deploy on merge.', 'core', 2),
  ('terraform',   'Terraform',     'DevOps',    'Infrastructure defined as code rather than console clicks.', 'exploring', 3),
  ('sentry',      'Sentry',        'DevOps',    'Error tracking and release health across web and mobile.', 'working', 4)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- PRODUCT LAB — Restra is a real product being built inside Inovexa Labs.
-- ---------------------------------------------------------------------------
insert into public.products
  (slug, name, tagline, short_description, full_description, status, category,
   technologies, last_updated_note, featured, published, published_at,
   seo_title, seo_description, seo_keywords)
values (
  'restra',
  'Restra',
  'Restaurant Management System',
  'A restaurant management system being built inside the Inovexa Product Lab — orders, tables, kitchen flow and daily reconciliation in one place.',
  $md$Restra is our answer to a problem we kept meeting: small and mid-sized restaurants running on a mix of paper tickets, a billing machine, and a spreadsheet that only one person understands.

It is being built for the floor, not for a boardroom. That means the interface has to work one-handed, in a hurry, on a tablet with a cracked screen and unreliable wifi.

**What it covers**

Order capture from the floor and counter, table and seating state, kitchen ticket flow, menu and modifier management, daily sales reconciliation, and the reports an owner actually reads at closing time.

**Where it is now**

Restra is in active development in the Product Lab. We are building it with the same stack we use for client work — Next.js, TypeScript, PostgreSQL with Supabase, and a server-rendered data layer that keeps the interface responsive on modest hardware.

We publish real progress here rather than a launch countdown. When there is something to try, this page will say so.$md$,
  'in_development', 'Business Software',
  '{"Next.js","TypeScript","PostgreSQL","Supabase","Tailwind CSS"}'::text[],
  'Active development in the Product Lab.',
  true, true, now(),
  'Restra — Restaurant Management System by Inovexa Labs',
  'Restra is a restaurant management system in development at Inovexa Labs: order capture, kitchen flow, menu management and daily reconciliation in one system.',
  array['restaurant management system','restaurant software Nepal','POS and kitchen workflow','Inovexa Labs product']
)
on conflict (slug) do nothing;

insert into public.product_features (product_id, title, description, icon, display_order)
select p.id, f.title, f.description, f.icon, f.display_order
from public.products p
cross join (values
  ('Order capture',      'Floor and counter ordering designed for one-handed use during a rush.', 'clipboard-list', 1),
  ('Table & seating',    'Live state of every table so the floor does not run on memory.', 'layout-grid', 2),
  ('Kitchen flow',       'Tickets routed and tracked from order to pass, with timing visible.', 'flame', 3),
  ('Menu management',    'Menus, modifiers and availability changed without calling a developer.', 'book-open', 4),
  ('Daily reconciliation','Cash, card and discount totals reconciled against recorded orders.', 'calculator', 5),
  ('Owner reporting',    'The handful of numbers that matter at closing time, not forty charts.', 'bar-chart-3', 6)
) as f(title, description, icon, display_order)
where p.slug = 'restra';

-- ---------------------------------------------------------------------------
-- EXPERIMENTS — "Inside the Lab"
-- ---------------------------------------------------------------------------
insert into public.experiments
  (slug, code, title, summary, status, hypothesis, progress, technologies,
   started_on, featured, published, published_at, seo_title, seo_description)
values
(
  'ai-workflow-automation',
  'EXPERIMENT #014',
  'AI workflow automation',
  'Can a small model plus strict validation reliably replace the manual triage step in a multi-step business workflow?',
  'experiment',
  'A constrained extraction task with a schema-validated output and a human fallback will outperform a manual triage step on both speed and error rate.',
  45,
  array['TypeScript','OpenAI API','Zod','PostgreSQL'],
  current_date - 40, true, true, now(),
  'Experiment #014 — AI Workflow Automation | Inovexa Labs',
  'An Inovexa Labs experiment testing whether schema-validated AI extraction can reliably replace manual triage inside a multi-step business workflow.'
),
(
  'intelligent-business-analytics',
  'EXPERIMENT #015',
  'Intelligent business analytics',
  'Instead of another dashboard nobody opens, can we answer the question in plain language and show the query it ran?',
  'experiment',
  'Business users trust an analytics answer more when the generated query is visible and editable than when they are handed a chart with no provenance.',
  30,
  array['PostgreSQL','pgvector','Next.js','Python'],
  current_date - 22, true, true, now(),
  'Experiment #015 — Intelligent Business Analytics | Inovexa Labs',
  'An Inovexa Labs experiment in plain-language business analytics that always shows its work: the query it ran and the rows behind every answer.'
),
(
  'next-generation-customer-interaction',
  'EXPERIMENT #016',
  'Next-generation customer interaction',
  'What does customer support look like when the assistant has real access to order state and knows when to hand over?',
  'idea',
  'Confidence-gated handover to a human, with the assistant summarising context first, produces better outcomes than either a pure chatbot or a pure queue.',
  12,
  array['Next.js','Anthropic API','Supabase','WebSockets'],
  current_date - 8, true, true, now(),
  'Experiment #016 — Next-Generation Customer Interaction | Inovexa Labs',
  'An Inovexa Labs experiment on customer support where an assistant holds real order context and hands over to a human with a full summary.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- BLOG — a small number of genuinely useful articles, not volume.
-- ---------------------------------------------------------------------------
insert into public.authors (slug, name, role, bio, social_links) values
  ('inovexa-labs', 'Inovexa Labs', 'Engineering team',
   'Notes from the people who build the software — written after shipping it, not before.',
   '{}'::jsonb)
on conflict (slug) do nothing;

insert into public.blog_categories (slug, name, description, display_order) values
  ('software-development', 'Software Development', 'Architecture, engineering practice and how we build.', 1),
  ('ai',                   'AI',                  'Applied AI, automation and where models genuinely help.', 2),
  ('saas',                 'SaaS',                'Building and operating software products.', 3),
  ('business-software',    'Business Software',   'Replacing spreadsheets with systems.', 4),
  ('nepal-tech',           'Nepal Technology',    'The market, the constraints and the practical realities.', 5),
  ('product-development',  'Product Development', 'From idea to something people use.', 6)
on conflict (slug) do nothing;

insert into public.blog_tags (slug, name) values
  ('cost', 'Cost'), ('mvp', 'MVP'), ('procurement', 'Procurement'),
  ('postgres', 'PostgreSQL'), ('architecture', 'Architecture'), ('nextjs', 'Next.js')
on conflict (slug) do nothing;

insert into public.blog_posts
  (slug, title, excerpt, content, author_id, category_id, featured, published, published_at,
   intent, is_pillar, seo_title, seo_description, seo_keywords)
select
  'custom-software-development-cost-nepal',
  'How much does custom software development cost in Nepal?',
  'A practical breakdown of what drives custom software cost in Nepal — team shape, scope, integrations and the decisions that move a budget more than hourly rates.',
  $md$Most answers to this question are useless because they quote a range without explaining what moves the number. Here is what actually drives cost on the projects we build.

## Cost is scope, not hourly rate

Two projects with identical headcount can differ by a factor of five. The difference is almost never the rate. It is:

- **How much of the process you have already decided.** A team that knows its workflow saves weeks of discovery.
- **How many external systems must talk to each other.** Every integration has an authentication model, an error model, and a person on the other side who may not answer email.
- **How much data has to be migrated.** Moving five years of inconsistent spreadsheet history into a schema is real work, and it is where timelines quietly die.
- **How ambiguous "done" is.** "A dashboard" and "a dashboard that reconciles against Tally to the rupee" are different products.

## Realistic shapes of engagement

Rather than a fake price list, here is how projects are usually structured here.

**Discovery (2–4 weeks).** We map the process, model the data, and produce a scoped specification with estimates. Some clients build with us afterwards; some take the specification elsewhere. Both are fine outcomes.

**First release (6–12 weeks).** The smallest version that removes the most friction, in production, used by real people. This phase is intentionally narrow.

**Iteration (ongoing).** Monthly cycles driven by what users actually did, not by what was planned in a document six months ago.

## What we refuse to do to lower a number

- **Estimate from a wish list.** Without seeing the workflow, any number is a guess dressed up as a quote.
- **Skip the data model to look fast.** It is the cheapest thing to get right and the most expensive to fix.
- **Cut testing to hit a date.** You pay for it at the worst possible moment — in front of your customers.
- **Build what a library already does well.** Sometimes the honest answer is "use this existing tool and spend your budget on the part that is actually yours."

## The question worth asking instead

Not "what does custom software cost?" but "which part of our operation is expensive, repeated, and poorly served by the tools we already pay for?"

Answer that precisely and the budget tends to become obvious — because now you are pricing a specific outcome rather than a general ambition.

If you want help answering it, that is what a discovery phase is for.$md$,
  a.id, c.id, true, true, now() - interval '12 days',
  'Commercial research: budget expectations for custom software in Nepal',
  true,
  'How Much Does Custom Software Development Cost in Nepal?',
  'What actually drives custom software development cost in Nepal — scope, integrations, data migration and ambiguity — and how projects are realistically structured.',
  array['custom software development cost Nepal','software development cost','custom software Nepal']
from public.authors a, public.blog_categories c
where a.slug = 'inovexa-labs' and c.slug = 'nepal-tech'
on conflict (slug) do nothing;

insert into public.blog_posts
  (slug, title, excerpt, content, author_id, category_id, published, published_at,
   intent, seo_title, seo_description, seo_keywords)
select
  'custom-software-vs-off-the-shelf',
  'Custom software vs off-the-shelf: how to decide',
  'A decision framework for the question that quietly wastes the most budget — when to configure what exists, and when your process is worth building software for.',
  $md$Buying software is cheap. Fitting your business into it is not. This is a framework for telling the two situations apart.

## Start with the cost of the workaround

Almost every company already runs on software. The question is not "do we need software?" but "what does the current gap cost us per month?"

Count it honestly: hours spent re-keying data, the reconciliation that takes a day, the orders that get lost between two systems, the report that someone assembles by hand every Monday. That number is your budget ceiling, and if it is small, the answer is usually configuration, not construction.

## Build when the process is your advantage

Custom software earns its cost in a few specific situations:

1. **The workflow is genuinely unusual** and the difference is commercially important. If how you operate is why customers choose you, encoding it in someone else's tool is a strategic mistake.
2. **The integration load is heavy.** When the real problem is making five systems agree, a purpose-built layer between them is often worth more than a replacement for any one of them.
3. **The data is the product.** If reporting and insight are what you sell, you need to own the schema.
4. **Off-the-shelf pricing scales against you.** Per-seat or per-transaction pricing that grows faster than your margin is a signal.

## Configure when the process is standard

Buy, or use what you have, when the workflow matches an established pattern: accounting, payroll, email, most CRMs, most e-commerce. There is no advantage in rebuilding commodity software, and the maintenance burden is permanent.

## The hybrid that usually wins

In practice, the strongest answer is rarely either extreme:

- Keep the commodity systems you already pay for.
- Build the **specific capability** they handle badly — the operational core, the pricing engine, the scheduling logic.
- Build a thin, well-documented integration layer so the two agree.

This keeps the custom surface small, which keeps both the cost and the risk down.

## A five-question test

Before committing budget, answer these:

1. What does the gap cost per month, in money or in hours?
2. Is this workflow the same as our competitors', or genuinely ours?
3. Which existing systems must this talk to, and who owns their APIs?
4. If we build it, who maintains it in year three?
5. What is the smallest version that tests the hypothesis?

If question four has no answer, fix that first. The most expensive software is the software nobody owns.$md$,
  a.id, c.id, true, now() - interval '5 days',
  'Decision-stage research: build vs buy for business software',
  'Custom Software vs Off-the-Shelf Software: How to Decide',
  'A practical framework for choosing between custom software and off-the-shelf tools — the cost of workarounds, when your process is your advantage, and the hybrid that usually wins.',
  array['custom software vs off the shelf','build vs buy software','business software decision']
from public.authors a, public.blog_categories c
where a.slug = 'inovexa-labs' and c.slug = 'business-software'
on conflict (slug) do nothing;

insert into public.blog_posts
  (slug, title, excerpt, content, author_id, category_id, published, published_at,
   intent, seo_title, seo_description, seo_keywords)
select
  'how-to-build-a-saas-product',
  'How to build a SaaS product: an honest sequence',
  'Not a growth playbook. The engineering and product sequence that gets you from an idea to a first paying customer without burning a year on the wrong build.',
  $md$Most SaaS advice starts at marketing. This one starts earlier, because most SaaS products die from a build-order mistake rather than a channel mistake.

## 1. Sell the problem before you build the product

Find five people who have the problem you are solving and describe the solution in one paragraph. If you cannot get five people to describe their current workaround in detail, you do not have a problem worth building for yet.

The output of this stage is not a landing page. It is a written description of the job to be done, in your customers' words.

## 2. Model the data before you design the screens

Multi-tenancy, billing and permissions are structural. Retrofitting them is where rewrites come from.

Decide early:

- **Tenant isolation.** Enforce it in the database with row-level security, not in application code you might forget to call. A single missed filter is a data breach, not a bug.
- **Billing as a projection.** Your subscription state should be rebuildable from the payment provider's webhooks. Never treat your own table as the source of truth.
- **Entitlements, not price checks.** Model what a plan grants, then gate features on the entitlement.

## 3. Build the smallest complete loop

One user, one workspace, one core workflow, from sign-up to a result worth paying for. Complete, not broad. A product that does one thing end to end teaches you more in three weeks than six months of half-features.

Resist the second feature until the first one is used by someone who is not you.

## 4. Instrument before you scale

You cannot improve a funnel you cannot see. From the first release: structured errors, a real analytics event on each meaningful step, and a way to contact a user who got stuck.

## 5. Charge earlier than feels comfortable

A free user is a hypothesis. A paying user is data. Charging early forces you to articulate the value and tells you quickly whether the problem is expensive enough to solve.

It also changes your build priorities: compliance, reliability and support stop being theoretical.

## 6. Then, and only then, growth

Once retention is real, channels matter. Before that, growth just fills a leaking bucket faster.

## The sequence in one line

Problem → data model → smallest complete loop → instrument → charge → scale.

Almost every painful SaaS rewrite we have seen came from inverting two of those steps.$md$,
  a.id, c.id, false, now() - interval '2 days',
  'Informational: how to build a SaaS product',
  'How to Build a SaaS Product: An Honest Sequence from Idea to Paying Customer',
  'The engineering and product sequence for building a SaaS product: validate the problem, model the data, ship one complete loop, instrument, then charge — before growth.',
  array['how to build a saas product','saas development','multi-tenant architecture']
from public.authors a, public.blog_categories c
where a.slug = 'inovexa-labs' and c.slug = 'saas'
on conflict (slug) do nothing;

-- Internal linking: connect the build-vs-buy piece to the cost piece.
insert into public.blog_post_relations (post_id, related_post_id, display_order)
select a.id, b.id, 1
from public.blog_posts a, public.blog_posts b
where a.slug = 'custom-software-vs-off-the-shelf'
  and b.slug = 'custom-software-development-cost-nepal'
on conflict do nothing;

-- Tag the seeded articles.
insert into public.blog_post_tags (post_id, tag_id)
select p.id, t.id
from public.blog_posts p, public.blog_tags t
where (p.slug = 'custom-software-development-cost-nepal' and t.slug in ('cost','procurement'))
   or (p.slug = 'custom-software-vs-off-the-shelf' and t.slug in ('procurement','cost'))
   or (p.slug = 'how-to-build-a-saas-product' and t.slug in ('mvp','architecture'))
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- seo_metadata — route-level defaults for pages without a content entity.
-- ---------------------------------------------------------------------------
insert into public.seo_metadata (path, title, description, keywords, structured_data) values
  ('/', 'Inovexa Labs — Software Development & Product Innovation',
   'Inovexa Labs is an on-demand software development company and product innovation lab. We build custom software for businesses and develop our own technology products.',
   array['software development company Nepal','custom software development','product innovation lab'],
   null),
  ('/about', 'About Inovexa Labs — We''re Building More Than Software',
   'Why Inovexa Labs exists, how we engineer, what we value, and where the product lab is heading.',
   array['software company Nepal','about Inovexa Labs'], null),
  ('/contact', 'Start a Project | Inovexa Labs',
   'Tell us about the problem you are solving. We reply with a straight assessment and a clear next step.',
   array['hire software developers Nepal','start a software project'], null),
  ('/work', 'Built With Our Clients | Inovexa Labs',
   'Selected software projects delivered with our clients, including the problem, the approach and what shipped.',
   array['software projects Nepal','case studies'], null),
  ('/products', 'Products We''ve Built | Inovexa Labs Product Lab',
   'Software products researched, designed and built inside the Inovexa Labs Product Lab.',
   array['software products','SaaS products Nepal'], null),
  ('/lab', 'Inside the Lab | Inovexa Labs Experiments',
   'Active experiments and research directions from the Inovexa Labs Product Lab.',
   array['product experiments','AI experiments'], null),
  ('/insights', 'Insights on Software, AI and Product Engineering | Inovexa Labs',
   'Practical writing on software development, applied AI, SaaS engineering and building technology in Nepal.',
   array['software engineering blog','AI development insights'], null)
on conflict (path) do nothing;
