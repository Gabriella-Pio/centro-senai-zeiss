import { cn } from "@cem/ui"

/** Zonas de cor no scroll — fade no topo/fim; o backdrop global fica por baixo. */
export type SectionZone = "neutral" | "intro" | "services" | "proof" | "catalog"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: "default" | "muted" | "accent" | "surface"
  zone?: SectionZone
  clearNav?: boolean
}

const zoneClasses: Record<SectionZone, string> = {
  neutral: "",
  intro: "section-zone-intro",
  services: "section-zone-services",
  proof: "section-zone-proof",
  catalog: "section-zone-catalog",
}

export function Section({
  children,
  className = "",
  variant = "default",
  zone = "neutral",
  clearNav = false,
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "bg-transparent",
    muted: "bg-muted/30",
    accent: "bg-transparent",
    surface: "bg-card/85 backdrop-blur-sm",
  }

  return (
    <section
      className={cn(
        "relative isolate py-(--section-py) md:py-(--section-py-lg)",
        bgClasses[variant],
        zoneClasses[zone],
        clearNav && "pt-(--page-pad-top)!",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
