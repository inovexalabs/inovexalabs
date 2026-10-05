/** True when `href` is the current page or one of its descendants (e.g. /blog matches /blog/post). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
