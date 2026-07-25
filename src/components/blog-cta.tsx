import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function BlogCTA() {
  return (
    <section className="py-[clamp(4rem,10vw,6rem)]">
      <div className="container-site">
        <Card className="overflow-hidden border-0 bg-[#171717] text-[#fafafa] ring-0 transition-shadow duration-200 hover:shadow-lg dark:bg-[#ededed] dark:text-[#0a0a0a]">
          <CardContent className="px-6 py-[clamp(4rem,10vw,6rem)] text-center sm:px-10">
            <h2 className="text-[clamp(2.4rem,6vw,3.5rem)] font-[450] leading-[1.05] tracking-[-0.05em]">
              Think. Write.
              <br />
              Ship to the world.
            </h2>
            <p className="mx-auto mt-5 max-w-[28em] text-base text-[#a8a8a8] dark:text-[#666]">
              ZeroCat Blog — 版本化写作的博客社区
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://blog.zerocat.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#fafafa] text-[#171717] transition-transform duration-200 hover:scale-[1.02] hover:bg-[#fafafa]/90 dark:bg-[#0a0a0a] dark:text-[#ededed]"
                )}
              >
                立即开始
              </a>
              <Link
                href="/articles/zerocatblog"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-[#333] text-[#c9c9c9] transition-colors duration-200 hover:bg-white/10 dark:border-[#c9c9c9] dark:text-[#4d4d4d] dark:hover:bg-black/5"
                )}
              >
                了解更多 →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
