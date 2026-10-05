import type { Enums } from "@/types/database";

/**
 * Technology categories. Keep in sync with the `tech_category` enum in
 * supabase/migrations. Order here is the order they are listed in admin.
 */
export const TECH_CATEGORIES: Record<Enums<"tech_category">, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI",
  cloud: "Cloud",
  database: "Database",
  cybersecurity: "Cybersecurity",
  devops: "DevOps",
  mobile: "Mobile",
  web3: "Web3",
};

export const TECH_CATEGORY_KEYS = Object.keys(TECH_CATEGORIES) as Enums<"tech_category">[];
