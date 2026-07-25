export type Contact = {
  label: string
  handle: string
  href: string
  icon: "github" | "bilibili" | "zhihu" | "x" | "mail" | "telegram" | "wechat" | "heart"
  qrCode?: string
}

export const contacts: Contact[] = [
  {
    label: "GitHub",
    handle: "@Sunwuyuan",
    href: "https://github.com/Sunwuyuan",
    icon: "github",
  },
  {
    label: "Bilibili",
    handle: "悟元喵",
    href: "https://space.bilibili.com/661404066",
    icon: "bilibili",
  },
  {
    label: "知乎",
    handle: "@sunwuyuan",
    href: "https://www.zhihu.com/people/sunwuyuan",
    icon: "zhihu",
  },
  {
    label: "Twitter / X",
    handle: "@wuyuandev",
    href: "https://x.com/wuyuandev",
    icon: "x",
  },
  {
    label: "邮箱",
    handle: "sun@wuyuan.dev",
    href: "mailto:sun@wuyuan.dev",
    icon: "mail",
  },
  {
    label: "Telegram",
    handle: "@wuyuandev",
    href: "https://t.me/wuyuandev",
    icon: "telegram",
  },
  {
    label: "微信公众号",
    handle: "孙悟元",
    href: "",
    icon: "wechat",
    qrCode: "/media/wxqrcode.jpg",
  },
  {
    label: "爱发电",
    handle: "孙悟元",
    href: "https://ifdian.net/a/wydev",
    icon: "heart",
  },
]
