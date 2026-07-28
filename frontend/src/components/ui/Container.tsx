import React from "react"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`max-w-[1280px] mx-auto px-6 sm:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}