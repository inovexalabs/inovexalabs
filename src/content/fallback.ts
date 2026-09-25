/**
 * EDITORIAL BASELINE
 *
 * Used only when Supabase is not configured (`isSupabaseConfigured === false`),
 * so the site is fully renderable and reviewable before the database exists —
 * and so preview deployments never show an empty shell.
 *
 * The moment NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * every one of these values is superseded by the database. Nothing here is
 * duplicated into a component: components never read this module directly, only
 * the query layer does.
 *
 * It mirrors `supabase/migrations/0003_seed.sql` exactly, and contains no
 * invented social proof — no customers, testimonials, projects or metrics.
 */

import type {
  Author,
  BlogCategory,
  BlogPostDetail,
  BlogTag,
  Experiment,
  NavigationItem,
  Product,
  ProductFeature,
  Service,
  SiteSetting,
  Technology,
} from "@/types/content";

const ts = "2026-01-01T00:00:00.000Z";

export const fallbackSettings: SiteSetting[] = [
  {
    id: "setting-company",
    key: "company",
    group_name: "general",
    label: "Company details",
    description: null,
    value: {
      name: "Inovexa Labs",
      legalName: "Inovexa Labs",
      positioning: "On-demand software development company and product innovation lab.",
      promise: "We build software for today. We invent products for tomorrow.",
      supportingLine:
        "From custom software solutions to products born inside our lab, Inovexa Labs turns ideas into technology that works.",
      shortDescription:
        "Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.",
      founded: "",
      email: "hello@inovexalabs.com",
      phone: "",
      addressLine: "",
      city: "Kathmandu",
      region: "Bagmati",
      country: "Nepal",
      countryCode: "NP",
      postalCode: "",
      latitude: "",
      longitude: "",
      businessHours: "",
    },
    created_at: ts,
    updated_at: ts,
  },
  {
    id: "setting-socials",
    key: "socials",
    group_name: "general",
    label: "Social profiles",
    description: null,
    value: { x: "", linkedin: "", github: "", instagram: "" },
    created_at: ts,
    updated_at: ts,
  },
  {
    id: "setting-hero",
    key: "hero",
    group_name: "homepage",
    label: "Hero section",
    description: null,
    value: {
      eyebrow: "INOVEXA LABS · SOFTWARE × INNOVATION",
      headlineLine1: "We build software for today.",
      headlineLine2: "We invent products for tomorrow.",
      supporting:
        "Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.",
      primaryCtaLabel: "Start a Project",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Explore Our Products",
      secondaryCtaHref: "/products",
    },
    created_at: ts,
    updated_at: ts,
  },
  {
    id: "setting-seo",
    key: "seo_defaults",
    group_name: "seo",
    label: "Default SEO",
    description: null,
    value: {
      titleTemplate: "%s | Inovexa Labs",
      defaultTitle: "Inovexa Labs — Software Development & Product Innovation",
      defaultDescription:
        "Inovexa Labs is an on-demand software development company and product innovation lab. We build custom software for businesses and develop our own technology products.",
      ogImageUrl: "",
      twitterHandle: "",
      robots: "index,follow",
    },
    created_at: ts,
    updated_at: ts,
  },
];

export const fallbackNav: NavigationItem[] = [
  { title: "Products", href: "/products" },
  { title: "Services", href: "/services" },
  { title: "Work", href: "/work" },
  { title: "Lab", href: "/lab" },
  { title: "Insights", href: "/insights" },
  { title: "About", href: "/about" },
].map((item, i) => ({
  id: `nav-header-${i}`,
  location: "header" as const,
  parent_id: null,
  description: null,
  display_order: i + 1,
  published: true,
  ...item,
}));

export const fallbackFooterNav: NavigationItem[] = [
  { title: "Services", href: "/services" },
  { title: "Products", href: "/products" },
  { title: "Work", href: "/work" },
  { title: "Lab", href: "/lab" },
  { title: "Insights", href: "/insights" },
  { title: "About", href: "/about" },
  { title: "Start a Project", href: "/contact" },
].map((item, i) => ({
  id: `nav-footer-${i}`,
  location: "footer" as const,
  parent_id: null,
  description: null,
  display_order: i + 1,
  published: true,
  ...item,
}));

export const fallbackLegalNav: NavigationItem[] = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
  { title: "Cookie Policy", href: "/cookies" },
].map((item, i) => ({
  id: `nav-legal-${i}`,
  location: "legal" as const,
  parent_id: null,
  description: null,
  display_order: i + 1,
  published: true,
  ...item,
}));

export const fallbackServices: Service[] = [
  {
    id: "svc-web-development",
    slug: "web-development",
    title: "Web Development",
    tagline: "High-performance websites and web applications.",
    summary:
      "Fast, accessible, server-rendered web applications built on Next.js and TypeScript — engineered for real traffic, not just for a design review.",
    body: `We build web products the way we would want them built for us: server-rendered first, typed end to end, and fast on a mid-range Android phone over a 3G connection.

That means real attention to Core Web Vitals, semantic HTML, and the boring details — caching headers, image pipelines, error boundaries, and a 404 page that helps rather than dead-ends.

Whether it is a marketing site that has to rank, a customer portal behind authentication, or an internal tool that replaces six spreadsheets, the engineering approach is the same: model the data properly, render on the server, and ship the smallest amount of JavaScript that does the job.`,
    icon: "globe",
    category: "Engineering",
    deliverables: [
      "Server-rendered Next.js applications",
      "Design system implementation",
      "Technical SEO and structured data",
      "Performance and Core Web Vitals work",
      "CMS and headless integrations",
      "Authentication and role-based access",
      "Analytics and error monitoring",
      "Accessibility to WCAG 2.2 AA",
    ],
    process_notes: [
      "Architecture and data model first",
      "Server Components by default, client only where interaction demands it",
      "Deploy preview on every pull request",
      "Lighthouse and axe checks before launch",
    ],
    engagement_models: ["Fixed-scope project", "Monthly retainer", "Embedded with your team"],
    faqs: [
      {
        q: "How long does a web application take?",
        a: "A focused first release is typically six to twelve weeks. We scope the smallest version that delivers real value and iterate from production feedback.",
      },
      {
        q: "Do you work with an existing codebase?",
        a: "Yes. We start with a short audit covering architecture, test coverage, dependency risk and deployment, then agree on a remediation plan before writing features.",
      },
    ],
    display_order: 1,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Web Development Company in Nepal | Next.js & TypeScript",
    seo_description:
      "Inovexa Labs builds high-performance, server-rendered web applications and websites in Nepal with Next.js and TypeScript — engineered for speed, accessibility and search.",
    seo_keywords: ["web development Nepal", "Next.js development", "web application development"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-saas-development",
    slug: "saas-development",
    title: "SaaS Development",
    tagline: "Scalable software products from concept to production.",
    summary:
      "Multi-tenant architecture, billing, onboarding, and the operational scaffolding that turns a feature set into a product people pay for.",
    body: `Most SaaS projects fail on the unglamorous parts: tenant isolation, billing edge cases, invitation flows, and knowing what happened when something broke at 3am.

We build the whole system. Multi-tenancy with row-level security rather than application-level filtering. Subscription state reconciled against the payment provider rather than trusted blindly. Audit trails, feature gating, and structured logging from the first commit.

Because we also run products of our own, we have lived with the consequences of these decisions. That shows up in what we refuse to ship.`,
    icon: "layers",
    category: "Product",
    deliverables: [
      "Multi-tenant data architecture",
      "Subscription billing and entitlement",
      "Self-serve onboarding flows",
      "Admin and back-office tooling",
      "Usage metering and analytics",
      "Transactional email and notifications",
      "Role and permission models",
      "Migration and scaling strategy",
    ],
    process_notes: [
      "Tenant isolation enforced at the database, not the ORM",
      "Billing state treated as a projection you can rebuild",
      "Every background job idempotent and observable",
    ],
    engagement_models: [
      "MVP build (fixed scope)",
      "Fractional product engineering",
      "Technical co-founder partnership",
    ],
    faqs: [
      {
        q: "Can you take over an existing SaaS?",
        a: "Usually. We audit the data model, billing correctness and deployment story first, because those are the three areas where inherited problems compound fastest.",
      },
      {
        q: "Who owns the code?",
        a: "You do. We work in your repositories from the first commit and hand over documentation as part of the engagement.",
      },
    ],
    display_order: 2,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "SaaS Development Company in Nepal | Multi-tenant Product Engineering",
    seo_description:
      "Inovexa Labs builds scalable SaaS products: multi-tenant architecture, billing, onboarding and the operational tooling that turns features into a product customers pay for.",
    seo_keywords: ["SaaS development Nepal", "multi-tenant architecture", "SaaS product engineering"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-mobile-development",
    slug: "mobile-development",
    title: "Mobile Development",
    tagline: "Modern mobile applications.",
    summary:
      "Cross-platform and native mobile apps designed for real devices, real networks, and users who will not tolerate a spinner.",
    body: `Mobile is where the constraints bite hardest: intermittent connectivity, limited memory, fragmented devices, and app-store review cycles you cannot hot-patch your way out of.

We build with React Native and Expo where a shared codebase is the right trade, and go closer to the platform when the product genuinely needs it. Offline-first data sync, background tasks, push notifications and deep linking are treated as first-class requirements, not stretch goals.

Every release goes through internal device testing before it reaches a reviewer.`,
    icon: "smartphone",
    category: "Engineering",
    deliverables: [
      "React Native and Expo applications",
      "Native iOS and Android modules",
      "Offline-first sync and local storage",
      "Push notifications and deep linking",
      "App Store and Play Store release management",
      "Crash reporting and release health",
      "Mobile performance profiling",
    ],
    process_notes: [
      "Test on low-end devices, not just flagships",
      "Design for offline and error states first",
      "Staged rollouts with crash-rate gates",
    ],
    engagement_models: ["Fixed-scope project", "Retainer with release cadence", "Prototype to validate an idea"],
    faqs: [
      {
        q: "Cross-platform or native?",
        a: "Cross-platform unless the product depends on heavy hardware integration, advanced graphics or platform-specific UI conventions. We will tell you which side of that line you are on.",
      },
    ],
    display_order: 3,
    featured: false,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Mobile App Development Company in Nepal | iOS & Android",
    seo_description:
      "Inovexa Labs develops modern mobile applications with React Native and Expo — offline-first, instrumented, and tested on real devices in real network conditions.",
    seo_keywords: ["mobile app development Nepal", "React Native development", "iOS Android development"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-ai-development",
    slug: "ai-development",
    title: "AI & Automation",
    tagline: "AI-powered workflows, assistants, and intelligent systems.",
    summary:
      "Applied AI that solves a defined business problem — retrieval, extraction, classification and agents wired into your actual systems, with evaluation harnesses so quality is measurable.",
    body: `There is a large gap between an AI demo and an AI system you can depend on. Closing it is mostly engineering: retrieval that returns the right context, prompts under version control, structured outputs validated against a schema, and an evaluation set that tells you when a change made things worse.

We build AI into existing workflows rather than bolting a chatbot onto the side. Document processing that writes to your database. Support triage that routes to the right queue with a confidence threshold and a human fallback. Internal assistants that answer from your own documentation and cite the source.

Where a deterministic rule does the job better than a model, we will say so.`,
    icon: "sparkles",
    category: "Intelligence",
    deliverables: [
      "Retrieval-augmented generation over your data",
      "Document extraction and classification",
      "Workflow automation and agent pipelines",
      "LLM evaluation harnesses and regression tests",
      "Structured output validation",
      "Vector search and embeddings",
      "Human-in-the-loop review interfaces",
      "Cost and latency optimisation",
    ],
    process_notes: [
      "Start from a measurable task, not a model",
      "Golden dataset before behaviour change",
      "Humans stay in the loop for consequential actions",
      "Never put a model in the path of a deterministic decision",
    ],
    engagement_models: ["Discovery sprint", "Fixed-scope build", "Retainer for ongoing model operations"],
    faqs: [
      {
        q: "Will our data be used to train models?",
        a: "No. We use API providers with training opt-out alongside your data-protection requirements, and we will document exactly where data flows in the architecture.",
      },
      {
        q: "What if AI is the wrong answer?",
        a: "Then we say so and propose the simpler system. A rule engine or a better form is cheaper to run and easier to trust.",
      },
    ],
    display_order: 4,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "AI Development & Automation Company in Nepal | Applied AI Systems",
    seo_description:
      "Inovexa Labs builds applied AI systems: retrieval, extraction, classification and agent workflows with evaluation harnesses — engineered to be measurable and dependable.",
    seo_keywords: ["AI development Nepal", "AI automation", "business automation software Nepal"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-business-software",
    slug: "business-software",
    title: "Business Software",
    tagline: "Custom systems designed around business processes.",
    summary:
      "Software shaped around how your business actually operates — inventory, operations, field teams, reporting — replacing spreadsheet sprawl with one system of record.",
    body: `Off-the-shelf software forces your process into someone else's assumptions. Custom software is worth building when your process is the advantage, when the spreadsheets have become load-bearing, or when nobody can answer a straightforward question without three days of manual reconciliation.

These projects start with mapping the work as it really happens — including the exceptions and the person who is the unofficial integration layer. Then we build the smallest system that removes the most friction, and put it in front of users while it is still cheap to change.

Reporting is part of the build, not an afterthought. If the system cannot answer the questions the business asks weekly, it has not finished its job.`,
    icon: "workflow",
    category: "Engineering",
    deliverables: [
      "Operations and inventory systems",
      "Booking, scheduling and dispatch",
      "Field and mobile workforce tools",
      "Approval and document workflows",
      "Custom reporting and dashboards",
      "Legacy system and spreadsheet migration",
      "Role-based internal tooling",
      "Third-party and accounting integrations",
    ],
    process_notes: [
      "Map the process before modelling the data",
      "Ship one department at a time",
      "Migrate data with a rollback plan",
      "Measure adoption, not licence count",
    ],
    engagement_models: ["Discovery and scoping phase", "Phased delivery", "Support and maintenance retainer"],
    faqs: [
      {
        q: "Should we replace our ERP?",
        a: "Usually not at once. We prefer to build the specific capability the ERP handles badly, integrate with it, and only replace the whole thing when the case is genuinely strong.",
      },
    ],
    display_order: 5,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Custom Business Software Development in Nepal | Inovexa Labs",
    seo_description:
      "Inovexa Labs builds custom business software in Nepal — operations, inventory, dispatch and reporting systems designed around how your business actually works.",
    seo_keywords: [
      "custom business software Nepal",
      "business management system",
      "workflow automation Nepal",
    ],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-api-backend",
    slug: "api-backend",
    title: "API & Backend Engineering",
    tagline: "Secure, scalable backend infrastructure.",
    summary:
      "APIs and data platforms with clear contracts, sane migrations, real observability and the security model written down.",
    body: `Backends are where correctness lives. We design schemas that survive contact with reality, expose APIs with versioned contracts, and enforce authorisation at the data layer so a bug in one handler cannot leak another tenant's records.

Migrations are reversible, secrets never touch the client, and every endpoint has a defined failure mode. Background work is idempotent and observable, because silent job failures are the most expensive kind.

We are equally comfortable extending an existing service and greenfielding a platform, in TypeScript, Python or Go.`,
    icon: "server",
    category: "Engineering",
    deliverables: [
      "REST and RPC API design",
      "PostgreSQL schema and query optimisation",
      "Authentication, authorisation and RLS",
      "Event and job processing",
      "Third-party API integrations",
      "Rate limiting and abuse protection",
      "Observability, tracing and alerting",
      "Documentation and contract testing",
    ],
    process_notes: [
      "Authorisation enforced at the database",
      "Every migration reversible",
      "Idempotency keys on all mutating endpoints",
      "Load-test before you need to",
    ],
    engagement_models: ["Architecture review", "Fixed-scope build", "Ongoing platform ownership"],
    faqs: [
      {
        q: "Can you review our existing backend?",
        a: "Yes — a structured audit covering schema, query performance, authorisation correctness and operational readiness, with prioritised findings and effort estimates.",
      },
    ],
    display_order: 6,
    featured: false,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "API & Backend Engineering in Nepal | Secure Scalable Infrastructure",
    seo_description:
      "Inovexa Labs engineers secure, scalable APIs and backend infrastructure — PostgreSQL, serverless and containerised workloads, with authorisation enforced at the data layer.",
    seo_keywords: ["API development Nepal", "backend engineering", "PostgreSQL development"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-ecommerce",
    slug: "ecommerce",
    title: "E-commerce",
    tagline: "Modern commerce platforms and digital stores.",
    summary:
      "Storefronts and commerce systems that load fast, convert on mobile, and stay maintainable when merchandising, pricing and fulfilment get complicated.",
    body: `Commerce punishes sloppy engineering: every millisecond and every dropped edge case shows up in revenue. We build storefronts that render on the server, checkout flows that survive flaky mobile networks, and back-office tools that let a merchandising team work without filing a ticket.

We work with established platforms where they fit, and build custom commerce when catalogue logic, pricing rules or fulfilment workflows have outgrown the defaults.

Payments are handled through providers that keep card data out of your systems. We do not store what we do not need.`,
    icon: "shopping-bag",
    category: "Engineering",
    deliverables: [
      "Headless and custom storefronts",
      "Cart, checkout and payment integration",
      "Product catalogue and pricing rules",
      "Inventory and fulfilment workflows",
      "Order management and notifications",
      "Search and merchandising",
      "Analytics, events and conversion tracking",
      "Subscription and recurring billing",
    ],
    process_notes: [
      "Mobile-first checkout, tested on real devices",
      "Server-render catalogue and product pages for SEO",
      "Never store card data",
      "Instrument the funnel before optimising it",
    ],
    engagement_models: ["Fixed-scope build", "Commerce retainer", "Migration from a legacy platform"],
    faqs: [
      {
        q: "Shopify or custom?",
        a: "Shopify when standard commerce fits and speed to market matters. Custom when catalogue rules, pricing logic or fulfilment genuinely cannot be expressed in the platform.",
      },
    ],
    display_order: 7,
    featured: false,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "E-commerce Development in Nepal | Fast, Maintainable Commerce",
    seo_description:
      "Inovexa Labs builds modern e-commerce storefronts and commerce systems — server-rendered for SEO, instrumented for conversion, and maintainable as your catalogue grows.",
    seo_keywords: ["ecommerce development Nepal", "online store development", "headless commerce"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "svc-product-design",
    slug: "product-design",
    title: "UI/UX & Product Design",
    tagline: "Interfaces designed around real users and business goals.",
    summary:
      "Product design grounded in how the software actually gets used — flows, interface systems and design engineering that survives implementation.",
    body: `Design that only exists in a mockup is decoration. We design in the medium: real components, real data density, real edge cases, reviewed on the devices your users actually hold.

Work starts with the task, not the screen. What is the user trying to finish, what do they know already, and what happens when the happy path fails? From there we build an interface system — type scale, spacing, states, motion rules — that engineers can implement without interpretation.

We hand over design tokens and components that map to code, so the built product stays faithful to the design after the third sprint.`,
    icon: "pen-tool",
    category: "Design",
    deliverables: [
      "Product and interaction design",
      "Design systems and tokens",
      "Design engineering in code",
      "Prototyping and usability testing",
      "Accessibility review",
      "Information architecture",
      "Data-dense dashboard and table design",
      "Brand and visual identity for products",
    ],
    process_notes: [
      "Design in the browser with real data",
      "Every state designed: empty, loading, error",
      "Accessibility reviewed alongside visuals",
      "Tokens shared between design and code",
    ],
    engagement_models: ["Design sprint", "Design partner retainer", "Design system build"],
    faqs: [
      {
        q: "Do you do design without development?",
        a: "Yes, though we always design with the implementation in mind, and we review the build to make sure the intent survives.",
      },
    ],
    display_order: 8,
    featured: false,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "UI/UX & Product Design | Interfaces Built Around Real Users",
    seo_description:
      "Inovexa Labs designs product interfaces grounded in real usage — design systems, states, accessibility and design engineering that survives implementation.",
    seo_keywords: ["product design", "UI UX design Nepal", "design systems"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
];

export const fallbackProducts: Product[] = [
  {
    id: "product-restra",
    slug: "restra",
    name: "Restra",
    tagline: "Restaurant Management System",
    short_description:
      "A restaurant management system being built inside the Inovexa Product Lab — orders, tables, kitchen flow and daily reconciliation in one place.",
    full_description: `Restra is our answer to a problem we kept meeting: small and mid-sized restaurants running on a mix of paper tickets, a billing machine, and a spreadsheet that only one person understands.

It is being built for the floor, not for a boardroom. That means the interface has to work one-handed, in a hurry, on a tablet with a cracked screen and unreliable wifi.

**What it covers**

Order capture from the floor and counter, table and seating state, kitchen ticket flow, menu and modifier management, daily sales reconciliation, and the reports an owner actually reads at closing time.

**Where it is now**

Restra is in active development in the Product Lab. We are building it with the same stack we use for client work — Next.js, TypeScript, PostgreSQL with Supabase, and a server-rendered data layer that keeps the interface responsive on modest hardware.

We publish real progress here rather than a launch countdown. When there is something to try, this page will say so.`,
    logo_url: null,
    cover_image_url: null,
    gallery: [],
    video_url: null,
    product_url: null,
    status: "in_development",
    category: "Business Software",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS"],
    launch_date: null,
    last_updated_note: "Active development in the Product Lab.",
    is_open_source: false,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Restra — Restaurant Management System by Inovexa Labs",
    seo_description:
      "Restra is a restaurant management system in development at Inovexa Labs: order capture, kitchen flow, menu management and daily reconciliation in one system.",
    seo_keywords: [
      "restaurant management system",
      "restaurant software Nepal",
      "POS and kitchen workflow",
      "Inovexa Labs product",
    ],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
];

export const fallbackProductFeatures: ProductFeature[] = [
  { title: "Order capture", description: "Floor and counter ordering designed for one-handed use during a rush.", icon: "clipboard-list", display_order: 1 },
  { title: "Table & seating", description: "Live state of every table so the floor does not run on memory.", icon: "layout-grid", display_order: 2 },
  { title: "Kitchen flow", description: "Tickets routed and tracked from order to pass, with timing visible.", icon: "flame", display_order: 3 },
  { title: "Menu management", description: "Menus, modifiers and availability changed without calling a developer.", icon: "book-open", display_order: 4 },
  { title: "Daily reconciliation", description: "Cash, card and discount totals reconciled against recorded orders.", icon: "calculator", display_order: 5 },
  { title: "Owner reporting", description: "The handful of numbers that matter at closing time, not forty charts.", icon: "bar-chart-3", display_order: 6 },
].map((f, i) => ({ id: `feature-restra-${i}`, product_id: "product-restra", ...f }));

export const fallbackExperiments: Experiment[] = [
  {
    id: "exp-014",
    slug: "ai-workflow-automation",
    code: "EXPERIMENT #014",
    title: "AI workflow automation",
    summary:
      "Can a small model plus strict validation reliably replace the manual triage step in a multi-step business workflow?",
    body: null,
    status: "experiment",
    hypothesis:
      "A constrained extraction task with a schema-validated output and a human fallback will outperform a manual triage step on both speed and error rate.",
    finding: null,
    progress: 45,
    technologies: ["TypeScript", "OpenAI API", "Zod", "PostgreSQL"],
    image_url: null,
    started_on: "2026-08-01",
    concluded_on: null,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Experiment #014 — AI Workflow Automation | Inovexa Labs",
    seo_description:
      "An Inovexa Labs experiment testing whether schema-validated AI extraction can reliably replace manual triage inside a multi-step business workflow.",
    seo_keywords: ["AI workflow automation", "AI experiment", "applied AI"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "exp-015",
    slug: "intelligent-business-analytics",
    code: "EXPERIMENT #015",
    title: "Intelligent business analytics",
    summary:
      "Instead of another dashboard nobody opens, can we answer the question in plain language and show the query it ran?",
    body: null,
    status: "experiment",
    hypothesis:
      "Business users trust an analytics answer more when the generated query is visible and editable than when they are handed a chart with no provenance.",
    finding: null,
    progress: 30,
    technologies: ["PostgreSQL", "pgvector", "Next.js", "Python"],
    image_url: null,
    started_on: "2026-08-20",
    concluded_on: null,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Experiment #015 — Intelligent Business Analytics | Inovexa Labs",
    seo_description:
      "An Inovexa Labs experiment in plain-language business analytics that always shows its work: the query it ran and the rows behind every answer.",
    seo_keywords: ["business analytics", "natural language analytics", "AI experiment"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
  {
    id: "exp-016",
    slug: "next-generation-customer-interaction",
    code: "EXPERIMENT #016",
    title: "Next-generation customer interaction",
    summary:
      "What does customer support look like when the assistant has real access to order state and knows when to hand over?",
    body: null,
    status: "idea",
    hypothesis:
      "Confidence-gated handover to a human, with the assistant summarising context first, produces better outcomes than either a pure chatbot or a pure queue.",
    finding: null,
    progress: 12,
    technologies: ["Next.js", "Anthropic API", "Supabase", "WebSockets"],
    image_url: null,
    started_on: "2026-09-05",
    concluded_on: null,
    featured: true,
    published: true,
    published_at: ts,
    created_at: ts,
    updated_at: ts,
    seo_title: "Experiment #016 — Next-Generation Customer Interaction | Inovexa Labs",
    seo_description:
      "An Inovexa Labs experiment on customer support where an assistant holds real order context and hands over to a human with a full summary.",
    seo_keywords: ["customer support AI", "AI assistant experiment", "handover"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
  },
];

export const fallbackTechnologies: Technology[] = [
  { slug: "nextjs", name: "Next.js", category: "Frontend", description: "Server-rendered applications with the App Router, Server Components and streaming.", proficiency: "core", display_order: 1 },
  { slug: "react", name: "React", category: "Frontend", description: "Component architecture for interactive product surfaces.", proficiency: "core", display_order: 2 },
  { slug: "typescript", name: "TypeScript", category: "Frontend", description: "Strict typing from database schema to interface — our default language.", proficiency: "core", display_order: 3 },
  { slug: "tailwindcss", name: "Tailwind CSS", category: "Frontend", description: "Design tokens expressed directly in the markup so systems stay consistent.", proficiency: "core", display_order: 4 },
  { slug: "react-native", name: "React Native", category: "Mobile", description: "Shared mobile codebase with native modules where a product needs them.", proficiency: "working", display_order: 1 },
  { slug: "expo", name: "Expo", category: "Mobile", description: "Build, over-the-air update and release pipeline for cross-platform apps.", proficiency: "working", display_order: 2 },
  { slug: "nodejs", name: "Node.js", category: "Backend", description: "APIs, background jobs and integration services in TypeScript.", proficiency: "core", display_order: 1 },
  { slug: "python", name: "Python", category: "Backend", description: "Data processing, AI pipelines and service automation.", proficiency: "working", display_order: 2 },
  { slug: "go", name: "Go", category: "Backend", description: "Small, fast services where throughput and memory footprint matter.", proficiency: "exploring", display_order: 3 },
  { slug: "postgresql", name: "PostgreSQL", category: "Database", description: "Relational modelling, row-level security, full-text search and query tuning.", proficiency: "core", display_order: 1 },
  { slug: "supabase", name: "Supabase", category: "Database", description: "Postgres, auth, storage and realtime with security enforced in the database.", proficiency: "core", display_order: 2 },
  { slug: "redis", name: "Redis", category: "Database", description: "Caching, rate limiting and ephemeral queues.", proficiency: "working", display_order: 3 },
  { slug: "pgvector", name: "pgvector", category: "Database", description: "Vector similarity search living beside relational data.", proficiency: "working", display_order: 4 },
  { slug: "vercel", name: "Vercel", category: "Cloud", description: "Edge delivery, preview deployments and incremental static regeneration.", proficiency: "core", display_order: 1 },
  { slug: "aws", name: "AWS", category: "Cloud", description: "Object storage, queues, scheduled compute and managed networking.", proficiency: "working", display_order: 2 },
  { slug: "cloudflare", name: "Cloudflare", category: "Cloud", description: "DNS, caching, WAF and edge workers.", proficiency: "working", display_order: 3 },
  { slug: "openai", name: "OpenAI API", category: "AI", description: "Reasoning, extraction and generation behind a validated structured contract.", proficiency: "core", display_order: 1 },
  { slug: "anthropic", name: "Anthropic API", category: "AI", description: "Long-context analysis and tool use for agentic workflows.", proficiency: "core", display_order: 2 },
  { slug: "langchain", name: "LangChain", category: "AI", description: "Retrieval pipelines and tool orchestration for applied AI systems.", proficiency: "working", display_order: 3 },
  { slug: "rag", name: "RAG Pipelines", category: "AI", description: "Retrieval-augmented generation grounded in your own documents and data.", proficiency: "working", display_order: 4 },
  { slug: "docker", name: "Docker", category: "DevOps", description: "Reproducible local and deployment environments.", proficiency: "working", display_order: 1 },
  { slug: "github-actions", name: "GitHub Actions", category: "DevOps", description: "CI pipelines: typecheck, test, migration and deploy on merge.", proficiency: "core", display_order: 2 },
  { slug: "terraform", name: "Terraform", category: "DevOps", description: "Infrastructure defined as code rather than console clicks.", proficiency: "exploring", display_order: 3 },
  { slug: "sentry", name: "Sentry", category: "DevOps", description: "Error tracking and release health across web and mobile.", proficiency: "working", display_order: 4 },
].map((t, i) => ({
  ...t,
  id: `tech-${t.slug}-${i}`,
  icon: null,
  website_url: null,
  published: true,
})) as unknown as Technology[];

export const fallbackAuthors: Author[] = [
  {
    id: "author-inovexa",
    slug: "inovexa-labs",
    name: "Inovexa Labs",
    role: "Engineering team",
    bio: "Notes from the people who build the software — written after shipping it, not before.",
    avatar_url: null,
    email: null,
    social_links: {},
  },
];

export const fallbackCategories: BlogCategory[] = [
  { id: "cat-software-development", slug: "software-development", name: "Software Development", description: "Architecture, engineering practice and how we build.", display_order: 1 },
  { id: "cat-ai", slug: "ai", name: "AI", description: "Applied AI, automation and where models genuinely help.", display_order: 2 },
  { id: "cat-saas", slug: "saas", name: "SaaS", description: "Building and operating software products.", display_order: 3 },
  { id: "cat-business-software", slug: "business-software", name: "Business Software", description: "Replacing spreadsheets with systems.", display_order: 4 },
  { id: "cat-nepal-tech", slug: "nepal-tech", name: "Nepal Technology", description: "The market, the constraints and the practical realities.", display_order: 5 },
  { id: "cat-product-development", slug: "product-development", name: "Product Development", description: "From idea to something people use.", display_order: 6 },
];

export const fallbackTags: BlogTag[] = [
  { id: "tag-cost", slug: "cost", name: "Cost" },
  { id: "tag-mvp", slug: "mvp", name: "MVP" },
  { id: "tag-procurement", slug: "procurement", name: "Procurement" },
  { id: "tag-postgres", slug: "postgres", name: "PostgreSQL" },
  { id: "tag-architecture", slug: "architecture", name: "Architecture" },
  { id: "tag-nextjs", slug: "nextjs", name: "Next.js" },
];

const COST_ARTICLE = `Most answers to this question are useless because they quote a range without explaining what moves the number. Here is what actually drives cost on the projects we build.

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

If you want help answering it, that is what a discovery phase is for.`;

const BUILD_VS_BUY_ARTICLE = `Buying software is cheap. Fitting your business into it is not. This is a framework for telling the two situations apart.

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

If question four has no answer, fix that first. The most expensive software is the software nobody owns.`;

const SAAS_ARTICLE = `Most SaaS advice starts at marketing. This one starts earlier, because most SaaS products die from a build-order mistake rather than a channel mistake.

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

Almost every painful SaaS rewrite we have seen came from inverting two of those steps.`;

export const fallbackPosts: BlogPostDetail[] = [
  {
    id: "post-cost-nepal",
    slug: "custom-software-development-cost-nepal",
    title: "How much does custom software development cost in Nepal?",
    excerpt:
      "A practical breakdown of what drives custom software cost in Nepal — team shape, scope, integrations and the decisions that move a budget more than hourly rates.",
    content: COST_ARTICLE,
    cover_image_url: null,
    cover_image_alt: null,
    author_id: "author-inovexa",
    category_id: "cat-nepal-tech",
    reading_minutes: 6,
    intent: "Commercial research: budget expectations for custom software in Nepal",
    is_pillar: true,
    featured: true,
    published: true,
    published_at: "2026-09-13T00:00:00.000Z",
    updated_at: "2026-09-13T00:00:00.000Z",
    created_at: "2026-09-13T00:00:00.000Z",
    updated_note: null,
    seo_title: "How Much Does Custom Software Development Cost in Nepal?",
    seo_description:
      "What actually drives custom software development cost in Nepal — scope, integrations, data migration and ambiguity — and how projects are realistically structured.",
    seo_keywords: [
      "custom software development cost Nepal",
      "software development cost",
      "custom software Nepal",
    ],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
    author: fallbackAuthors[0]!,
    category: fallbackCategories[4]!,
    tags: [fallbackTags[0]!, fallbackTags[2]!],
  },
  {
    id: "post-build-vs-buy",
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom software vs off-the-shelf: how to decide",
    excerpt:
      "A decision framework for the question that quietly wastes the most budget — when to configure what exists, and when your process is worth building software for.",
    content: BUILD_VS_BUY_ARTICLE,
    cover_image_url: null,
    cover_image_alt: null,
    author_id: "author-inovexa",
    category_id: "cat-business-software",
    reading_minutes: 6,
    intent: "Decision-stage research: build vs buy for business software",
    is_pillar: false,
    featured: true,
    published: true,
    published_at: "2026-09-20T00:00:00.000Z",
    updated_at: "2026-09-20T00:00:00.000Z",
    created_at: "2026-09-20T00:00:00.000Z",
    updated_note: null,
    seo_title: "Custom Software vs Off-the-Shelf Software: How to Decide",
    seo_description:
      "A practical framework for choosing between custom software and off-the-shelf tools — the cost of workarounds, when your process is your advantage, and the hybrid that usually wins.",
    seo_keywords: [
      "custom software vs off the shelf",
      "build vs buy software",
      "business software decision",
    ],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
    author: fallbackAuthors[0]!,
    category: fallbackCategories[3]!,
    tags: [fallbackTags[2]!, fallbackTags[0]!],
  },
  {
    id: "post-how-to-build-saas",
    slug: "how-to-build-a-saas-product",
    title: "How to build a SaaS product: an honest sequence",
    excerpt:
      "Not a growth playbook. The engineering and product sequence that gets you from an idea to a first paying customer without burning a year on the wrong build.",
    content: SAAS_ARTICLE,
    cover_image_url: null,
    cover_image_alt: null,
    author_id: "author-inovexa",
    category_id: "cat-saas",
    reading_minutes: 6,
    intent: "Informational: how to build a SaaS product",
    is_pillar: false,
    featured: false,
    published: true,
    published_at: "2026-09-23T00:00:00.000Z",
    updated_at: "2026-09-23T00:00:00.000Z",
    created_at: "2026-09-23T00:00:00.000Z",
    updated_note: null,
    seo_title: "How to Build a SaaS Product: An Honest Sequence from Idea to Paying Customer",
    seo_description:
      "The engineering and product sequence for building a SaaS product: validate the problem, model the data, ship one complete loop, instrument, then charge — before growth.",
    seo_keywords: ["how to build a saas product", "saas development", "multi-tenant architecture"],
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    robots: "index,follow",
    author: fallbackAuthors[0]!,
    category: fallbackCategories[2]!,
    tags: [fallbackTags[1]!, fallbackTags[4]!],
  },
];

/** Intentionally empty — populated only with verified information. */
export const EMPTY = [] as const;
