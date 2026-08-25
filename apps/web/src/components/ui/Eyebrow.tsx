import React from "react";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Selo pequeno em caixa alta, mesmo padrão usado no Hero — extraído pra
 * não ficar reescrevendo a mesma string de classes em cada seção nova. */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border text-xs font-semibold text-accent tracking-widest uppercase ${className}`}
    >
      {children}
    </div>
  );
}
