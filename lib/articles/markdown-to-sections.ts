// // lib/articles/markdown-to-sections.ts
// //
// // Converts a CMS article's Markdown `content` into the exact same shape
// // the legacy hard-coded articles use in utilz/articles/index.ts:
// // `{ intro, sections: [{ heading, body, list? }] }`. This lets a single
// // shared render (app/articles/[slug]/page.tsx) produce identical output
// // for both sources — no separate "database article" look.

// export interface ParsedListItem {
//   label?: string;
//   value: string;
// }

// export interface ParsedSection {
//   heading: string;
//   body: string;
//   list?: ParsedListItem[];
// }

// export interface ParsedArticleContent {
//   intro: string;
//   sections: ParsedSection[];
// }

// export function markdownToPlainText(markdown: string): string {
//   return markdown
//     .replace(/\r\n/g, "\n")
//     .replace(/^#{1,6}\s+/gm, "")
//     .replace(/\*\*(.*?)\*\*/g, "$1")
//     .replace(/\*(.*?)\*/g, "$1")
//     .replace(/`([^`]*)`/g, "$1")
//     .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
//     .replace(/^[-*]\s+/gm, "")
//     .replace(/^\d+\.\s+/gm, "");
// }

// function stripInlineMarkdown(text: string): string {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, "$1")
//     .replace(/\*(.*?)\*/g, "$1")
//     .replace(/`([^`]*)`/g, "$1")
//     .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
//     .trim();
// }

// export function markdownToSections(markdown: string): ParsedArticleContent {
//   const lines = markdown.replace(/\r\n/g, "\n").split("\n");
//   const introLines: string[] = [];
//   const sections: ParsedSection[] = [];
//   let current: { heading: string; bodyLines: string[]; list: string[] } | null = null;

//   const push = () => {
//     if (!current) return;
//     sections.push({
//       heading: current.heading,
//       body: current.bodyLines.join(" "),
//       list: current.list.length ? current.list.map((value) => ({ value })) : undefined,
//     });
//   };

//   for (const rawLine of lines) {
//     const line = rawLine.trim();
//     if (!line) continue;

//     // Any heading level (# through ######) starts a new section — the
//     // legacy shape only has one heading tier per section anyway.
//     const heading = line.match(/^#{1,6}\s+(.+)$/);
//     if (heading) {
//       push();
//       current = { heading: stripInlineMarkdown(heading[1]), bodyLines: [], list: [] };
//       continue;
//     }

//     const listItem = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
//     if (listItem && current) {
//       current.list.push(stripInlineMarkdown(listItem[1]));
//       continue;
//     }

//     const cleaned = stripInlineMarkdown(line);
//     if (!cleaned) continue;

//     if (current) current.bodyLines.push(cleaned);
//     else introLines.push(cleaned);
//   }
//   push();

//   return { intro: introLines.join(" "), sections };
// }

// lib/articles/markdown-to-sections.ts
//
// Converts a CMS article's Markdown `content` into the exact same shape
// the legacy hard-coded articles use in utilz/articles/index.ts:
// `{ intro, sections: [{ heading, body, list? }] }`. This lets a single
// shared render (app/articles/[slug]/page.tsx) produce identical output
// for both sources — no separate "database article" look.

export interface ParsedListItem {
  label?: string;
  value: string;
}

export interface ParsedSection {
  heading: string;
  body: string;
  list?: ParsedListItem[];
}

export interface ParsedArticleContent {
  intro: string;
  sections: ParsedSection[];
}

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .trim();
  // Note: [text](url) links are deliberately NOT stripped here — they're
  // preserved as literal Markdown syntax in the resulting body/intro
  // strings, and the render layer (app/articles/[slug]/page.tsx) parses
  // them back into real clickable links. Bold/italic/code have no
  // equivalent in the shared plain-text render, so those are flattened.
}

export function markdownToSections(markdown: string): ParsedArticleContent {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const introLines: string[] = [];
  const sections: ParsedSection[] = [];
  let current: { heading: string; bodyLines: string[]; list: string[] } | null =
    null;

  const push = () => {
    if (!current) return;
    sections.push({
      heading: current.heading,
      body: current.bodyLines.join(" "),
      list: current.list.length
        ? current.list.map((value) => ({ value }))
        : undefined,
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Any heading level (# through ######) starts a new section — the
    // legacy shape only has one heading tier per section anyway.
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      push();
      current = {
        heading: stripInlineMarkdown(heading[1]),
        bodyLines: [],
        list: [],
      };
      continue;
    }

    const listItem =
      line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
    if (listItem && current) {
      current.list.push(stripInlineMarkdown(listItem[1]));
      continue;
    }

    const cleaned = stripInlineMarkdown(line);
    if (!cleaned) continue;

    if (current) current.bodyLines.push(cleaned);
    else introLines.push(cleaned);
  }
  push();

  return { intro: introLines.join(" "), sections };
}
