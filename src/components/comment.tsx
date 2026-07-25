"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import "@waline/client/waline.css"

const SERVER_URL =
  "https://api.zcservice.houlang.cloud/comment/ff7b665c1d2dc9de2f499ed14f09bb9b"

export function Comment() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    let disposed = false
    async function mount() {
      const { init } = await import("@waline/client")
      if (disposed || !ref.current) return
      ref.current.innerHTML = ""
      init({
        el: ref.current,
        serverURL: SERVER_URL,
        path: pathname,
        dark: "html.dark",
        login: "enable",
      })
    }
    mount()
    return () => {
      disposed = true
      if (ref.current) ref.current.innerHTML = ""
    }
  }, [pathname])

  return <div ref={ref} />
}
