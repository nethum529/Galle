"use client"

import * as React from "react"

import { BackdropWindow } from "@/components/backdrop-window"
import { cn } from "@/lib/utils"

const tabs = ["Preview", "Code"] as const

export function ComponentPreview({ demo, code }: { demo: React.ReactNode; code: React.ReactNode }) {
  const [tab, setTab] = React.useState<(typeof tabs)[number]>("Preview")
  const listRef = React.useRef<HTMLDivElement>(null)
  const [pill, setPill] = React.useState<{ x: number; width: number } | null>(null)

  React.useLayoutEffect(() => {
    const button = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!button) return
    setPill({ x: button.offsetLeft, width: button.offsetWidth })
  }, [tab])

  return (
    <div className="mt-10">
      <div ref={listRef} role="tablist" className="relative flex">
        {pill && (
          <span
            aria-hidden
            className="absolute top-0 left-0 h-8 rounded-[4px] bg-white/8 transition-[translate,width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ translate: `${pill.x}px 0`, width: pill.width }}
          />
        )}
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="relative cursor-pointer px-3 leading-8 text-white/60 transition-colors duration-100 hover:text-white/95 aria-selected:text-white/95"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 h-[420px]">
        <BackdropWindow
          hidden={tab !== "Preview"}
          className={cn(
            "h-full items-center justify-center rounded-[4px] p-6 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]",
            tab === "Preview" && "flex"
          )}
        >
          {demo}
        </BackdropWindow>
        <div hidden={tab !== "Code"} className="h-full">
          {code}
        </div>
      </div>
    </div>
  )
}
