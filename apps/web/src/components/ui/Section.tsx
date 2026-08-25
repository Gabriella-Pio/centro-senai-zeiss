import React from "react"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  /** default: fundo base. muted: leve variação (secondary/50) para alternar
   * entre seções. surface: tom do card (--color-card), o mais claro do
   * conjunto — usar com moderação, "quando relevante" (ex: seção de
   * diferenciais/certificações), nunca como um light mode completo. */
  variant?: "default" | "muted" | "surface"
}

export function Section({
  children,
  className = "",
  variant = "default",
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "bg-background text-foreground",
    muted: "bg-secondary/50 text-foreground",
    surface: "bg-card text-card-foreground",
  }

  return (
    <section
      className={`py-24 md:py-36 transition-colors ${bgClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}