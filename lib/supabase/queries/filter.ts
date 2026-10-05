/**
 * Shared helpers for public list queries.
 *
 * User input never reaches PostgREST filter syntax unsanitised: characters
 * that carry meaning in an `or=` expression (commas, parentheses, quotes,
 * wildcards) are removed before the term is wrapped as a "contains" pattern.
 * Returns null when nothing searchable is left, so callers skip the filter.
 */
export function ilikeTerm(term: string | undefined | null): string | null {
  if (!term) return null;
  const clean = term
    .replace(/[%_,()\\'"*=]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return clean.length >= 2 ? `*${clean}*` : null;
}

/** Slug-safe value for an equality filter (used for category/tag filters). */
export function exactTerm(term: string | undefined | null, max = 40): string | null {
  if (!term) return null;
  const clean = term.replace(/[,()\\'"*]/g, "").trim().slice(0, max);
  return clean.length >= 2 ? clean : null;
}
