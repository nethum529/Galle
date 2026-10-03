import { readFile } from "node:fs/promises"
import path from "node:path"
import { notFound } from "next/navigation"

import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { docs, installCommand } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }))
}

export default async function ComponentPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params
  const doc = docs.find((d) => d.slug === slug)
  if (!doc) notFound()

  const source = await readFile(path.join(process.cwd(), "registry", "glass", "ui", `${slug}.tsx`), "utf8")
  const { Demo } = doc

  return (
    <>
      <h1 className="text-[22px] leading-tight">{doc.name}</h1>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-white/60">{doc.description}</p>
      <ComponentPreview demo={<Demo />} code={<CodeBlock code={source} className="h-full" />} />
      <h2 className="mt-14 text-[15px]">Install</h2>
      <CodeBlock className="mt-4" code={installCommand(slug)} />
      <h2 className="mt-12 text-[15px]">Usage</h2>
      <CodeBlock className="mt-4" code={doc.usage} />
    </>
  )
}
