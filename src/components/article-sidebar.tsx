import Link from "next/link"
import { ArticleToc } from "@/components/article-toc"
import type { ArticleTocItem } from "@/lib/articles"
import type { ArticlePromo, Author } from "@/lib/authors"
import { cn } from "@/lib/utils"

function formatDateZh(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function AuthorRow({
  author,
  isLast,
}: {
  author: Author
  isLast: boolean
}) {
  const className = cn(
    "flex items-center gap-3 px-4 py-3",
    !isLast && "border-b border-border",
    "transition-colors duration-200 hover:bg-muted/70"
  )

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={author.avatar}
        alt=""
        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border"
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium tracking-tight">
          {author.name}
        </div>
        <div className="truncate text-[13px] text-muted-foreground">
          {author.title}
        </div>
      </div>
    </>
  )

  if (author.url) {
    return (
      <Link href={author.url} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}

export function ArticleSidebar({
  authors,
  date,
  readingTime,
  promo,
  toc,
}: {
  authors: Author[]
  date: string | null
  readingTime: number
  promo: ArticlePromo | null
  toc: ArticleTocItem[]
}) {
  const showPromo = Boolean(promo?.enabled)

  return (
    <aside>
      {/* 作者区：贴齐四边；首段不加顶线，避免与上方分段线重合 */}
      <div className="border-b border-border">
        {authors.map((author, i) => (
          <AuthorRow
            key={author.id}
            author={author}
            isLast={i === authors.length - 1}
          />
        ))}
      </div>

      <div className="border-b border-border px-6 py-6 sm:px-8">
        <p className="text-sm text-muted-foreground">详细信息</p>
        <dl className="mt-4 space-y-3 text-[13px]">
          {date ? (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">发布</dt>
              <dd className="text-right text-foreground">
                <time dateTime={date}>{formatDateZh(date)}</time>
              </dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">阅读</dt>
            <dd className="text-right text-foreground">{readingTime} 分钟</dd>
          </div>
        </dl>
      </div>

      {showPromo && promo ? (
        <div className="px-6 py-6 sm:px-8">
          <a
            href={promo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-[6px] border border-border bg-card transition-colors duration-200 hover:bg-muted/50"
          >
            {promo.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={promo.image}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            ) : null}
            <div className="px-4 py-4">
              <div className="text-sm font-medium tracking-tight">
                {promo.title}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {promo.description}
              </p>
            </div>
          </a>
        </div>
      ) : null}

      <ArticleToc items={toc} />
    </aside>
  )
}
