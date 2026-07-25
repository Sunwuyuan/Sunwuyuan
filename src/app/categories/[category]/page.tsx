import { redirect } from "next/navigation"
import { getCategories } from "@/lib/articles"

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.name }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  redirect(`/feed?category=${encodeURIComponent(decoded)}`)
}
