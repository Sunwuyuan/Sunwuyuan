import { contacts } from "@/lib/contacts"

export const site = {
  name: "孙悟元",
  url: "https://wuyuan.dev",
  locale: "zh_CN",
  language: "zh-CN",
  description:
    "今年欢笑复明年，秋月春风等闲度。孙悟元的个人主页、产品与博客。",
  tagline: "今年欢笑复明年，秋月春风等闲度。",
  twitter: "@wuyuandev",
  email: "sun@wuyuan.dev",
  ogImage: "/covers/default.png",
  avatar: "/media/avatar.png",
  keywords: [
    "孙悟元",
    "wuyuan",
    "独立开发",
    "博客",
    "零猫",
    "ZeroCat",
  ],
  sameAs: contacts
    .map((item) => item.href)
    .filter((href) => href.startsWith("http")),
} as const
