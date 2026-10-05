import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/** Crawler rules for https://<site>/robots.txt. Admin and auth routes stay out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/", "/analytics"],
      },
    ],
    sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
