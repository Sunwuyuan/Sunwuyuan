import Link from "next/link"
import type { Article } from "@/lib/articles"
import { FuzzyTime } from "@/components/fuzzy-time"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ArticleCard({
  article,
  showCover = true,
}: {
  article: Article
  showCover?: boolean
}) {
  return (
    <Link href={article.url} className="group block h-full text-inherit no-underline">
      <Card
        size="sm"
        className="h-full transition-all duration-200 hover:bg-muted/40 hover:shadow-md hover:ring-foreground/15"
      >
        {showCover && article.hascover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt=""
            className="aspect-[40/21] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
        <CardHeader className="flex-1">
          <CardTitle className="text-base tracking-tight transition-colors group-hover:text-foreground md:text-lg">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {article.description || article.preview}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between border-0 bg-transparent text-[11px] font-mono tracking-wide text-muted-foreground">
          <span>
            {article.date && <FuzzyTime date={article.date} />}
            {article.readingTime ? ` · ${article.readingTime} 分钟` : null}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
