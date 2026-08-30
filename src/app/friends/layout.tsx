import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "友链",
  description: "孙悟元的友情链接。一些朋友与站点。",
  path: "/friends",
})

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
