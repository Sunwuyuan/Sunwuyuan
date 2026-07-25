import { cn } from "@/lib/utils"

/** 内容区最大宽度：列表/文章/关于/友链共用，左右竖线永远对齐 */
export const BLOG_MAX = "max-w-[1080px]"

/** 标题区统一内边距 */
export const BLOG_HERO_PAD =
  "relative px-4 pt-14 pb-10 sm:px-12 sm:pt-16 sm:pb-12"

/**
 * 整页线框：
 * - 仅底横线全宽（顶横线去掉，由标题区网格渐隐衔接）
 * - 左右竖线单层贯通，顶部渐隐（避免分段 border-x 错位）
 * - 分段横线全宽，与竖线相交
 */
export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[min(100%-2rem,1080px)] -translate-x-1/2 border-x border-border [mask-image:linear-gradient(to_bottom,transparent,black_4.5rem)]"
      />
      <div className="relative z-0 px-4">
        <div className={cn("mx-auto", BLOG_MAX)}>{children}</div>
      </div>
    </div>
  )
}

/** 壳内分段：底部分隔横线全宽贯穿 */
export function BlogSection({
  children,
  className,
  hero = false,
}: {
  children: React.ReactNode
  className?: string
  /** 标题区：带网格底纹 */
  hero?: boolean
}) {
  return (
    <section className={cn("group/section relative", className)}>
      {hero ? <BlogHeroDecor /> : null}
      {children}
      {/* 全宽横线；末段与外壳底边重合，隐藏避免双线 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-px w-screen -translate-x-1/2 bg-border group-last/section:hidden"
      />
    </section>
  )
}

/** 标题区网格底纹：顶/两侧渐隐；格子画底边+左边，避免最顶横线（左右外壳竖线由 BlogShell 提供） */
export function BlogHeroDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden text-border"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent), linear-gradient(to bottom, transparent, black 45%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent), linear-gradient(to bottom, transparent, black 45%)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <svg className="absolute inset-0 size-full opacity-60" aria-hidden>
        <defs>
          <pattern
            id="blog-hero-grid-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* 底边 + 左边：不在 y=0 画横线，去掉标题区最顶硬边 */}
            <path
              d="M 60 60 H 0 V 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blog-hero-grid-pattern)" />
      </svg>
    </div>
  )
}
