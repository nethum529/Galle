import * as React from "react"

import { cn } from "@/lib/utils"

// Fine grain noise so the glass does not look like flat plastic.
const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

function Surface({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="surface"
      className={cn(
        "relative isolate rounded-[6px] bg-black/35 text-white/95 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]",
        "backdrop-blur-[6px] backdrop-saturate-[1.17] backdrop-contrast-[.89]",
        "[@media(prefers-reduced-transparency:reduce)]:bg-neutral-950/95",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-[.035] mix-blend-overlay"
        style={{ backgroundImage: noise }}
      />
      {children}
    </div>
  )
}

export { Surface }
