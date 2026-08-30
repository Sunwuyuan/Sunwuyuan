import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { JsonLd } from "@/components/json-ld"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { listArticles } from "@/lib/articles"
import { pageMetadata, siteJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const home = pageMetadata({
  title: site.name,
  description: site.description,
  path: "/",
  absoluteTitle: true,
})

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  keywords: [...site.keywords],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        <JsonLd data={siteJsonLd()} />
        <SiteHeader articles={articles} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
