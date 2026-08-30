import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleCover } from "@/components/article-cover"
import { ArticleSidebar } from "@/components/article-sidebar"
import {
  BLOG_HERO_PAD,
  BlogSection,
  BlogShell,
} from "@/components/blog-frame"
import { Comment } from "@/components/comment"
import { JsonLd } from "@/components/json-ld"
import { getArticlePromo } from "@/lib/authors"
import { getArticleBySlug, listArticles } from "@/lib/articles"
import { articleJsonLd, pageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return listArticles().map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "未找到文章" }

  return pageMetadata({
    title: article.title,
    description: article.description,
    path: article.url,
    image: article.cover,
    type: "article",
    publishedTime: article.date,
    authors: article.authors.map((author) => author.name),
    tags: article.tags,
    section: article.category,
  })
}

function formatDateZh(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  const promo = getArticlePromo()

  return (
    <BlogShell>
      <JsonLd data={articleJsonLd(article)} />
      {/* 标题区：全宽，不与侧栏并排 */}
      <BlogSection hero>
        <div className={BLOG_HERO_PAD}>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {article.category ? (
              <Link
                href={`/feed?category=${encodeURIComponent(article.category)}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors duration-200 hover:bg-muted"
              >
                {article.category}
              </Link>
            ) : null}
            {article.date ? (
              <time dateTime={article.date}>{formatDateZh(article.date)}</time>
            ) : null}
          </div>

          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-[450] leading-[1.08] tracking-[-0.045em]">
            {article.title}
          </h1>

          {article.description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.description}
            </p>
          ) : null}
        </div>
      </BlogSection>

      {/* 正文 + 侧栏：侧栏与封面齐平 */}
      <BlogSection>
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 lg:border-r lg:border-border">
            <ArticleCover
              slug={article.slug}
              cover={article.cover}
              hascover={article.hascover}
            />

            <article className="px-4 py-10 sm:px-12 sm:py-14">
              <div
                className="article-prose max-w-[640px] space-y-5 text-base leading-8 [&_a]:text-[var(--terminal-green)] [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:duration-200 [&_a]:hover:text-foreground [&_h1]:mt-10 [&_h1]:scroll-mt-28 [&_h1]:text-2xl [&_h1]:font-[450] [&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:text-xl [&_h2]:font-[450] [&_h3]:mt-8 [&_h3]:scroll-mt-28 [&_img]:my-8 [&_img]:block [&_img]:w-full [&_img]:rounded-lg [&_img]:border-0 [&_img]:outline-none [&_pre]:overflow-x-auto [&_pre]:rounded-[6px] [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-4"
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
            </article>
          </div>

          <div className="relative z-10 border-t border-border lg:border-t-0">
            <div className="lg:sticky lg:top-24">
              <ArticleSidebar
                authors={article.authors}
                date={article.date}
                readingTime={article.readingTime}
                promo={promo}
                toc={article.toc}
              />
            </div>
          </div>
        </div>
      </BlogSection>

      <BlogSection>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="px-4 py-10 sm:px-12 sm:py-14 lg:border-r lg:border-border">
            <h2 className="mb-6 text-lg font-medium tracking-tight">评论</h2>
            <div className="max-w-[640px]">
              <Comment />
            </div>
          </div>
          <div aria-hidden className="hidden lg:block" />
        </div>
      </BlogSection>
    </BlogShell>
  )
}
