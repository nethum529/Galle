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

// Distance of a pill's left and right edges from the edges of the link row.
type Box = { left: number; right: number }

const ease = "cubic-bezier(0.22, 1, 0.36, 1)"

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches

function measure(row: HTMLElement, link: Element | null): Box | null {
  if (!link) return null
  const r = row.getBoundingClientRect()
  const l = link.getBoundingClientRect()
  return { left: l.left - r.left, right: r.right - l.right }
}

// The leading edge moves first and the trailing edge follows a moment later,
// so the pill stretches a little while it travels.
function edgeTransition(from: Box, to: Box, lead: number, trail: number) {
  const right = to.left > from.left
  return `left ${right ? trail : lead}ms ${ease}, right ${right ? lead : trail}ms ${ease}`
}

function placePill(pill: HTMLElement, to: Box, transition: string) {
  pill.style.transition = transition
  pill.style.left = `${to.left}px`
  pill.style.right = `${to.right}px`
}

// Arrow keys move focus between links. Home and End jump to the ends.
function moveFocus(e: React.KeyboardEvent<HTMLElement>, back: string, forward: string) {
  const links = [...e.currentTarget.querySelectorAll<HTMLElement>("a")]
  const i = links.indexOf(document.activeElement as HTMLElement)
  if (i < 0) return
  const n = links.length
  const next =
    e.key === forward ? (i + 1) % n : e.key === back ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1
  if (next < 0) return
  e.preventDefault()
  links[next].focus()
}

const focusRing = "outline-hidden focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-white/40"

function NavBar({ brand, items, current, onSelect, className, ...props }: NavBarProps) {
  const rootRef = React.useRef<HTMLElement>(null)
  const rowRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLSpanElement>(null)
  const hoverRef = React.useRef<HTMLSpanElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const pillBox = React.useRef<Box | null>(null)
  const hoverBox = React.useRef<Box | null>(null)
  const [open, setOpen] = React.useState(false)
  const menuId = React.useId()

  // Move the pill under the current link. A resize snaps it into place without a slide.
  React.useLayoutEffect(() => {
    const row = rowRef.current
    const pill = pillRef.current
    if (!row || !pill) return
    const place = (animate: boolean) => {
      const to = measure(row, row.querySelector('[aria-current="page"]'))
      const from = pillBox.current
      pillBox.current = to
      if (!to) {
        pill.style.opacity = "0"
        return
      }
      pill.style.opacity = "1"
      if (!animate || !from) return placePill(pill, to, "none")
      if (reducedMotion()) {
        placePill(pill, to, "none")
        pill.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 })
        return
      }
      placePill(pill, to, edgeTransition(from, to, 380, 520))
    }
    place(true)
    let width = row.offsetWidth
    const observer = new ResizeObserver(() => {
      if (row.offsetWidth === width) return
      width = row.offsetWidth
      place(false)
    })
    observer.observe(row)
    return () => observer.disconnect()
  }, [current])

  // A faint second pill follows the pointer. It hides over the current link.
  const showHover = (link: HTMLAnchorElement) => {
    const row = rowRef.current
    const hover = hoverRef.current
    const to = row && measure(row, link)
    if (!hover || !to) return
    const from = hoverBox.current
    hoverBox.current = to
    const slide = from && !reducedMotion() ? `${edgeTransition(from, to, 200, 280)}, ` : ""
    placePill(hover, to, `${slide}opacity 150ms linear`)
    hover.style.opacity = link.getAttribute("aria-current") === "page" ? "0" : "1"
  }

  const hideHover = () => {
    if (!hoverRef.current) return
    hoverRef.current.style.opacity = "0"
    hoverBox.current = null
  }

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <nav ref={rootRef} data-slot="nav-bar" className={cn("@container relative h-12", className)} {...props}>
      {/* On narrow widths the bar itself grows down into the menu. */}
      <Surface
        data-open={open}
        className={cn(
          "absolute inset-x-0 top-0 z-10 grid grid-rows-[48px_0fr] overflow-hidden",
          "transition-[grid-template-rows] duration-[250ms] data-[open=true]:grid-rows-[48px_1fr] data-[open=true]:duration-[400ms] motion-reduce:transition-none",
          "ease-[cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <div className="flex items-center justify-between pr-1.5 pl-[18px] @max-[32rem]:pr-0.5">
          <div className="text-sm">{brand}</div>

          <div
            ref={rowRef}
            onPointerLeave={hideHover}
            onKeyDown={(e) => moveFocus(e, "ArrowLeft", "ArrowRight")}
            className="relative flex @max-[32rem]:hidden"
          >
            <span ref={hoverRef} aria-hidden className="absolute inset-y-0 rounded-[2px] bg-white/[.04] opacity-0" />
            <span ref={pillRef} aria-hidden className="absolute inset-y-0 rounded-[2px] bg-white/8 opacity-0" />
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.href === current ? "page" : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && showHover(e.currentTarget)}
                onClick={(e) => {
                  hideHover()
                  onSelect?.(item.href, e)
                }}
                className={cn(
                  "group relative rounded-[2px] px-3.5 text-[13px] leading-9 text-white/60 transition-colors duration-100 hover:text-white/95",
                  "aria-[current=page]:text-white/95 aria-[current=page]:delay-200 aria-[current=page]:duration-200",
                  focusRing
                )}
              >
                <span className="inline-block transition-[scale] duration-100 ease-out group-active:scale-[.97]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className={cn("grid size-11 cursor-pointer place-items-center rounded-[2px] text-white/95 @min-[32rem]:hidden", focusRing)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
              {[
                ["M1 5.5h14", "translate-y-[2.5px] rotate-45"],
                ["M1 10.5h14", "-translate-y-[2.5px] -rotate-45"],
              ].map(([d, x]) => (
                <path
                  key={d}
                  d={d}
                  className={cn(
                    "origin-center transition-[translate,rotate] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] motion-reduce:transition-none",
                    open && x
                  )}
                />
              ))}
            </svg>
          </button>
        </div>

        <div className="min-h-0 @min-[32rem]:hidden">
          <div
            id={menuId}
            inert={!open}
            onKeyDown={(e) => moveFocus(e, "ArrowUp", "ArrowDown")}
            className={cn(
              "flex flex-col px-1.5 pb-1.5 opacity-0 transition-opacity duration-150",
              open && "opacity-100 delay-100 duration-300"
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
                className={cn(
                  "rounded-[2px] px-3 text-[13px] leading-11 text-white/60 aria-[current=page]:bg-white/8 aria-[current=page]:text-white/95",
                  focusRing
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Surface>
    </nav>
  )
}

export { NavBar, type NavBarItem }
