import type { Metadata } from "next"
import { FeedView } from "@/components/feed-view"
import { getCategories, listArticles } from "@/lib/articles"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "文章",
  description: "孙悟元的文章：产品、社区与正在做的事。",
  path: "/feed",
})

export default function FeedPage() {
  const categories = getCategories()
  const articles = listArticles()

  return <FeedView categories={categories} articles={articles} />
}
