import NavBarDemo from "@/registry/glass/demos/nav-bar-demo"
import SurfaceDemo from "@/registry/glass/demos/surface-demo"

const registryUrl = "https://raw.githubusercontent.com/nethum529/glass-ui/main/public/r"

export const docs = [
  {
    slug: "surface",
    name: "Surface",
    description: "A flat glass panel. It takes all its color from the backdrop.",
    Demo: SurfaceDemo,
    usage: `import { Surface } from "@/components/ui/surface"

<Surface className="p-5">
  Apotheosis of Hercules
</Surface>`,
  },
  {
    slug: "nav-bar",
    name: "Nav bar",
    description: "A glass top bar. The current link is marked by a pill that slides between links.",
    Demo: NavBarDemo,
    usage: `import { NavBar } from "@/components/ui/nav-bar"

const items = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
]

<NavBar brand="glass" items={items} current={pathname} />`,
  },
]

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${registryUrl}/${slug}.json`
}
