import Link from "next/link"
import {
  BLOG_HERO_PAD,
  BlogSection,
  BlogShell,
} from "@/components/blog-frame"
import { BlogPostCell } from "@/components/blog-post-cell"
import { getCategories, listArticles } from "@/lib/articles"
import { cn } from "@/lib/utils"

const ALL = "全部"

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: rawCategory } = await searchParams
  const active = rawCategory?.trim() || ALL
  const categories = getCategories()
  const articles =
    active === ALL ? listArticles() : listArticles({ category: active })

  const tabs = [{ name: ALL }, ...categories.map((c) => ({ name: c.name }))]

  return (
    <BlogShell>
      <BlogSection hero>
        <div className={BLOG_HERO_PAD}>
          <h1 className="heading-lg">文章</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            最新文章与更新
          </p>

          <nav
            className="mt-8 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="文章分类"
          >
            {tabs.map((tab) => {
              const isActive = active === tab.name
              const href =
                tab.name === ALL
                  ? "/feed"
                  : `/feed?category=${encodeURIComponent(tab.name)}`
              return (
                <Link
                  key={tab.name}
                  href={href}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </BlogSection>

      <BlogSection>
        {articles.length > 0 ? (
          <ul
            className={cn(
              "grid grid-cols-1 md:grid-cols-3",
              "[&>*]:border-border",
              "max-md:[&>*:not(:last-child)]:border-b",
              "md:[&>*:not(:nth-child(3n))]:border-r",
              "md:[&>*:nth-child(n+4)]:border-t"
            )}
          >
            {articles.map((article) => (
              <BlogPostCell key={article.id} article={article} />
            ))}
          </ul>
        ) : (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground sm:px-12">
            该分类下暂无文章
          </p>
        )}
      </BlogSection>
    </BlogShell>
  )
}
