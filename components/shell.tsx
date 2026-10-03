"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"
import { NavBar } from "@/registry/glass/ui/nav-bar"
import { Surface } from "@/registry/glass/ui/surface"

type Page = { label: string; href: string }

export function Shell({ components, children }: { components: Page[]; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const mainRef = React.useRef<HTMLElement>(null)

  // The page scrolls inside the card, not the window, so reset it here.
  React.useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  const linkClass = (href: string) =>
    cn(
      "mx-3 rounded-[4px] px-[18px] text-sm leading-8 text-white/70 transition-colors duration-100 hover:text-white/95",
      pathname === href && "bg-white/8 text-white/95"
    )

  return (
    <Surface className="flex h-full flex-col overflow-hidden rounded-none shadow-none md:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-white/[.07] pb-5 md:flex">
        <Link href="/" className="px-[30px] pt-6 pb-5 text-sm">
          Galle
        </Link>
        <Link href="/" className={linkClass("/")}>
          Introduction
        </Link>
        <div className="h-6" />
        {components.map((page) => (
          <Link key={page.href} href={page.href} className={linkClass(page.href)}>
            {page.label}
          </Link>
        ))}
      </aside>

      <div className="z-10 shrink-0 p-2 md:hidden">
        <NavBar
          brand={<Link href="/">Galle</Link>}
          items={[{ label: "Introduction", href: "/" }, ...components]}
          current={pathname}
          onSelect={(href, e) => {
            e.preventDefault()
            router.push(href)
          }}
        />
      </div>

      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[860px] px-5 pt-6 pb-16 md:px-10 md:pt-14">{children}</div>
      </main>
    </Surface>
  )
}
