"use client"

import { useState } from "react"
import { contacts } from "@/lib/contacts"
import { ContactIcon } from "@/components/contact-icon"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function Contacts() {
  const [qr, setQr] = useState<string | null>(null)

  return (
    <section className="py-[clamp(6rem,12vw,8rem)]">
      <div className="container-site">
        <h2 className="heading-lg mb-10">联系</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {contacts.map((item) => (
            <button
              key={item.label}
              type="button"
              className="group block h-full w-full text-left"
              onClick={() => {
                if (item.qrCode) setQr(item.qrCode)
                else if (item.href) window.open(item.href, "_blank", "noopener,noreferrer")
              }}
            >
              <Card
                size="sm"
                className="h-full transition-all duration-200 hover:bg-muted/40 hover:shadow-md hover:ring-foreground/15"
              >
                <CardHeader>
                  <ContactIcon
                    icon={item.icon}
                    className="mb-1 size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                  />
                  <CardTitle className="text-sm">{item.label}</CardTitle>
                  <CardDescription className="truncate text-xs">
                    {item.handle}
                  </CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </div>

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
    </section>
  )
}
