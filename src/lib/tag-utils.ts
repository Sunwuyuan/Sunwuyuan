import { getTags, listArticles } from "@/lib/articles"

export function getArticlesByTagCount(tag: string) {
  return listArticles({ tag }).length
}

export { getTags }
