// lib/seo/auto-optimize.ts
//
// Generates concrete, ready-to-apply meta title/description suggestions
// from an article's own content — pure heuristics, no external API key
// required. The admin SEO dashboard shows these as a diff the person can
// accept with one click (PATCH to the article), never auto-applied silently.

import { analyzeKeywords } from "./keyword-analysis";

export interface OptimizationSuggestions {
  suggestedMetaTitle: string | null;
  suggestedMetaDescription: string | null;
  suggestedKeywordsToAdd: string[];
  reasons: string[];
}

const TITLE_MIN = 40;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}

export function suggestOptimizations(article: {
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
}): OptimizationSuggestions {
  const reasons: string[] = [];
  const primaryKeyword = article.keywords?.[0];

  // ── Meta title ──────────────────────────────────────────────────────────
  const currentTitle = article.metaTitle || article.title;
  let suggestedMetaTitle: string | null = null;

  if (currentTitle.length < TITLE_MIN) {
    reasons.push(`Title is only ${currentTitle.length} characters — search engines have more room (aim for ${TITLE_MIN}-${TITLE_MAX}).`);
    suggestedMetaTitle = primaryKeyword && !currentTitle.toLowerCase().includes(primaryKeyword.toLowerCase())
      ? `${currentTitle} | ${primaryKeyword}`
      : `${currentTitle} - Mentel`;
  } else if (currentTitle.length > TITLE_MAX) {
    reasons.push(`Title is ${currentTitle.length} characters — Google truncates titles past ~60, so it'll get cut off in search results.`);
    suggestedMetaTitle = truncateAtWord(currentTitle, TITLE_MAX);
  } else if (primaryKeyword && !currentTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    reasons.push(`Your top target keyword ("${primaryKeyword}") doesn't appear in the title.`);
    suggestedMetaTitle = truncateAtWord(`${currentTitle} — ${primaryKeyword}`, TITLE_MAX);
  }

  // ── Meta description ────────────────────────────────────────────────────
  const currentDesc = article.metaDescription || article.excerpt;
  let suggestedMetaDescription: string | null = null;

  if (currentDesc.length < DESC_MIN) {
    reasons.push(`Meta description is only ${currentDesc.length} characters — aim for ${DESC_MIN}-${DESC_MAX} to use the full search snippet.`);
    const extra = article.content.replace(/[#*_`>-]/g, "").split(/\s+/).slice(0, 20).join(" ");
    suggestedMetaDescription = truncateAtWord(`${currentDesc} ${extra}`, DESC_MAX);
  } else if (currentDesc.length > DESC_MAX) {
    reasons.push(`Meta description is ${currentDesc.length} characters — Google truncates past ~158.`);
    suggestedMetaDescription = truncateAtWord(currentDesc, DESC_MAX);
  } else if (primaryKeyword && !currentDesc.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    reasons.push(`Meta description doesn't mention your top target keyword ("${primaryKeyword}").`);
    suggestedMetaDescription = truncateAtWord(`${currentDesc} Learn more about ${primaryKeyword}.`, DESC_MAX);
  }

  // ── Keyword gaps ────────────────────────────────────────────────────────
  const { suggestedKeywords } = analyzeKeywords(article.content, article.keywords);
  const suggestedKeywordsToAdd = suggestedKeywords.slice(0, 3).map((k) => k.phrase);
  if (suggestedKeywordsToAdd.length > 0) {
    reasons.push(
      `Your content repeatedly uses "${suggestedKeywordsToAdd[0]}" but it isn't in your target keywords list — consider adding it.`
    );
  }

  return { suggestedMetaTitle, suggestedMetaDescription, suggestedKeywordsToAdd, reasons };
}
