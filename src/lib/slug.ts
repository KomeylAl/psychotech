export function slugify(input: string, fallback = "item"): string {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `${fallback}-${Date.now().toString(36)}`;
}

export function uniqueSlug(base: string, existing: string[], fallback = "item"): string {
  let slug = slugify(base, fallback);
  if (!existing.includes(slug)) return slug;

  let index = 2;
  while (existing.includes(`${slug}-${index}`)) index += 1;
  return `${slug}-${index}`;
}
