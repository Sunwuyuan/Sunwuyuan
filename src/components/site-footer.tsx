"use client"

import Link from "next/link"
import { useState } from "react"
import { contacts } from "@/lib/contacts"
import { ContactIcon } from "@/components/contact-icon"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"

export function SiteFooter() {
  const [qr, setQr] = useState<string | null>(null)
  const year = new Date().getFullYear()

  return (
    <>
      <footer className="mt-auto border-t border-border py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 text-sm font-medium">
              <BrandMark />
              孙悟元
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/">首页</Link>
              <Link href="/feed">文章</Link>
              <Link href="/about">关于</Link>
              <Link href="/friends">友链</Link>
            </nav>
          </div>

          <div className="mt-7 flex flex-wrap gap-1">
            {contacts.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="icon-sm"
                aria-label={item.label}
                onClick={() => {
                  if (item.qrCode) setQr(item.qrCode)
                  else if (item.href) window.open(item.href, "_blank", "noopener,noreferrer")
                }}
              >
                <ContactIcon icon={item.icon} />
              </Button>
            ))}
          </div>

          <p className="mt-7 font-mono text-[11px] tracking-wide text-[var(--smoke)]">
            © 2020–{year} Sunwuyuan
          </p>
        </div>
      </footer>

      <Dialog open={Boolean(qr)} onOpenChange={(open) => !open && setQr(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>微信公众号</DialogTitle>
          </DialogHeader>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="微信公众号二维码" className="w-full rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
