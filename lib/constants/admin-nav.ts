import {
  CodeXml,
  FileText,
  FlaskConical,
  FolderKanban,
  Inbox,
  Layers,
  LayoutDashboard,
  ListChecks,
  Mail,
  Milestone,
  Newspaper,
  Quote,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

/** Every admin page that exists, grouped the way the sidebar shows them. */
export const ADMIN_NAV_GROUPS: readonly AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Innovation Lab", href: "/admin/innovation", icon: FlaskConical },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Process", href: "/admin/process", icon: Milestone },
      { label: "FAQs", href: "/admin/faqs", icon: ListChecks },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Technologies", href: "/admin/technologies", icon: CodeXml },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Inbox },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: Newspaper },
      { label: "Site settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

/** Flat list, for layouts that render one continuous menu. */
export const ADMIN_NAV: readonly AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

/** The dashboard is the admin home page. */
export const ADMIN_HOME = "/admin/dashboard";
