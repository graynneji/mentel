// import type { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//   return [
//     {
//       url: "https://trymentel.com",
//       changeFrequency: "weekly",
//       priority: 1.0,
//     },
//     {
//       url: "https://trymentel.com/assessment",
//       changeFrequency: "weekly",
//       priority: 0.9,
//     },
//     {
//       url: "https://trymentel.com/services",
//       changeFrequency: "monthly",
//       priority: 0.7,
//     },
//     {
//       url: "https://trymentel.com/about",
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: "https://trymentel.com/contact",
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: "https://trymentel.com/privacy",
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     {
//       url: "https://trymentel.com/terms",
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//   ];
// }

import type { MetadataRoute } from "next";

export const articles = [
  {
    slug: "mental-health-services-lagos",
    category: "Access to Care",
    title: "Mental Health Services in Lagos: A Complete Guide for 2025",
    excerpt:
      "From government hospitals to private online platforms, here is everything you need to know about finding affordable, quality mental health support in Lagos.",
    readMin: 7,
    date: "2025-06-12",
    featured: true,
    tags: ["Lagos", "Therapy", "Access"],
    image: null,
  },
  {
    slug: "online-therapy-nigeria-how-it-works",
    category: "Getting Started",
    title: "How Online Therapy Works in Nigeria — and Why It's Changing Lives",
    excerpt:
      "Stigma, distance, cost. The old barriers to mental healthcare are falling. We break down exactly how virtual therapy works, what to expect, and whether it's right for you.",
    readMin: 6,
    date: "2025-05-28",
    featured: false,
    tags: ["Online Therapy", "Nigeria"],
    image: null,
  },
  {
    slug: "anxiety-signs-nigerians-ignore",
    category: "Anxiety",
    title: "7 Signs of Anxiety Nigerians Are Taught to Ignore",
    excerpt:
      '"Just pray about it." "You\'re overthinking." Anxiety wears many masks in Nigerian culture — here\'s how to recognise it before it silently takes over your life.',
    readMin: 5,
    date: "2025-05-14",
    featured: false,
    tags: ["Anxiety", "Culture", "Self-Awareness"],
    image: null,
  },
  {
    slug: "depression-nigeria-men-silent-struggle",
    category: "Depression",
    title: "The Silent Struggle: Depression in Nigerian Men",
    excerpt:
      '"Men don\'t cry" and "be strong" are phrases that cost lives. This honest guide explores how depression shows up differently in men and what the path to healing looks like.',
    readMin: 8,
    date: "2025-04-30",
    featured: false,
    tags: ["Depression", "Men", "Nigeria"],
    image: null,
  },
  {
    slug: "cost-therapy-nigeria-affordable-options",
    category: "Access to Care",
    title: "How Much Does Therapy Cost in Nigeria? (And How to Afford It)",
    excerpt:
      "Therapy is often seen as a luxury only the wealthy can access. We break down real costs, HMO coverage, sliding-scale options, and platforms like Mentel making it affordable.",
    readMin: 6,
    date: "2025-04-15",
    featured: false,
    tags: ["Cost", "Access", "Nigeria"],
    image: null,
  },
  {
    slug: "couples-therapy-nigeria-when-to-go",
    category: "Relationships",
    title: "When Should Nigerian Couples Seek Therapy? 8 Honest Signals",
    excerpt:
      "Arguments are normal. But when do disagreements, distance, or repeated patterns signal something deeper? A couples therapist explains the real warning signs.",
    readMin: 7,
    date: "2025-03-22",
    featured: false,
    tags: ["Couples", "Marriage", "Relationships"],
    image: null,
  },
  {
    slug: "burnout-vs-stress-difference",
    category: "Burnout",
    title:
      "Burnout vs. Stress: How to Tell the Difference (and Why It Matters)",
    excerpt:
      "Everyone is stressed. But burnout is something else entirely — a state that doesn't resolve with rest alone. Here's how to know which one you're dealing with.",
    readMin: 5,
    date: "2025-03-08",
    featured: false,
    tags: ["Burnout", "Stress", "Work"],
    image: null,
  },
  {
    slug: "trauma-ptsd-nigeria-understanding",
    category: "Trauma",
    title: "Understanding Trauma and PTSD in a Nigerian Context",
    excerpt:
      "Road accidents, loss, violence, childhood experiences — trauma is more common than we admit. This guide explains what trauma does to the brain and how evidence-based therapies heal it.",
    readMin: 9,
    date: "2025-02-20",
    featured: false,
    tags: ["Trauma", "PTSD", "Healing"],
    image: null,
  },
  {
    slug: "mental-health-abuja-resources",
    category: "Access to Care",
    title: "Mental Health Resources in Abuja: Where to Get Help in the FCT",
    excerpt:
      "A practical, updated directory of therapists, hospitals, and online platforms available to residents of Abuja and the Federal Capital Territory.",
    readMin: 6,
    date: "2025-02-05",
    featured: false,
    tags: ["Abuja", "FCT", "Resources"],
    image: null,
  },
  {
    slug: "how-to-find-right-therapist-nigeria",
    category: "Getting Started",
    title: "How to Find the Right Therapist in Nigeria: A Step-by-Step Guide",
    excerpt:
      "Not every therapist is the right therapist for you. This guide walks you through credentials to check, questions to ask, red flags to avoid, and how the matching process really works.",
    readMin: 7,
    date: "2025-01-18",
    featured: false,
    tags: ["Finding Therapy", "Guide"],
    image: null,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://trymentel.com/articles/${article.slug}`,
    changeFrequency: "monthly",
    priority: article.featured ? 0.8 : 0.6,
    lastModified: new Date(article.date),
  }));

  return [
    {
      url: "https://trymentel.com",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://trymentel.com/assessment",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://trymentel.com/blog",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://trymentel.com/services",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://trymentel.com/about",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://trymentel.com/contact",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://trymentel.com/privacy",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://trymentel.com/terms",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articleEntries,
  ];
}
