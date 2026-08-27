import { cn } from "@cem/ui"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  /** default: fundo base. muted: leve variação (secondary/50) para alternar
   * entre seções. surface: tom do card (--color-card), o mais claro do
   * conjunto — usar com moderação, "quando relevante" (ex: seção de
   * diferenciais/certificações), nunca como um light mode completo. */
  variant?: "default" | "muted" | "surface"
  /** Padding-top extra para o conteúdo não ficar sob a navbar fixa. */
  clearNav?: boolean
}

export function Section({
  children,
  className = "",
  variant = "default",
  clearNav = false,
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "bg-background text-foreground",
    muted: "bg-secondary/50 text-foreground",
    surface: "bg-card text-card-foreground",
  }

  return (
    <section
      className={cn(
        "py-24 md:py-36 transition-colors",
        bgClasses[variant],
        clearNav && "pt-(--page-pad-top)!",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
