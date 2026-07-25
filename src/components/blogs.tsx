import Link from "next/link"
import type { Article } from "@/lib/articles"
import { ArticleCard } from "@/components/article-card"

export function Blogs({ articles }: { articles: Article[] }) {
  return (
    <section className="py-[clamp(6rem,12vw,8rem)]">
      <div className="container-site">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="heading-lg">文章</h2>
          <Link href="/feed" className="shrink-0 text-sm text-muted-foreground hover:text-foreground">
            全部文章 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} showCover={false} />
          ))}
        </div>
      </div>
    </section>
  )
}
