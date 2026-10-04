"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className={cn("flex items-start rounded-[4px] bg-black/25 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]", className)}>
      <pre className="h-full min-w-0 flex-1 overflow-auto py-4 pl-4 font-mono [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-[12.5px] leading-relaxed text-white/80">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy"}
        onClick={() => navigator.clipboard.writeText(code).then(() => setCopied(true))}
        className="m-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-[4px] text-white/40 transition-colors duration-100 hover:text-white/95"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          {copied ? <path d="M3 8.5l3 3 7-7" /> : <path d="M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3" />}
        </svg>
      </button>
    </div>
  )
}
