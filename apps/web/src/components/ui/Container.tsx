import React from "react";
import { cn } from "@cem/ui";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[var(--max-width-content)] px-6 sm:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
