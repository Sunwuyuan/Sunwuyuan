import type { Metadata } from "next"
import type { Article } from "@/lib/articles"
import { site } from "@/lib/site"

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return new URL(normalized, site.url).href
}

function rasterOgImage(src?: string) {
  if (!src) return site.ogImage
  const pathname = src.split("?")[0] ?? src
  return /\.(png|jpe?g|gif|webp|avif)$/i.test(pathname) ? src : site.ogImage
}

function brandedTitle(title: string, absoluteTitle: boolean) {
  if (absoluteTitle || title === site.name) return site.name
  return `${title} · ${site.name}`
}

type PageMetaInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  tags?: string[]
  keywords?: string[]
  section?: string | null
  absoluteTitle?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  keywords,
  section,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = rasterOgImage(image)
  const fullTitle = brandedTitle(title, absoluteTitle)
  const images = [
    {
      url: imageUrl,
      alt: title,
      ...(imageUrl === site.ogImage ? { width: 1200, height: 630 } : {}),
    },
  ]

  const openGraph =
    type === "article"
      ? {
          type: "article" as const,
          locale: site.locale,
          url,
          siteName: site.name,
          title: fullTitle,
          description,
          images,
          publishedTime: publishedTime || undefined,
          modifiedTime: modifiedTime || publishedTime || undefined,
          authors: authors ?? [site.name],
          tags,
          section: section || undefined,
        }
      : {
          type: "website" as const,
          locale: site.locale,
          url,
          siteName: site.name,
          title: fullTitle,
          description,
          images,
        }

  const keywordList = keywords ?? tags

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywordList?.length ? { keywords: [...keywordList] } : {}),
    authors: (authors ?? [site.name]).map((name) => ({ name })),
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: site.twitter,
      creator: site.twitter,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  }
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: site.language,
        publisher: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        url: site.url,
        email: site.email,
        image: absoluteUrl(site.avatar),
        description: site.description,
        sameAs: site.sameAs,
      },
    ],
  }
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(article.url)
  const image = absoluteUrl(rasterOgImage(article.cover))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        image,
        datePublished: article.date || undefined,
        dateModified: article.date || undefined,
        inLanguage: site.language,
        url,
        mainEntityOfPage: url,
        timeRequired: `PT${article.readingTime}M`,
        keywords: article.tags,
        articleSection: article.category || undefined,
        author: article.authors.map((author) => ({
          "@type": "Person",
          name: author.name,
          url: author.url
            ? absoluteUrl(author.url)
            : `${site.url}/#person`,
        })),
        publisher: { "@id": `${site.url}/#person` },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "首页",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "文章",
            item: absoluteUrl("/feed"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: url,
          },
        ],
      },
    ],
  }
}
