"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, Search } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SearchDialog } from "@/components/search-dialog"
import { BrandMark } from "@/components/brand-mark"
import type { Article } from "@/lib/articles"

const links = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/feed" },
  { label: "关于", href: "/about" },
  { label: "友链", href: "/friends" },
]

export function SiteHeader({ articles }: { articles: Article[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 backdrop-blur-[20px]",
          scrolled ? "bg-background/70" : "bg-transparent"
        )}
      >
        <div className="container-site flex h-16 items-center gap-6">
          <Link href="/" className="group inline-flex items-center gap-2.5 text-sm font-medium">
            <BrandMark interactive />
            孙悟元
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="搜索"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
            <a
              href="https://x.com/wuyuandev"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden rounded-full md:inline-flex"
              )}
            >
              twitter
            </a>

            <Sheet>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "md:hidden"
                )}
                aria-label="菜单"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>孙悟元</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-1">
                  {links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        articles={articles}
      />
    </>
  )
}
