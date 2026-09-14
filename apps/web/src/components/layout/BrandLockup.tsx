import Link from "next/link";
import Image from "next/image";
import { cn } from "@cem/ui";
import { brand } from "@/copy/site";
import "./brand-lockup.css";

type BrandLockupProps = {
  /** "nav" é um pouco maior; "footer" compacto. */
  variant?: "nav" | "footer";
  /** Logo claro sobre fundo escuro (ex.: rodapé azul). */
  inverted?: boolean;
};

export function BrandLockup({ variant = "nav", inverted = false }: BrandLockupProps) {
  const isNav = variant === "nav";

  return (
    <Link
      href="/"
      aria-label={brand.ariaLabel}
      className={cn("brand-lockup", isNav ? "brand-lockup--nav" : "brand-lockup--footer")}
    >
      <Image
        src="/brand/logo-senai.png"
        alt=""
        width={4692}
        height={436}
        unoptimized
        className={cn("brand-lockup__mark", inverted && "brightness-0 invert")}
        priority={isNav}
      />
    </Link>
  );
}
