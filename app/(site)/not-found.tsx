import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** notFound() inside public pages: rendered within the site layout (header included). */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
