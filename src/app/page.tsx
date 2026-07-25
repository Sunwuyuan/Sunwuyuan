import { BlogCTA } from "@/components/blog-cta"
import { Blogs } from "@/components/blogs"
import { Contacts } from "@/components/contacts"
import { DomainSpotlight } from "@/components/domain-spotlight"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"
import { Timeline } from "@/components/timeline"
import { listArticles } from "@/lib/articles"

export default function HomePage() {
  const articles = listArticles({ limit: 6 })

  return (
    <>
      <Hero />
      <Products />
      <DomainSpotlight />
      <BlogCTA />
      <Blogs articles={articles} />      <Contacts />

      <section className="py-[clamp(6rem,12vw,8rem)]">
        <div className="container-site">
          <header className="mb-10">
            <h2 className="heading-lg">动态</h2>
            <p className="mt-3 text-[15px] text-muted-foreground">最近在说什么</p>
          </header>
          <Timeline />
        </div>
      </section>
    </>
  )
}
