import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DomainSpotlight() {
  return (
    <section className="py-[clamp(6rem,12vw,8rem)]">
      <div className="container-site grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="heading-lg">
            你的子域名
            <br />
            即刻部署
          </h2>
          <p className="mt-5 max-w-[28em] text-base text-muted-foreground">
            申请子域名、配置 DNS，让项目几秒内上线。由 Cloudflare 驱动。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://domain.houlang.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              开始使用
            </a>
            <Link
              href="/articles/houlang"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              了解更多
            </Link>
          </div>
        </div>

        <Card className="min-h-[280px] overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md lg:min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/hlym.png"
            alt="子域名部署"
            className="h-full min-h-[280px] w-full object-cover object-left transition-transform duration-500 hover:scale-[1.02] lg:min-h-[420px]"
          />
        </Card>
      </div>
    </section>
  )
}
