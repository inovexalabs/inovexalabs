import { redirect } from "next/navigation";
import { ADMIN_HOME } from "@/lib/constants/admin-nav";

/** /admin opens the first admin section until a dashboard exists. */
export default function AdminIndexPage() {
  redirect(ADMIN_HOME);
}
