import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { listArticles } from "@/lib/articles"
import { cn } from "@/lib/utils"
import "./globals.css"

config.autoAddCss = false

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "孙悟元",
  description: "个人主页与博客",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const articles = listArticles()

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const d=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader articles={articles} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
