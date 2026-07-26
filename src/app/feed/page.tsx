import { FeedView } from "@/components/feed-view"
import { getCategories, listArticles } from "@/lib/articles"

export default function FeedPage() {
  const categories = getCategories()
  const articles = listArticles()

  return <FeedView categories={categories} articles={articles} />
}
