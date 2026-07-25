import Link from "next/link"
import { getArticlesByTagCount, getTags } from "@/lib/tag-utils"

export default function TagsPage() {
  const tags = getTags().map((tag) => ({
    name: tag,
    count: getArticlesByTagCount(tag),
  }))

  return (
    <section className="py-[clamp(4rem,8vw,6rem)]">
      <div className="container-site">
        <h1 className="heading-lg mb-10">标签</h1>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="surface inline-flex gap-2 px-3 py-2 text-sm"
            >
              {tag.name}
              <span className="text-[var(--stone)]">{tag.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
