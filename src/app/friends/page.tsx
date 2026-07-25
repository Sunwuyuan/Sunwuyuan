"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import {
  BLOG_HERO_PAD,
  BlogSection,
  BlogShell,
} from "@/components/blog-frame"
import { Comment } from "@/components/comment"
import { friends as friendsSource, myFriendInfo } from "@/lib/friends"
import { cn } from "@/lib/utils"

function shuffle<T>(list: T[]) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export default function FriendsPage() {
  const [friends, setFriends] = useState(friendsSource)
  const myInfoList = useMemo(
    () => [
      { label: "名称", value: myFriendInfo.name },
      { label: "描述", value: myFriendInfo.desc },
      { label: "地址", value: myFriendInfo.url },
      { label: "头像", value: myFriendInfo.avatar },
      { label: "订阅", value: myFriendInfo.rss },
    ],
    []
  )

  useEffect(() => {
    setFriends(shuffle(friendsSource))
  }, [])

  return (
    <BlogShell>
      <BlogSection hero>
        <div className={BLOG_HERO_PAD}>
          <h1 className="heading-lg">友链</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            一些朋友与站点
          </p>
        </div>
      </BlogSection>

      <BlogSection>
        <ul
          className={cn(
            "grid grid-cols-1 md:grid-cols-3",
            "[&>*]:border-border",
            "max-md:[&>*:not(:last-child)]:border-b",
            "md:[&>*:not(:nth-child(3n))]:border-r",
            "md:[&>*:nth-child(n+4)]:border-t"
          )}
        >
          {friends.map((friend) => (
            <li key={friend.name}>
              <a
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full items-start gap-4 overflow-hidden p-6 text-inherit no-underline transition-colors duration-200 hover:bg-muted/60 sm:p-8"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-foreground/20 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={friend.avatar}
                  alt=""
                  className="size-11 shrink-0 rounded-full bg-muted object-cover ring-1 ring-border transition-transform duration-300 ease-out group-hover:scale-110 group-hover:ring-foreground/25"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[15px] font-medium tracking-tight transition-colors group-hover:text-foreground">
                      {friend.name}
                    </div>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70">
                    {friend.desc}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </BlogSection>

      <BlogSection>
        <div className="px-4 py-10 sm:px-12 sm:py-14">
          <h2 className="text-lg font-medium tracking-tight">申请</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">
            友链手动添加，想加入可在下方留言。
          </p>

          <dl className="max-w-[680px] divide-y divide-border border border-border text-sm">
            {myInfoList.map((item) => (
              <div
                key={item.label}
                className="flex gap-4 px-4 py-3 break-all sm:px-5"
              >
                <dt className="w-12 shrink-0 text-muted-foreground">
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 max-w-[680px] list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>我已添加对方的友情链接。</li>
            <li>站点可在中国大陆正常访问。</li>
            <li>内容符合中国大陆法律法规。</li>
          </ul>
        </div>
      </BlogSection>

      <BlogSection>
        <div className="px-4 py-10 sm:px-12 sm:py-14">
          <h2 className="mb-6 text-lg font-medium tracking-tight">评论</h2>
          <div className="max-w-[680px]">
            <Comment />
          </div>
        </div>
      </BlogSection>
    </BlogShell>
  )
}
