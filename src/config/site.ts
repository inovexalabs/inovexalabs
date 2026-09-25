/**
 * Static, non-editorial configuration for Inovexa Labs.
 *
 * Anything an editor should be able to change lives in Supabase (site_settings,
 * navigation_items, services, products, ...). What remains here is structural:
 * route maps, taxonomy enums and defaults used for SEO fallbacks.
 */

export const siteConfig = {
  name: "Inovexa Labs",
  legalName: "Inovexa Labs",
  tagline: "Software development × product innovation.",
  positioning: "On-demand software development company and product innovation lab.",
  promise: "We build software for today. We invent products for tomorrow.",
  support:
    "Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.",
  description:
    "Inovexa Labs is an on-demand software development company and product innovation lab. We build custom software for businesses and develop our own technology products.",
  /** No fabricated address. Filled from site_settings once a real office exists. */
  contact: {
    email: "hello@inovexalabs.com",
    phone: "",
    address: "",
    city: "Kathmandu",
    region: "Bagmati",
    country: "Nepal",
    countryCode: "NP",
    hours: "",
    latitude: "",
    longitude: "",
  },
  socials: {
    x: "",
    linkedin: "",
    github: "",
    instagram: "",
  },
  /** The idea → impact pipeline that structures the whole site. */
  journey: [
    { id: "idea", label: "Idea", blurb: "A problem worth solving." },
    { id: "experiment", label: "Experiment", blurb: "Cheap, fast, honest testing." },
    { id: "build", label: "Build", blurb: "Engineering that holds up." },
    { id: "launch", label: "Launch", blurb: "Real users, real feedback." },
    { id: "impact", label: "Impact", blurb: "Measured, not marketed." },
  ],
} as const;

export const primaryNav = [
  { title: "Products", href: "/products" },
  { title: "Services", href: "/services" },
  { title: "Work", href: "/work" },
  { title: "Lab", href: "/lab" },
  { title: "Insights", href: "/insights" },
  { title: "About", href: "/about" },
] as const;

/** Product / experiment lifecycle. Drives the visual status indicators. */
export const PRODUCT_STATUSES = [
  "idea",
  "experiment",
  "in_development",
  "live",
  "archived",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const STATUS_META: Record<
  ProductStatus,
  { label: string; dot: string; text: string; ring: string }
> = {
  idea: {
    label: "Idea",
    dot: "bg-status-idea",
    text: "text-status-idea",
    ring: "border-status-idea/40",
  },
  experiment: {
    label: "Experiment",
    dot: "bg-status-experiment",
    text: "text-status-experiment",
    ring: "border-status-experiment/40",
  },
  in_development: {
    label: "In Development",
    dot: "bg-status-development",
    text: "text-status-development",
    ring: "border-status-development/40",
  },
  live: {
    label: "Live",
    dot: "bg-status-live",
    text: "text-status-live",
    ring: "border-status-live/40",
  },
  archived: {
    label: "Archived",
    dot: "bg-status-archived",
    text: "text-status-archived",
    ring: "border-status-archived/40",
  },
};

export const PRODUCT_CATEGORIES = [
  "SaaS",
  "Business Software",
  "AI",
  "Productivity",
  "FinTech",
  "E-commerce",
  "Developer Tools",
] as const;

export const SERVICE_CATEGORIES = [
  "Engineering",
  "Product",
  "Intelligence",
  "Design",
] as const;

export const TECHNOLOGY_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "AI",
  "Mobile",
  "DevOps",
] as const;
export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "Mobile App",
  "SaaS",
  "AI",
  "Business Software",
  "E-commerce",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $40,000",
  "$40,000+",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "ASAP",
  "1–2 months",
  "3–6 months",
  "6+ months",
  "Still exploring",
] as const;

export const REFERRAL_SOURCES = [
  "Search engine",
  "Referral",
  "Social media",
  "Existing product",
  "Event or community",
  "Other",
] as const;

/** The seven-step pipeline. Editable copy lives in Supabase; ids are stable. */
export const BUILD_PHASES = [
  { id: "discover", label: "Discovery", number: "01" },
  { id: "design", label: "Design", number: "02" },
  { id: "development", label: "Development", number: "03" },
  { id: "testing", label: "Testing", number: "04" },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    id: "idea",
    title: "Idea",
    body: "We start with the problem, not the stack. Who feels it, how often, and what does it cost them today.",
  },
  {
    number: "02",
    id: "discover",
    title: "Discover",
    body: "Constraints, data, integrations and success criteria get written down before a single component is built.",
  },
  {
    number: "03",
    id: "design",
    title: "Design",
    body: "Flows and interfaces designed around real tasks — reviewed on a phone before they are reviewed on a monitor.",
  },
  {
    number: "04",
    id: "build",
    title: "Build",
    body: "Small vertical slices in production, with typed contracts, code review and a deploy on every merge.",
  },
  {
    number: "05",
    id: "test",
    title: "Test",
    body: "Automated checks plus deliberate human review, including the failure states nobody demos.",
  },
  {
    number: "06",
    id: "launch",
    title: "Launch",
    body: "Instrumented, monitored releases with a rollback path — not a Friday afternoon surprise.",
  },
  {
    number: "07",
    id: "evolve",
    title: "Evolve",
    body: "Ship, measure, prune. Software is a system that keeps changing, so we build it to be changed.",
  },
] as const;

export const COMPANY_VALUES = [
  {
    title: "Truth over polish",
    body: "We publish what is real. No invented metrics, no borrowed logos, no testimonials we cannot source.",
  },
  {
    title: "Engineering as craft",
    body: "Typed contracts, tests where they matter, and systems the next person can actually read.",
  },
  {
    title: "Ship to learn",
    body: "A working slice in front of a real user beats a perfect architecture diagram every time.",
  },
  {
    title: "Own the outcome",
    body: "We are accountable for whether it works in production, not just whether it compiles.",
  },
] as const;
