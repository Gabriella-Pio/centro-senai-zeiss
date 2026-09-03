import { cn } from "@cem/ui"
import type { SectionAmbient, SectionPattern, SectionSurface } from "@/lib/section-surfaces"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: "default" | "muted" | "accent" | "surface"
  surface?: SectionSurface
  pattern?: SectionPattern
  ambient?: SectionAmbient
  /** Identificador para o painel de dev (home). */
  sectionKey?: string
  /** Linha-guia técnica na base da seção — suaviza cortes entre cores. */
  guide?: boolean
  clearNav?: boolean
}

export function Section({
  children,
  className = "",
  variant = "default",
  surface = "cream",
  pattern = "none",
  ambient = "none",
  sectionKey,
  guide = true,
  clearNav = false,
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "",
    muted: "",
    accent: "",
    surface: "bg-card/85 backdrop-blur-sm",
  }

  return (
    <section
      data-section-key={sectionKey}
      data-surface={surface}
      data-pattern={pattern}
      data-ambient={ambient}
      className={cn(
        "section-surface relative isolate py-(--section-py) md:py-(--section-py-lg)",
        guide && "section-guide",
        bgClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
