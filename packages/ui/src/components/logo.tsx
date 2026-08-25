import Link from "next/link";

interface LogoProps {
  variant?: "nav" | "footer";
  href?: string;
}

export function Logo({ variant = "nav", href = "/" }: LogoProps) {
  const isNav = variant === "nav";

  return (
    <Link href={href} className="flex items-center gap-3 group shrink-0">
      <div
        className={`${
          isNav ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs"
        } flex items-center justify-center text-primary-foreground font-bold bg-primary`}
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
          <div className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Centro de Excelência
          </div>
        )}
      </div>
    </Link>
  );
}
