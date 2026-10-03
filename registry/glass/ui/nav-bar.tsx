"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Surface } from "@/registry/glass/ui/surface"

type NavBarItem = {
  label: string
  href: string
}

type NavBarProps = Omit<React.ComponentProps<"nav">, "onSelect"> & {
  brand: React.ReactNode
  items: NavBarItem[]
  current?: string
  onSelect?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void
}

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]"

function NavBar({ brand, items, current, onSelect, className, ...props }: NavBarProps) {
  const rootRef = React.useRef<HTMLElement>(null)
  const linksRef = React.useRef<HTMLDivElement>(null)
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  const [indicator, setIndicator] = React.useState<{ x: number; width: number } | null>(null)
  const [slide, setSlide] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const menuId = React.useId()

  // Measure the current link and move the indicator under it.
  React.useLayoutEffect(() => {
    const links = linksRef.current
    if (!links) return
    const place = () => {
      const link = links.querySelector<HTMLElement>('[aria-current="page"]')
      if (!link) return setIndicator(null)
      const r = link.getBoundingClientRect()
      setIndicator({ x: r.left - links.getBoundingClientRect().left, width: r.width })
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(links)
    return () => observer.disconnect()
  }, [current])

  // The first placement does not slide. Later changes do.
  React.useEffect(() => {
    if (!indicator || slide) return
    const frame = requestAnimationFrame(() => setSlide(true))
    return () => cancelAnimationFrame(frame)
  }, [indicator, slide])

  // With reduced motion the indicator does not slide. It fades in at its new place.
  React.useEffect(() => {
    if (!slide || !matchMedia("(prefers-reduced-motion: reduce)").matches) return
    indicatorRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 })
  }, [current, slide])

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <nav ref={rootRef} data-slot="nav-bar" className={cn("@container relative", className)} {...props}>
      <Surface className="flex h-12 items-center justify-between pr-1.5 pl-[18px] @max-[32rem]:pr-0.5">
        <div className="text-sm">{brand}</div>

        <div ref={linksRef} className="relative flex @max-[32rem]:hidden">
          {indicator && (
            <span
              ref={indicatorRef}
              aria-hidden
              className={cn(
                "absolute top-0 left-0 h-9 rounded-[4px] bg-white/8",
                slide && `transition-[translate,width] duration-[450ms] motion-reduce:transition-none ${ease}`
              )}
              style={{ translate: `${indicator.x}px 0`, width: indicator.width }}
            />
          )}
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.href === current ? "page" : undefined}
              onClick={(e) => onSelect?.(item.href, e)}
              className="relative px-3.5 text-[13px] leading-9 text-white/60 transition-colors duration-100 hover:text-white/95 aria-[current=page]:text-white/95"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
          className="grid size-11 cursor-pointer place-items-center text-white/95 @min-[32rem]:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
            {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M1 5.5h14M1 10.5h14" />}
          </svg>
        </button>
      </Surface>

      <Surface
        id={menuId}
        inert={!open}
        data-open={open}
        className={cn(
          "absolute inset-x-0 top-[calc(100%+8px)] z-10 flex flex-col p-1.5 @min-[32rem]:hidden",
          "invisible -translate-y-1.5 opacity-0 transition-[opacity,translate,visibility] duration-[250ms,250ms,0s] [transition-delay:0s,0s,250ms]",
          "data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:duration-[400ms,400ms,0s] data-[open=true]:[transition-delay:0s]",
          "motion-reduce:translate-y-0",
          ease
        )}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            onClick={(e) => {
              onSelect?.(item.href, e)
              setOpen(false)
            }}
            className="rounded-[4px] px-3 text-[13px] leading-11 text-white/60 aria-[current=page]:bg-white/8 aria-[current=page]:text-white/95"
          >
            {item.label}
          </a>
        ))}
      </Surface>
    </nav>
  )
}

export { NavBar, type NavBarItem }
