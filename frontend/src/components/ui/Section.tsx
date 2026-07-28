import React from "react"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: "default" | "muted" | "dark"
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
    dark: "bg-industrial-slate text-white",
  }

  return (
    <section
      className={`py-16 md:py-24 transition-colors ${bgClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}