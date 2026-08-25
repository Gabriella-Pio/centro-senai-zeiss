import Link from "next/link";

interface LogoProps {
  /** "nav" é maior e mostra o subtítulo "Centro de Excelência"; "footer" é mais compacto. */
  variant?: "nav" | "footer";
}

export function Logo({ variant = "nav" }: LogoProps) {
  const isNav = variant === "nav";

  return (
    <Link href="/" className="flex items-center gap-3 group shrink-0">
      <div
        className={`${
          isNav ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs"
        } rounded-none flex items-center justify-center text-primary-foreground font-bold bg-primary shadow-md`}
      >
        SZ
      </div>
      <div className="text-left">
        <div
          className={`${
            isNav ? "text-base" : "text-sm"
          } font-semibold leading-tight tracking-tight text-foreground`}
        >
          SENAI <span className="text-accent">×</span> ZEISS
        </div>
        {isNav && (
          <div className="text-foreground/50 text-[11px] font-medium tracking-widest uppercase">
            Centro de Excelência
          </div>
        )}
      </div>
    </Link>
  );
}
