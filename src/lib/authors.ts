import fs from "node:fs"
import path from "node:path"

export type Author = {
  id: string
  name: string
  title: string
  avatar: string
  url?: string
}

export type ArticlePromo = {
  enabled: boolean
  title: string
  description: string
  href: string
  image?: string
}

const AUTHORS_PATH = path.join(process.cwd(), "content/authors.json")
const PROMO_PATH = path.join(process.cwd(), "content/article-promo.json")

const DEFAULT_AUTHOR_ID = "wuyuan"

export function listAuthors(): Author[] {
  if (!fs.existsSync(AUTHORS_PATH)) return []
  return JSON.parse(fs.readFileSync(AUTHORS_PATH, "utf8")) as Author[]
}

export function getArticlePromo(): ArticlePromo | null {
  if (!fs.existsSync(PROMO_PATH)) return null
  return JSON.parse(fs.readFileSync(PROMO_PATH, "utf8")) as ArticlePromo
}

/** 按 frontmatter 中的 id 解析作者；未声明或无效时回退默认作者 */
export function resolveAuthors(ids: string[]): Author[] {
  const all = listAuthors()
  const map = new Map(all.map((a) => [a.id, a]))
  const resolved = ids
    .map((id) => map.get(id))
    .filter((a): a is Author => Boolean(a))

  if (resolved.length > 0) return resolved

  const fallback = map.get(DEFAULT_AUTHOR_ID) || all[0]
  return fallback ? [fallback] : []
}
