import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import { marked } from "marked"
import {
  BLOG_HERO_PAD,
  BlogSection,
  BlogShell,
} from "@/components/blog-frame"
import { Comment } from "@/components/comment"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "关于",
  description:
    "关于孙悟元：来自中国的高二学生，独立开发者。正在做零猫社区、Classworks、OpenIn、Kernyr。",
  path: "/about",
})

export default function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "README.md"), "utf8")
  const html = marked.parse(raw, { async: false }) as string

  return (
    <BlogShell>
      <BlogSection hero>
        <div className={BLOG_HERO_PAD}>
          <h1 className="heading-lg">关于</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            关于我与正在做的事
          </p>
        </div>
      </BlogSection>

      <BlogSection>
        <article
          className="max-w-[680px] space-y-4 px-4 py-10 text-base leading-7 sm:px-12 sm:py-14 [&_a]:text-[var(--terminal-green)] [&_h1]:text-[clamp(1.6rem,3.5vw,2rem)] [&_h1]:font-[450] [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-[450] [&_img]:max-w-full [&_img]:rounded-md"
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
