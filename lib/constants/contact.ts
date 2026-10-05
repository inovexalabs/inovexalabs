/**
 * Options offered by the /contact intake form. The same values are shown by
 * the admin lead table, so both stay in one place.
 */
export const PROJECT_TYPES = [
  "New Product",
  "Website",
  "Mobile App",
  "AI System",
  "Cybersecurity",
  "Automation",
  "Cloud",
  "Custom Software",
  "Other",
] as const;

/** Nepali rupees, in lakh (1 lakh = Rs. 1,00,000) as clients in Nepal quote budgets. */
export const BUDGET_RANGES = [
  "Under Rs. 1 lakh",
  "Rs. 1–5 lakh",
  "Rs. 5–15 lakh",
  "Rs. 15 lakh+",
  "Not Sure",
] as const;

export const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Flexible"] as const;

/** Service areas a lead can tick. Labels mirror the Solutions menu. */
export const SERVICE_INTERESTS = [
  "Custom Software",
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Cybersecurity",
  "Automation",
  "Cloud & Infrastructure",
  "UI/UX & Product Design",
] as const;

export const LEAD_SOURCES = ["contact-form", "newsletter", "referral", "social", "other"] as const;
