"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Article } from "@/lib/articles"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  articles: Article[]
}

export function SearchDialog({ open, onOpenChange, articles }: Props) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles.slice(0, 8)
    return articles
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 10)
  }, [articles, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>搜索文章</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="输入标题、标签…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-72 space-y-1 overflow-auto">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="block rounded-md px-3 py-2 hover:bg-muted"
              onClick={() => onOpenChange(false)}
            >
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {item.description}
              </div>
            </Link>
          ))}
          {!results.length && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              没有结果
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
