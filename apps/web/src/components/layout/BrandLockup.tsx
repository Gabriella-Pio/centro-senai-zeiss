import Link from "next/link";
import Image from "next/image";
import { cn } from "@cem/ui";
import { brand } from "@/copy/site";

type BrandLockupProps = {
  /** "nav" é um pouco maior; "footer" compacto. */
  variant?: "nav" | "footer";
  /** Logo claro sobre fundo escuro (ex.: rodapé azul). */
  inverted?: boolean;
};

export function BrandLockup({ variant = "nav", inverted = false }: BrandLockupProps) {
  const isNav = variant === "nav";

  return (
    <Link href="/" aria-label={brand.ariaLabel} className="flex min-w-0 shrink-0 items-center">
      <Image
        src="/brand/logo-senai.png"
        alt=""
        width={1024}
        height={95}
        unoptimized
        className={cn(
          isNav ? "h-8 w-auto sm:h-9" : "h-8 w-auto max-w-full sm:h-9",
          inverted && "brightness-0 invert",
        )}
        priority={isNav}
      />
    </Link>
  );
}
