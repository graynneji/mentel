// // SEO Scoring Engine for Next.js (Lightweight Internal Tool)
// // This turns your current helper into a full page-level SEO analyzer

// export type SEOScoreInput = {
//   title?: string;
//   description?: string;
//   keywords?: string[];
//   content?: string;
//   url?: string;
//   headings?: string[];
//   internalLinks?: number;
//   externalLinks?: number;
//   imageAltTexts?: string[];
//   schemaTypes?: string[];
// };

// export type SEOScoreResult = {
//   overallScore: number;
//   technicalScore: number;
//   contentScore: number;
//   structureScore: number;
//   keywordScore: number;
//   readabilityScore: number;
//   breakdown: Record<string, number>;
//   suggestions: string[];
// };

// // -----------------------------
// // CORE ENGINE
// // -----------------------------

// export function scorePageSEO(input: SEOScoreInput): SEOScoreResult {
//   const keywordScore = calculateKeywordScore(input);
//   const contentScore = calculateContentScore(input);
//   const technicalScore = calculateTechnicalScore(input);
//   const structureScore = calculateStructureScore(input);
//   const readabilityScore = calculateReadability(input.content || "");

//   const overallScore = Math.round(
//     keywordScore * 0.25 +
//       contentScore * 0.25 +
//       technicalScore * 0.2 +
//       structureScore * 0.15 +
//       readabilityScore * 0.15,
//   );

//   const suggestions = generateSuggestions({
//     keywordScore,
//     contentScore,
//     technicalScore,
//     structureScore,
//     readabilityScore,
//     input,
//   });

//   return {
//     overallScore,
//     technicalScore,
//     contentScore,
//     structureScore,
//     keywordScore,
//     readabilityScore,
//     breakdown: {
//       keywordScore,
//       contentScore,
//       technicalScore,
//       structureScore,
//       readabilityScore,
//     },
//     suggestions,
//   };
// }

// // -----------------------------
// // KEYWORD ANALYSIS
// // -----------------------------

// function calculateKeywordScore(input: SEOScoreInput): number {
//   if (!input.content || !input.keywords?.length) return 50;

//   const words = tokenize(input.content);
//   const totalWords = words.length || 1;

//   let score = 0;

//   input.keywords.forEach((keyword) => {
//     const matches = words.filter((w) => w === keyword.toLowerCase()).length;

//     const density = (matches / totalWords) * 100;

//     // ideal density range: 0.5% - 2.5%
//     if (density >= 0.5 && density <= 2.5) score += 20;
//     else if (density > 0 && density < 5) score += 10;
//     else if (density >= 5) score -= 10;
//   });

//   return clamp(score, 0, 100);
// }

// // -----------------------------
// // CONTENT QUALITY
// // -----------------------------

// function calculateContentScore(input: SEOScoreInput): number {
//   const content = input.content || "";
//   const wordCount = tokenize(content).length;

//   let score = 0;

//   if (wordCount > 300) score += 25;
//   if (wordCount > 800) score += 25;
//   if (wordCount > 1500) score += 20;

//   if (input.description) score += 10;
//   if (input.title && input.title.length > 30) score += 10;
//   if (input.imageAltTexts?.length) score += 10;

//   return clamp(score, 0, 100);
// }

// // -----------------------------
// // TECHNICAL SEO
// // -----------------------------

// function calculateTechnicalScore(input: SEOScoreInput): number {
//   let score = 60; // base score

//   if (input.title && input.title.length >= 30 && input.title.length <= 60)
//     score += 10;

//   if (
//     input.description &&
//     input.description.length >= 120 &&
//     input.description.length <= 160
//   )
//     score += 10;

//   if (input.schemaTypes?.length) score += 10;
//   if (input.url?.includes("https")) score += 5;
//   if ((input.internalLinks || 0) > 3) score += 5;

//   return clamp(score, 0, 100);
// }

// // -----------------------------
// // STRUCTURE
// // -----------------------------

// function calculateStructureScore(input: SEOScoreInput): number {
//   let score = 50;

//   const headings = input.headings || [];

//   if (headings.some((h) => h.startsWith("h1"))) score += 20;
//   if (headings.length > 5) score += 10;
//   if ((input.internalLinks || 0) > 2) score += 10;

//   return clamp(score, 0, 100);
// }

// // -----------------------------
// // READABILITY (simple proxy)
// // -----------------------------

// function calculateReadability(content: string): number {
//   const words = tokenize(content);
//   const sentences = content.split(/[.!?]+/).length;

//   const avgWordsPerSentence = words.length / (sentences || 1);

//   // simpler is better
//   const score = 100 - avgWordsPerSentence * 2;

//   return clamp(Math.round(score), 0, 100);
// }

// // -----------------------------
// // SUGGESTIONS ENGINE
// // -----------------------------

// function generateSuggestions(input: {
//   keywordScore: number;
//   contentScore: number;
//   technicalScore: number;
//   structureScore: number;
//   readabilityScore: number;
//   input: SEOScoreInput;
// }): string[] {
//   const suggestions: string[] = [];

//   if (input.keywordScore < 60)
//     suggestions.push(
//       "Improve keyword placement and reduce over/under optimization",
//     );

//   if (input.contentScore < 60)
//     suggestions.push("Increase content depth (aim for 800+ words)");

//   if (input.technicalScore < 70)
//     suggestions.push(
//       "Fix meta title/description length and add structured data",
//     );

//   if (input.structureScore < 60)
//     suggestions.push("Improve heading structure (H1 → H2 → H3)");

//   if (input.readabilityScore < 60)
//     suggestions.push("Simplify sentence structure for better readability");

//   return suggestions;
// }

// // -----------------------------
// // HELPERS
// // -----------------------------

// function tokenize(text: string): string[] {
//   return text.toLowerCase().match(/\b\w+\b/g) || [];
// }

// function clamp(value: number, min: number, max: number): number {
//   return Math.max(min, Math.min(max, value));
// }

// // -----------------------------
// // NEXT.JS USAGE EXAMPLE
// // -----------------------------

// /*
// import { scorePageSEO } from "@/lib/seo-scoring-engine";

// const result = scorePageSEO({
//   title: "Mentel | Mental Health Therapy Nigeria",
//   description: "Online therapy platform in Nigeria...",
//   keywords: ["therapy", "mental health", "Nigeria"],
//   content: "Your blog or page content here...",
//   schemaTypes: ["Organization", "MedicalBusiness"],
//   internalLinks: 5,
//   headings: ["h1-hero", "h2-services"],
// });

// console.log(result.overallScore);
// */

// SEO Scoring Engine for Next.js (Lightweight Internal Tool)
// This turns your current helper into a full page-level SEO analyzer

export type SEOScoreInput = {
  title?: string;
  description?: string;
  keywords?: string[];
  content?: string;
  url?: string;
  headings?: string[];
  internalLinks?: number;
  externalLinks?: number;
  imageAltTexts?: string[];
  schemaTypes?: string[];
};

export type SEOScoreResult = {
  overallScore: number;
  technicalScore: number;
  contentScore: number;
  structureScore: number;
  keywordScore: number;
  readabilityScore: number;
  breakdown: Record<string, number>;
  suggestions: string[];
};

// -----------------------------
// CORE ENGINE
// -----------------------------

export function scorePageSEO(input: SEOScoreInput): SEOScoreResult {
  const keywordScore = calculateKeywordScore(input);
  const contentScore = calculateContentScore(input);
  const technicalScore = calculateTechnicalScore(input);
  const structureScore = calculateStructureScore(input);
  const readabilityScore = calculateReadability(input.content || "");

  const overallScore = Math.round(
    keywordScore * 0.25 +
      contentScore * 0.25 +
      technicalScore * 0.2 +
      structureScore * 0.15 +
      readabilityScore * 0.15,
  );

  const suggestions = generateSuggestions({
    keywordScore,
    contentScore,
    technicalScore,
    structureScore,
    readabilityScore,
    input,
  });

  return {
    overallScore,
    technicalScore,
    contentScore,
    structureScore,
    keywordScore,
    readabilityScore,
    breakdown: {
      keywordScore,
      contentScore,
      technicalScore,
      structureScore,
      readabilityScore,
    },
    suggestions,
  };
}

// -----------------------------
// KEYWORD ANALYSIS
// -----------------------------

function calculateKeywordScore(input: SEOScoreInput): number {
  if (!input.content || !input.keywords?.length) return 50;

  // Bug fix: the previous version tokenized content into single words and
  // then checked `word === keyword`, which can only ever match single-word
  // keywords. Real target keywords are almost always multi-word phrases
  // ("therapy cost Nigeria"), so that comparison silently matched nothing
  // and every article scored 0 on keywords regardless of actual usage.
  // This counts real phrase occurrences in the content instead.
  const lowerContent = input.content.toLowerCase();
  const totalWords = tokenize(input.content).length || 1;

  let score = 0;

  input.keywords.forEach((rawKeyword) => {
    const keyword = rawKeyword.toLowerCase().trim();
    if (!keyword) return;

    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = (lowerContent.match(new RegExp(escaped, "g")) || []).length;
    const wordsInPhrase = keyword.split(/\s+/).length;
    const density = ((matches * wordsInPhrase) / totalWords) * 100;

    // ideal density range: 0.5% - 2.5%
    if (density >= 0.5 && density <= 2.5) score += 20;
    else if (density > 0 && density < 5) score += 10;
    else if (density >= 5) score -= 10;
  });

  return clamp(score, 0, 100);
}

// -----------------------------
// CONTENT QUALITY
// -----------------------------

function calculateContentScore(input: SEOScoreInput): number {
  const content = input.content || "";
  const wordCount = tokenize(content).length;

  let score = 0;

  if (wordCount > 300) score += 25;
  if (wordCount > 800) score += 25;
  if (wordCount > 1500) score += 20;

  if (input.description) score += 10;
  if (input.title && input.title.length > 30) score += 10;
  if (input.imageAltTexts?.length) score += 10;

  return clamp(score, 0, 100);
}

// -----------------------------
// TECHNICAL SEO
// -----------------------------

function calculateTechnicalScore(input: SEOScoreInput): number {
  let score = 60; // base score

  if (input.title && input.title.length >= 30 && input.title.length <= 60)
    score += 10;

  if (
    input.description &&
    input.description.length >= 120 &&
    input.description.length <= 160
  )
    score += 10;

  if (input.schemaTypes?.length) score += 10;
  if (input.url?.includes("https")) score += 5;
  if ((input.internalLinks || 0) > 3) score += 5;

  return clamp(score, 0, 100);
}

// -----------------------------
// STRUCTURE
// -----------------------------

function calculateStructureScore(input: SEOScoreInput): number {
  let score = 50;

  const headings = input.headings || [];

  if (headings.length >= 1) score += 10;
  if (headings.length > 5) score += 10;
  if (headings.length > 8) score += 10;
  if ((input.internalLinks || 0) > 2) score += 10;

  return clamp(score, 0, 100);
}

// -----------------------------
// READABILITY (simple proxy)
// -----------------------------

function calculateReadability(content: string): number {
  const words = tokenize(content);
  const sentences = content.split(/[.!?]+/).length;

  const avgWordsPerSentence = words.length / (sentences || 1);

  // simpler is better
  const score = 100 - avgWordsPerSentence * 2;

  return clamp(Math.round(score), 0, 100);
}

// -----------------------------
// SUGGESTIONS ENGINE
// -----------------------------

function generateSuggestions(input: {
  keywordScore: number;
  contentScore: number;
  technicalScore: number;
  structureScore: number;
  readabilityScore: number;
  input: SEOScoreInput;
}): string[] {
  const suggestions: string[] = [];

  if (input.keywordScore < 60)
    suggestions.push(
      "Improve keyword placement and reduce over/under optimization",
    );

  if (input.contentScore < 60)
    suggestions.push("Increase content depth (aim for 800+ words)");

  if (input.technicalScore < 70)
    suggestions.push(
      "Fix meta title/description length and add structured data",
    );

  if (input.structureScore < 60)
    suggestions.push("Improve heading structure (H1 → H2 → H3)");

  if (input.readabilityScore < 60)
    suggestions.push("Simplify sentence structure for better readability");

  return suggestions;
}

// -----------------------------
// HELPERS
// -----------------------------

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// -----------------------------
// NEXT.JS USAGE EXAMPLE
// -----------------------------

/*
import { scorePageSEO } from "@/lib/seo-scoring-engine";

const result = scorePageSEO({
  title: "Mentel | Mental Health Therapy Nigeria",
  description: "Online therapy platform in Nigeria...",
  keywords: ["therapy", "mental health", "Nigeria"],
  content: "Your blog or page content here...",
  schemaTypes: ["Organization", "MedicalBusiness"],
  internalLinks: 5,
  headings: ["h1-hero", "h2-services"],
});

console.log(result.overallScore);
*/
