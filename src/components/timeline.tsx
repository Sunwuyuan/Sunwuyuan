"use client"

import { useEffect, useState } from "react"
import { FuzzyTime } from "@/components/fuzzy-time"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Post = {
  id: number
  content?: string
  created_at?: string
  author: {
    avatar?: boolean
    avatarURL?: string
    display_name?: string
    username?: string
  }
  media?: Array<{
    id: number
    url: string
    mime_type?: string
  }>
}

export function Timeline({ userId = 1 }: { userId?: number }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(
          `https://api.zcservice.houlang.cloud/posts/user/${userId}`
        )
        if (!res.ok) throw new Error("获取帖子失败")
        const result = await res.json()
        if (!cancelled) setPosts(result?.data?.posts || [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  if (loading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">加载中…</p>
    )
  }

  if (error) {
    return (
      <p className="py-16 text-center text-sm text-destructive">{error}</p>
    )
  }

  if (!posts.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">暂无动态</p>
    )
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const name = post.author.display_name || post.author.username || "用户"
  const initial = name.slice(0, 1).toUpperCase()
  const mediaCount = post.media?.length ?? 0
  const href = `https://zerocat.dev/app/posts/${post.id}`

  return (
    <article className="mb-4 break-inside-avoid">
      <Card
        size="sm"
        className="relative transition-all duration-200 hover:bg-muted/40 hover:shadow-md hover:ring-foreground/15"
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-[inherit] text-inherit no-underline"
          aria-label={`查看动态：${name}`}
        />

        <CardHeader className="relative z-10 pointer-events-none pb-0">
          <div className="flex items-start gap-3">
            <div className="size-10 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-foreground/5">
              {post.author.avatarURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatarURL}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm font-medium text-muted-foreground">
                  {initial}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="truncate text-sm font-medium leading-tight">
                {name}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px] text-muted-foreground">
                {post.author.username ? (
                  <span className="truncate">@{post.author.username}</span>
                ) : null}
                {post.created_at ? (
                  <span className="shrink-0 text-[var(--stone)]">
                    · <FuzzyTime date={post.created_at} />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-col gap-3 pt-3">
          {post.content ? (
            <p className="pointer-events-none whitespace-pre-wrap break-words text-[15px] leading-6 text-foreground/90">
              {post.content}
            </p>
          ) : null}

          {mediaCount > 0 ? (
            <div
              className={cn(
                "relative z-10 overflow-hidden rounded-xl ring-1 ring-foreground/8",
                mediaCount > 1 && "grid grid-cols-2 gap-0.5"
              )}
            >
              {post.media!.map((media) =>
                media.mime_type?.startsWith("video") ? (
                  <video
                    key={media.id}
                    src={media.url}
                    controls
                    className={cn(
                      "w-full bg-muted object-cover",
                      mediaCount === 1 ? "max-h-72" : "aspect-square max-h-44"
                    )}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={media.id}
                    src={media.url}
                    alt=""
                    className={cn(
                      "pointer-events-none w-full bg-muted object-cover",
                      mediaCount === 1 ? "max-h-72" : "aspect-square max-h-44"
                    )}
                  />
                )
              )}
            </div>
          ) : null}
        </CardContent>

        {/*<CardFooter className="relative z-10 pointer-events-none justify-between border-0 bg-transparent pt-0 text-[11px] font-mono tracking-wide text-muted-foreground">
          <span>查看原帖</span>
        </CardFooter>*/}
      </Card>
    </article>
  )
}
