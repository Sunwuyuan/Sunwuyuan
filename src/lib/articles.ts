import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"
import { resolveAuthors, type Author } from "@/lib/authors"

export type ArticleTocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type Article = {
  id: string
  slug: string
  url: string
  title: string
  description: string
  content: string
  html: string
  preview: string
  hascover: boolean
  cover: string
  date: string | null
  dateText: string
  tags: string[]
  categories: string[]
  category: string | null
  pinned: boolean
  readingTime: number
  authorIds: string[]
  authors: Author[]
  toc: ArticleTocItem[]
}

function slugifyHeading(text: string) {
  const base = text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return base || "section"
}

/** 为 h2/h3 注入 id，并提取目录 */
export function processArticleHtml(html: string): {
  html: string
  toc: ArticleTocItem[]
} {
  const toc: ArticleTocItem[] = []
  const used = new Map<string, number>()

  const nextId = (text: string) => {
    const base = slugifyHeading(text)
    const n = used.get(base) || 0
    used.set(base, n + 1)
    return n === 0 ? base : `${base}-${n}`
  }

  const processed = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (_match, levelStr: string, attrs = "", inner: string) => {
      const level = Number(levelStr) as 2 | 3
      const text = inner.replace(/<[^>]+>/g, "").trim()
      const existing = /\sid=["']([^"']+)["']/i.exec(attrs)
      const id = existing?.[1] || nextId(text)
      toc.push({ id, text, level })
      if (existing) {
        return `<h${level}${attrs}>${inner}</h${level}>`
      }
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    }
  )

  return { html: processed, toc }
}

const ARTICLES_DIR = path.join(process.cwd(), "content/articles")

function normalizeList(value: unknown, fallback: string[] = []) {
  if (!value) return fallback
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  return [String(value)].filter(Boolean)
}

function createArticle(slug: string, raw: string): Article {
  const { data, content } = matter(raw)
  const preview = content
    .replace(/[#>*`-]/g, "")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 160)
  const date =
    data.date && !Number.isNaN(new Date(data.date).getTime())
      ? new Date(data.date).toISOString()
      : null
  const categories = normalizeList(data.categories || data.category)
  const authorIds = normalizeList(data.authors || data.author, ["wuyuan"])
  const { html, toc } = processArticleHtml(
    marked.parse(content, { async: false }) as string
  )

  return {
    id: slug,
    slug,
    url: `/articles/${slug}`,
    title: String(data.title || slug),
    description: String(data.description || preview),
    content,
    html,
    preview,
    hascover: Boolean(data.cover),
    cover: String(data.cover || "/covers/default.png"),
    date,
    dateText: date?.slice(0, 10) || "",
    tags: normalizeList(data.tags),
    categories,
    category: categories[0] || null,
    pinned: Boolean(data.pinned),
    readingTime: Math.max(1, Math.ceil(content.length / 500)),
    authorIds,
    authors: resolveAuthors(authorIds),
    toc,
  }
}

function loadAll(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, name), "utf8")
      return createArticle(slug, raw)
    })
    .filter((item) => !Boolean((item as Article & { draft?: boolean }).draft))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    })
}

export function listArticles(options?: {
  tag?: string
  category?: string
  limit?: number
}) {
  let items = loadAll()
  if (options?.tag) items = items.filter((item) => item.tags.includes(options.tag!))
  if (options?.category) {
    items = items.filter((item) => item.categories.includes(options.category!))
  }
  return options?.limit ? items.slice(0, options.limit) : items
}

export function getArticleBySlug(slug: string) {
  return loadAll().find((item) => item.slug === slug) || null
}

export function getTags() {
  return [...new Set(loadAll().flatMap((item) => item.tags))]
}

export function getCategories() {
  const map: Record<string, number> = {}
  for (const item of loadAll()) {
    for (const category of item.categories) {
      map[category] = (map[category] || 0) + 1
    }
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }))
}
