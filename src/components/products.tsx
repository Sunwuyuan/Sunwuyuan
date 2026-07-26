"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react"
import { products, type Product } from "@/lib/products"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SHOWCASE_IDS = ["zakura", "zerocat", "classworks", "openin", "kernyr"] as const

/** 确认横向拖拽的阈值；未超过则视为点击 */
const DRAG_SLOP_PX = 14

export function Products() {
  const items = products.filter((p) =>
    (SHOWCASE_IDS as readonly string[]).includes(p.id)
  )
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [dragging, setDragging] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const suppressClickRef = useRef(false)

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
    const id = requestAnimationFrame(updateScrollState)
    return () => cancelAnimationFrame(id)
  }, [activeId])

  // 鼠标拖拽横向滚动：超过阈值后才 capture，避免吞掉点击
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let pointerId: number | null = null
    let startX = 0
    let startScroll = 0
    let draggingScroll = false

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if (e.pointerType === "touch") return
      if ((e.target as HTMLElement).closest("a, button")) return
      pointerId = e.pointerId
      startX = e.clientX
      startScroll = el.scrollLeft
      draggingScroll = false
    }

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      const dx = e.clientX - startX
      if (!draggingScroll) {
        if (Math.abs(dx) < DRAG_SLOP_PX) return
        draggingScroll = true
        setDragging(true)
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      }
      el.scrollLeft = startScroll - dx
    }

    const end = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      pointerId = null
      if (draggingScroll) {
        suppressClickRef.current = true
        setDragging(false)
      }
      draggingScroll = false
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
    }

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", end)
    el.addEventListener("pointercancel", end)
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", end)
      el.removeEventListener("pointercancel", end)
    }
  }, [])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const step = Math.min(el.clientWidth * 0.72, 420)
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  /** 按最终折叠宽度推算目标滚动，与宽度动画同步，避免中途校正弹跳 */
  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller || index < 0) return
    const sm = window.matchMedia("(min-width: 640px)").matches
    const collapsed = (sm ? 18 : 16.5) * 16
    const gap = sm ? 14 : 12
    const target = index * (collapsed + gap)
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    scroller.scrollTo({
      left: Math.max(0, Math.min(target, max)),
      behavior: "smooth",
    })
  }

  const select = (id: string) => {
    const index = items.findIndex((item) => item.id === id)
    setActiveId(id)
    scrollToIndex(index)
  }

  const collapse = () => {
    setActiveId("")
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
          role="list"
          onClickCapture={(e) => {
            if (!suppressClickRef.current) return
            e.preventDefault()
            e.stopPropagation()
            suppressClickRef.current = false
          }}
          className={cn(
            "products-scroller touch-pan-x select-none overflow-x-auto overscroll-x-contain px-6 py-3 md:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] md:pr-6",
            dragging ? "cursor-grabbing" : "cursor-grab scroll-smooth"
          )}
        >
          <div className="flex h-[320px] gap-3 sm:h-[360px] sm:gap-3.5 md:h-[400px]">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                active={item.id === activeId}
                onSelect={() => select(item.id)}
                onCollapse={collapse}
              />
            ))}
            <div className="w-2 shrink-0 sm:w-6" aria-hidden />
          </div>
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
  onCollapse,
}: {
  product: Product
  active: boolean
  onSelect: () => void
  onCollapse: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const glowRaf = useRef(0)
  const hasImage = Boolean(product.image)
  const onMedia = active && hasImage
  const lightText = onMedia && product.imageText !== "dark"
  const tint = product.tint ?? "#a8a8a8"
  const showGlow = !hasImage

  useEffect(() => {
    return () => cancelAnimationFrame(glowRaf.current)
  }, [])

  const activate = () => {
    if (active) return
    onSelect()
  }

  /** 右上角固定光晕：鼠标移动时只做极轻微的浓度与位移反应 */
  const reactGlow = (clientX: number, clientY: number) => {
    if (!showGlow) return
    const card = ref.current
    const glow = glowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const nx = (clientX - rect.left) / rect.width - 0.5
    const ny = (clientY - rect.top) / rect.height - 0.5
    const x = 88 + nx * 6
    const y = 12 + ny * 4
    const strength = (active ? 28 : 22) + Math.abs(nx) * 6 + Math.abs(ny) * 4
    cancelAnimationFrame(glowRaf.current)
    glowRaf.current = requestAnimationFrame(() => {
      glow.style.setProperty("--glow-x", `${x}%`)
      glow.style.setProperty("--glow-y", `${y}%`)
      glow.style.setProperty("--glow-a", `${Math.round(strength)}%`)
    })
  }

  const resetGlow = () => {
    if (!showGlow) return
    cancelAnimationFrame(glowRaf.current)
    const glow = glowRef.current
    if (!glow) return
    glow.style.setProperty("--glow-x", "88%")
    glow.style.setProperty("--glow-y", "12%")
    glow.style.setProperty("--glow-a", active ? "28%" : "22%")
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return
    if (active) {
      onCollapse()
      return
    }
    activate()
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (active) {
      onCollapse()
      return
    }
    activate()
  }

  return (
    <article
      ref={ref}
      data-product-id={product.id}
      role="listitem"
      tabIndex={0}
      aria-expanded={active}
      aria-label={product.title}
      onPointerMove={(e) => {
        if (!showGlow) return
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
        reactGlow(e.clientX, e.clientY)
      }}
      onPointerLeave={showGlow ? resetGlow : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (active) onCollapse()
          else activate()
        } else if (e.key === "Escape" && active) {
          onCollapse()
        }
      }}
      className={cn(
        "group relative isolate flex h-full shrink-0 flex-col overflow-hidden rounded-2xl bg-card outline-none select-none transition-[width,min-width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "ring-1 ring-foreground/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.06)]",
        "dark:ring-white/[0.08] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_-8px_rgba(0,0,0,0.55)]",
        "focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "w-[min(36rem,82vw)] min-w-[20rem] cursor-default ring-foreground/[0.12] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.1)] sm:min-w-[28rem] dark:ring-white/[0.12] dark:shadow-[0_2px_4px_rgba(0,0,0,0.35),0_16px_40px_-10px_rgba(0,0,0,0.65)]"
          : "w-[16.5rem] min-w-[16.5rem] sm:w-[18rem] sm:min-w-[18rem] [@media(hover:hover)_and_(pointer:fine)]:hover:ring-foreground/[0.14] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_14px_36px_-10px_rgba(0,0,0,0.12)] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:ring-white/[0.14] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_18px_44px_-12px_rgba(0,0,0,0.7)]",
        active && !hasImage && "bg-[#e8e8e8] dark:bg-[#1a1a1a]"
      )}
    >
      {showGlow ? (
        <div
          ref={glowRef}
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300",
            active
              ? "opacity-80 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
              : "opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
          )}
          aria-hidden
          style={
            {
              "--glow-x": "88%",
              "--glow-y": "12%",
              "--glow-a": active ? "28%" : "22%",
              background: `radial-gradient(125% 95% at var(--glow-x) var(--glow-y), color-mix(in srgb, ${tint} var(--glow-a), transparent), transparent 62%)`,
              transition: "opacity 300ms ease",
            } as React.CSSProperties
          }
        />
      ) : null}
      {hasImage ? (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-500",
              active ? "opacity-0" : "opacity-100"
            )}
            aria-hidden={active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt=""
              draggable={false}
              className="h-full w-full scale-125 object-cover blur-[48px] saturate-[1.15]"
            />
            <div className="absolute inset-0 bg-card/45 dark:bg-card/55" />
          </div>

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
              draggable={false}
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
          </div>
        </>
      ) : (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={!active}
        >
          <div className="absolute inset-0 bg-[#e8e8e8] dark:bg-[#1a1a1a]" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_100%,rgba(0,0,0,0.05),transparent_52%)] dark:bg-[radial-gradient(90%_70%_at_0%_100%,rgba(0,0,0,0.4),transparent_52%)]" />
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

        <button
          type="button"
          aria-label={active ? `收起 ${product.title}` : `展开 ${product.title}`}
          onClick={handleToggleClick}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "relative z-20 flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-full outline-none transition-[background-color,color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            lightText
              ? "bg-white/15 text-white ring-1 ring-white/20 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/28 [@media(hover:hover)_and_(pointer:fine)]:hover:ring-white/35 active:bg-white/35"
              : active
                ? "bg-black/[0.05] text-foreground/70 ring-1 ring-foreground/8 dark:bg-white/10 dark:ring-white/10 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.1] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/16 active:bg-black/[0.14] dark:active:bg-white/20"
                : "bg-foreground/[0.04] text-foreground/70 ring-1 ring-foreground/6 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[0.08] [@media(hover:hover)_and_(pointer:fine)]:hover:ring-foreground/12 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-foreground/[0.08] active:bg-foreground/12"
          )}
        >
          <Plus
            className={cn(
              "size-4 transition-transform duration-300 ease-out",
              active && "rotate-45"
            )}
            aria-hidden
          />
        </button>
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
                onPointerDown={(e) => e.stopPropagation()}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "touch-manipulation select-none",
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
