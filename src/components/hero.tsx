import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center py-12 md:py-16">
      <div className="container-site w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/avatar.png"
          alt=""
          className="size-[72px] rounded-full bg-muted object-cover ring-1 ring-foreground/10 transition-transform duration-300 hover:scale-105 md:size-[84px]"
        />

        <h1 className="display mt-6">孙悟元</h1>

        <p className="mt-7 max-w-[16em] text-xl tracking-tight text-muted-foreground">
          今年欢笑复明年，秋月春风等闲度。
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="https://x.com/wuyuandev"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 transition-transform duration-200 hover:scale-[1.02]"
            )}
          >
            <FontAwesomeIcon icon={faXTwitter} className="size-4" />
            Twitter
          </a>
          <a
            href="#products"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-transform duration-200 hover:scale-[1.02]"
            )}
          >
            查看产品
          </a>
          <a
            href="https://github.com/Sunwuyuan"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-transform duration-200 hover:scale-[1.02]"
            )}
          >
            GitHub
          </a>
          <Link
            href="/feed"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-transform duration-200 hover:scale-[1.02]"
            )}
          >
            文章
          </Link>
        </div>
      </div>
    </section>
  )
}
