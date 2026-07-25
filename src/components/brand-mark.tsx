"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function BrandMark({
  className,
  interactive = false,
}: {
  className?: string
  interactive?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!interactive) return

    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / Math.max(window.innerWidth, 1)
      const dy = (e.clientY - cy) / Math.max(window.innerHeight, 1)
      setOffset({ x: dx * 5, y: dy * 5 })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [interactive])

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        "inline-block size-3.5 shrink-0 rounded-full bg-[#3b82f6]",
        className
      )}
      style={
        interactive
          ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
          : undefined
      }
    />
  )
}
