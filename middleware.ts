import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/** Only the admin area and login touch sessions; public pages stay static. */
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
