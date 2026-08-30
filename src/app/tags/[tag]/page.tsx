import type { Metadata } from "next"
import Link from "next/link"
import { ArticleCard } from "@/components/article-card"
import { getTags, listArticles } from "@/lib/articles"
import { pageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return getTags().map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const count = listArticles({ tag: decoded }).length
  return pageMetadata({
    title: decoded,
    description: `标签「${decoded}」下的 ${count} 篇文章。`,
    path: `/tags/${encodeURIComponent(decoded)}`,
  })
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const articles = listArticles({ tag: decoded })

  return (
    <section className="py-[clamp(4rem,8vw,6rem)]">
      <div className="container-site">
        <Link href="/tags" className="mb-3 inline-block text-sm text-muted-foreground">
          ← 标签
        </Link>
        <h1 className="heading-lg">{decoded}</h1>
        <p className="mt-2 mb-8 text-sm text-[var(--stone)]">{articles.length} 篇</p>
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} showCover={false} />
          ))}
        </div>
      </div>
    </section>
  )
}
