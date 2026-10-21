const HASH_TO_PATH: Record<string, string> = {
  "#top": "/",
  "#about": "/about",
  "#approach": "/approach",
  "#products": "/products",
  "#team": "/team",
  "#blog": "/blog",
  "#contact": "/contact",
};

/** Public URL for a nav href. Hash anchors from the old landing stay in the database. */
export function toPublicHref(href: string): string {
  return HASH_TO_PATH[href] ?? href;
}

export function isNavActive(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
