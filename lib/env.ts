import { z } from "zod";

/**
 * Public, browser-safe configuration only. Secrets (service-role keys) are
 * never read by this app. Each variable is referenced literally so Next.js
 * can inline NEXT_PUBLIC_* values at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url("NEXT_PUBLIC_SUPABASE_URL must be the project URL, e.g. https://abcd.supabase.co"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be the project's publishable (or legacy anon) key"),
  NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL must be the absolute site URL, e.g. https://inovexalabs.com"),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration. Copy .env.example to .env.local and fill it in.\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
