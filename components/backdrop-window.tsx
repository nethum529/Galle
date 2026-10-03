"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const image = { width: 2560, height: 2097 }

// Shows the page backdrop through the glass card, lined up with the real one,
// so a component in here sits on the same picture it would on a real page.
export function BackdropWindow({ className, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      const scale = Math.max(vw / image.width, vh / image.height)
      const w = image.width * scale
      const h = image.height * scale
      const r = el.getBoundingClientRect()
      el.style.backgroundSize = `${w}px ${h}px`
      el.style.backgroundPosition = `${(vw - w) / 2 - r.left}px ${(vh - h) / 2 - r.top}px`
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    addEventListener("resize", update)
    addEventListener("scroll", update, true)
    return () => {
      observer.disconnect()
      removeEventListener("resize", update)
      removeEventListener("scroll", update, true)
    }
  }, [])

  return <div ref={ref} className={cn("bg-[url(/backdrop.jpg)] bg-no-repeat", className)} {...props} />
}
