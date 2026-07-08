// lib/seo/keyword-analysis.ts
//
// Lightweight on-page keyword analysis. No external keyword-research API —
// just frequency analysis of the page's own content, compared against the
// keywords you've told us you're targeting. Two useful outputs:
//
//  1. "Target keywords missing from content" — you said you're targeting
//     this phrase, but it doesn't actually appear in the body.
//  2. "Frequent phrases you haven't targeted" — phrases that show up
//     often in your content but aren't in your keywords list, meaning
//     you might be able to capture that as an explicit target term (title,
//     headings, meta description).
//
// This is intentionally simple (no NLP dependency) — it's meant to surface
// obvious gaps, not replace a real keyword-research tool like Ahrefs/Semrush.

const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","so","of","to","in","on","for","with",
  "at","by","from","up","about","into","over","after","is","are","was","were","be",
  "been","being","have","has","had","do","does","did","will","would","should","can",
  "could","may","might","must","shall","this","that","these","those","it","its","as",
  "not","no","yes","you","your","we","our","they","their","he","she","his","her",
  "i","me","my","them","what","which","who","whom","when","where","why","how","all",
  "any","both","each","few","more","most","other","some","such","only","own","same",
  "than","too","very","just","also","get","one","out","also","one's",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ") // strip any stray HTML/markdown tags
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function ngrams(words: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    const slice = words.slice(i, i + n);
    if (slice.some((w) => STOPWORDS.has(w) || w.length < 3)) continue;
    out.push(slice.join(" "));
  }
  return out;
}

export interface KeywordAnalysis {
  missingTargetKeywords: string[]; // in `keywords` but not found in content
  suggestedKeywords: { phrase: string; count: number }[]; // frequent, untargeted phrases
}

export function analyzeKeywords(content: string, targetKeywords: string[] = []): KeywordAnalysis {
  const lowerContent = content.toLowerCase();
  const missingTargetKeywords = targetKeywords.filter(
    (kw) => kw.trim() && !lowerContent.includes(kw.toLowerCase())
  );

  const words = tokenize(content);
  const counts = new Map<string, number>();
  for (const n of [2, 3]) {
    for (const phrase of ngrams(words, n)) {
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
  }

  const targetSet = new Set(targetKeywords.map((k) => k.toLowerCase().trim()));
  const suggestedKeywords = [...counts.entries()]
    .filter(([phrase, count]) => count >= 3 && !targetSet.has(phrase))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase, count]) => ({ phrase, count }));

  return { missingTargetKeywords, suggestedKeywords };
}
