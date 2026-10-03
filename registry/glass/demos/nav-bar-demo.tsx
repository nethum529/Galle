"use client"

import * as React from "react"

import { NavBar } from "@/registry/glass/ui/nav-bar"

const items = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
]

export default function NavBarDemo() {
  const [current, setCurrent] = React.useState("#work")

  return (
    <NavBar
      brand="glass"
      items={items}
      current={current}
      onSelect={(href, e) => {
        e.preventDefault()
        setCurrent(href)
      }}
      className="w-full max-w-[680px] self-start"
    />
  )
}
