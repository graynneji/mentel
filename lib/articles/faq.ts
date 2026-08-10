// lib/articles/faq.ts
//
// Shared between app/api/admin/articles/route.ts (create) and
// app/api/admin/articles/[id]/route.ts (update) so the validation/shape
// logic only lives in one place.

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Coerces an arbitrary request-body value into a clean FaqItem[], dropping
 * anything malformed rather than throwing, an article save shouldn't fail
 * outright over one bad FAQ entry.
 */
export function sanitizeFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const q = "q" in item ? String((item as { q: unknown }).q ?? "").trim() : "";
      const a = "a" in item ? String((item as { a: unknown }).a ?? "").trim() : "";
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is FaqItem => item !== null);
}
