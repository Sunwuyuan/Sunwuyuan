"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/** 列表与内页共用，保证尺寸一致 */
export const COVER_ASPECT = "aspect-[1200/630]"

function isSvgCover(src: string) {
  return /\.svg($|\?)/i.test(src)
}

/**
 * 冷淡色相：锁在青灰–蓝灰区间，饱和度低，列表/内页占位一致。
 */
export function coverHue(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  // 205–235：偏冷蓝灰，避免暖紫与高饱和
  const h1 = 205 + (hash % 30)
  const h2 = 215 + ((hash >>> 8) % 22)
  const h3 = 200 + ((hash >>> 16) % 28)
  return { h1, h2, h3 }
}

function CoverPlaceholder({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { h1, h2, h3 } = coverHue(slug)
  return (
    <div
      aria-hidden
      className={cn("article-cover-placeholder w-full", COVER_ASPECT, className)}
      style={
        {
          "--cover-h1": h1,
          "--cover-h2": h2,
          "--cover-h3": h3,
        } as React.CSSProperties
      }
    />
  )
}

export function ArticleCover({
  slug,
  cover,
  hascover,
  className,
  imgClassName,
}: {
  slug: string
  cover: string
  hascover: boolean
  className?: string
  imgClassName?: string
}) {
  const [failed, setFailed] = useState(false)
  // SVG / 缺封面：用渐变占位，避免空图或 logo 被拉成头图
  const showImage =
    hascover && Boolean(cover) && !failed && !isSvgCover(cover)

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover}
        alt=""
        onError={() => setFailed(true)}
        className={cn(
          "w-full object-cover",
          COVER_ASPECT,
          imgClassName,
          className
        )}
      />
    )
  }

  return <CoverPlaceholder slug={slug} className={className} />
}
