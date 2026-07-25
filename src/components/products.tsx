"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react"
import { products, type Product } from "@/lib/products"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SHOWCASE_IDS = ["zakura", "zerocat", "classworks", "openin", "kernyr"] as const

export function Products() {
  const items = products.filter((p) =>
    (SHOWCASE_IDS as readonly string[]).includes(p.id)
  )
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 2)
    setCanNext(el.scrollLeft < max - 2)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    // 展开后宽度变化，刷新按钮可用态
    const id = requestAnimationFrame(updateScrollState)
    return () => cancelAnimationFrame(id)
  }, [activeId])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const step = Math.min(el.clientWidth * 0.72, 420)
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  const select = (id: string, card: HTMLElement | null) => {
    setActiveId(id)
    const scroller = scrollerRef.current
    if (!scroller || !card) return
    const left =
      card.offsetLeft -
      Math.max(0, (scroller.clientWidth - card.offsetWidth) * 0.2)
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }

  return (
    <section id="products" className="py-[clamp(6rem,12vw,8rem)]">
      <div className="container-site">
        <header className="mb-10">
          <h2 className="heading-lg">产品</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">在做什么</p>
        </header>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="products-scroller flex h-[320px] gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-6 sm:h-[360px] sm:gap-3.5 md:h-[400px] md:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] md:pr-6"
          role="list"
        >
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              active={item.id === activeId}
              onSelect={(el) => select(item.id, el)}
            />
          ))}
          {/* 右侧留白，让最后一张也能滚出一点呼吸感 */}
          <div className="w-2 shrink-0 sm:w-6" aria-hidden />
        </div>

        <div className="container-site mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="向左滚动"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
          >
            <ArrowLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="向右滚动"
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  active,
  onSelect,
}: {
  product: Product
  active: boolean
  onSelect: (el: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const hasImage = Boolean(product.image)
  const onMedia = active && hasImage
  // 有图时默认白字；浅色图可配 imageText: "dark"
  const lightText = onMedia && product.imageText !== "dark"

  return (
    <article
      ref={ref}
      role="listitem"
      tabIndex={0}
      aria-expanded={active}
      aria-label={product.title}
      onClick={() => onSelect(ref.current)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(ref.current)
        }
      }}
      className={cn(
        "group relative flex h-full shrink-0 flex-col overflow-hidden rounded-2xl outline-none transition-[width,min-width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "w-[min(36rem,82vw)] min-w-[20rem] ring-1 ring-foreground/10 sm:min-w-[28rem]"
          : "w-[16.5rem] min-w-[16.5rem] cursor-pointer bg-card shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.14)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] sm:w-[18rem] sm:min-w-[18rem]",
        active && !hasImage && "bg-[#e8e8e8] dark:bg-[#1a1a1a]"
      )}
    >
      {/* 有图：展开态显示背景图 */}
      {hasImage ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={!active}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-out",
              active ? "scale-100" : "scale-105"
            )}
          />
          <div
            className={cn(
              "absolute inset-0",
              product.imageText === "dark"
                ? "bg-gradient-to-t from-white/88 via-white/45 to-white/10"
                : "bg-gradient-to-t from-black/80 via-black/35 to-black/10"
            )}
          />
          {product.tint ? (
            <div
              className="absolute inset-0 opacity-40 mix-blend-soft-light dark:opacity-35 dark:mix-blend-screen"
              style={{
                background: `radial-gradient(110% 80% at 100% 0%, ${product.tint}, transparent 58%)`,
              }}
            />
          ) : null}
        </div>
      ) : (
        /* 无图：展开态用柔和灰底 + 色调光晕 */
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={!active}
        >
          <div className="absolute inset-0 bg-[#e8e8e8] dark:bg-[#1a1a1a]" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(0,0,0,0.05),transparent_52%)] dark:bg-[radial-gradient(90%_70%_at_0%_100%,rgba(0,0,0,0.4),transparent_52%)]" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 85% at 100% 0%, color-mix(in srgb, ${product.tint ?? "#ffffff"} 28%, transparent), transparent 58%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.55] dark:opacity-30"
            style={{
              background: `radial-gradient(100% 70% at 100% 0%, color-mix(in srgb, ${product.tint ?? "#ffffff"} 18%, white), transparent 52%)`,
            }}
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-3 p-4 sm:p-5 md:p-6">
        {product.badge ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors duration-300",
              lightText
                ? "bg-white/15 text-white backdrop-blur-sm"
                : "bg-black/[0.05] text-muted-foreground dark:bg-white/10"
            )}
          >
            {product.badge}
          </span>
        ) : (
          <span />
        )}
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            lightText
              ? "rotate-45 bg-white/15 text-white"
              : active
                ? "rotate-45 bg-black/[0.06] text-foreground/70 dark:bg-white/10"
                : "bg-foreground/5 text-foreground/70 group-hover:bg-foreground/10"
          )}
          aria-hidden
        >
          <Plus className="size-4" />
        </span>
      </div>

      <div className="relative z-10 mt-auto flex min-w-0 flex-col gap-3 p-4 sm:p-5 md:p-6">
        <div className="min-w-0">
          <h3
            className={cn(
              "truncate text-[20px] font-[450] leading-tight tracking-[-0.04em] transition-colors duration-300 sm:text-[24px]",
              lightText ? "text-white" : "text-foreground"
            )}
          >
            {product.title}
          </h3>
          <p
            className={cn(
              "mt-1.5 line-clamp-2 text-[13px] leading-relaxed transition-colors duration-300 sm:text-[14px]",
              lightText ? "text-white/75" : "text-muted-foreground"
            )}
          >
            {product.description}
          </p>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            active
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={cn(
                "max-w-[34em] text-[14px] leading-relaxed",
                lightText ? "text-white/85" : "text-muted-foreground"
              )}
            >
              {product.detail}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  lightText && "bg-white text-neutral-900 hover:bg-white/90"
                )}
              >
                {product.cta ?? "打开"}
                <ArrowUpRight data-icon="inline-end" className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
