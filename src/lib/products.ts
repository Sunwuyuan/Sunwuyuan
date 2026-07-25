export type Product = {
  id: string
  title: string
  description: string
  /** 展开态更长说明 */
  detail: string
  href: string
  /** 可选背景图；未提供时展开态使用灰色底 */
  image?: string
  /**
   * 有背景图时的文字色。默认 light（白字，适合深色图）。
   * 浅色图请设为 dark（深字 + 浅色遮罩）。
   */
  imageText?: "light" | "dark"
  /** 展开态右上角淡色光晕，任意 CSS 颜色，如 #7c6cff */
  tint?: string
  badge?: string
  cta?: string
}

export const products: Product[] = [
  {
    id: "zakura",
    title: "Zakura",
    description: "协同提升Agent的智能。",
    detail: "协同提升Agent的智能。",
    href: "https://preview.moonrend.com",
    tint: "#9b7de8",
    badge: "Agent",
    cta: "访问 Zakura",
    image: "/media/products/zakura-1.png",
  },
  {
    id: "zerocat",
    title: "零猫社区",
    description: "Scratch 作品发布 / 编程社区",
    detail:
      "面向 Scratch 创作者的开源社区。发布作品、交流想法，一起把创意做出来。",
    href: "https://zerocat.dev",
    tint: "#5bb98c",
    badge: "社区",
    cta: "访问 zerocat.dev",
  },
  {
    id: "classworks",
    title: "Classworks 作业板",
    description: "适用于班级大屏的作业板",
    detail:
      "为大屏场景设计的作业展示板，清晰可读，方便课堂与班级日常使用。",
    href: "https://cs.houlang.cloud",
    tint: "#6a9fd8",
    badge: "教育",
    cta: "打开作业板",
  },
  {
    id: "openin",
    title: "OpenIn",
    description: "跳转到开发平台对应仓库的浏览器扩展",
    detail:
      "在网页上一键跳转到对应代码仓库，减少在浏览器与 IDE 之间来回找链接的时间。",
    href: "https://microsoftedge.microsoft.com/addons/detail/openin/jalceldnjenbnhdbljiglhkjklonfein",
    tint: "#d4a15a",
    badge: "扩展",
    cta: "获取扩展",
  },
  {
    id: "kernyr",
    title: "Kernyr",
    description: "论坛",
    detail: "轻量论坛，用来讨论、沉淀与协作。",
    href: "https://kernyr.wuyuan.dev",
    tint: "#c47a6a",
    badge: "论坛",
    cta: "进入论坛",
  },
  {
    id: "domain",
    title: "子域名部署",
    description: "申请子域名、配置 DNS，由 Cloudflare 驱动",
    detail:
      "申请子域名、配置 DNS，让项目几秒内上线。由 Cloudflare 驱动。",
    href: "https://domain.houlang.cloud",
    image: "/media/hlym.png",
    tint: "#5b9fd4",
    badge: "基础设施",
    cta: "开始使用",
  },
  {
    id: "zerocat-blog",
    title: "ZeroCat Blog",
    description: "博客社区",
    detail: "写作与阅读的博客社区，和零猫生态一起生长。",
    href: "https://blog.zerocat.dev/",
    tint: "#8a8a8a",
    badge: "博客",
    cta: "阅读博客",
  },
]
