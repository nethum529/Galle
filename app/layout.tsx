import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"

import { Shell } from "@/components/shell"
import { docs } from "@/lib/docs"

import "./globals.css"

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Galle",
  description: "Trying to carefully craft a UI component one at a time to build my own personalized library of ui components",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} h-full`}>
      <body className="h-full overflow-hidden bg-black bg-[linear-gradient(rgb(0_0_0/0.7),rgb(0_0_0/0.7)),url(/backdrop.jpg)] bg-cover bg-fixed bg-center font-sans text-[13px] text-white/95 antialiased">
        <Shell components={docs.map((d) => ({ label: d.name, href: `/docs/${d.slug}` }))}>{children}</Shell>
      </body>
    </html>
  )
}
