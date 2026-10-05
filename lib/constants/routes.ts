export const ROUTES = {
  home: "/",
  services: "/services",
  service: (slug: string) => `/services/${slug}`,
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  innovation: "/innovation",
  innovationItem: (slug: string) => `/innovation/${slug}`,
  about: "/about",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  contact: "/contact",
  team: "/team",
  privacy: "/privacy",
  terms: "/terms",
  cookiePolicy: "/cookie-policy",
  search: "/search",
} as const;

export type NavMenu = "solutions";

export interface NavItem {
  label: string;
  href: string;
  /** Items with a menu open a panel instead of navigating directly. */
  menu?: NavMenu;
}

/** Site structure (routes), not editable content: the Solutions entries themselves come from Supabase. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Solutions", href: ROUTES.services, menu: "solutions" },
  { label: "Innovation", href: ROUTES.innovation },
  { label: "Projects", href: ROUTES.projects },
  { label: "About", href: ROUTES.about },
  { label: "Blog", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
];

export const PRIMARY_CTA = { label: "Start a Project", href: ROUTES.contact } as const;
