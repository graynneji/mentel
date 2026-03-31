import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
