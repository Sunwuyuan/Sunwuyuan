import Link from "next/link"
import { ArticleCover } from "@/components/article-cover"
import type { Article } from "@/lib/articles"

function formatDateZh(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function BlogPostCell({ article }: { article: Article }) {
  return (
    <li>
      <Link
        href={article.url}
        className="group flex h-full flex-col text-inherit no-underline transition-colors duration-200 hover:bg-muted/60"
      >
        <ArticleCover
          slug={article.slug}
          cover={article.cover}
          hascover={article.hascover}
          className="transition-[filter] duration-300 group-hover:brightness-[0.92]"
        />

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h2 className="text-[17px] font-medium leading-snug tracking-tight text-foreground transition-colors duration-200">
            {article.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70">
            {article.description || article.preview}
          </p>

          <div className="mt-auto flex items-center gap-2.5 pt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/avatar.png"
              alt=""
              className="size-5 rounded-full object-cover ring-1 ring-border transition-[box-shadow] duration-200 group-hover:ring-foreground/25"
            />
            {article.date ? (
              <time
                dateTime={article.date}
                className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70"
              >
                {formatDateZh(article.date)}
              </time>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  )
}
