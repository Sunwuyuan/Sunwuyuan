import type { MetadataRoute } from "next"
import { getTags, listArticles } from "@/lib/articles"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/feed`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/friends`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.url}/tags`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  const articles: MetadataRoute.Sitemap = listArticles().map((article) => ({
    url: `${site.url}${article.url}`,
    lastModified: article.date ? new Date(article.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const tags: MetadataRoute.Sitemap = getTags().map((tag) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }))

  return [...staticPages, ...articles, ...tags]
}
