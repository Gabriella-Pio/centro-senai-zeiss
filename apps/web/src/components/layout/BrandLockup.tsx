import Link from "next/link";
import Image from "next/image";
import { brand } from "@/copy/site";

type BrandLockupProps = {
  /** "nav" é um pouco maior; "footer" compacto. */
  variant?: "nav" | "footer";
};

export function BrandLockup({ variant = "nav" }: BrandLockupProps) {
  const isNav = variant === "nav";

  return (
    <Link href="/" aria-label={brand.ariaLabel} className="flex min-w-0 shrink-0 items-center">
      <Image
        src="/brand/logo-senai.png"
        alt=""
        width={1024}
        height={95}
        unoptimized
        className={isNav ? "h-8 w-auto sm:h-9" : "h-6 w-auto max-w-full"}
        priority={isNav}
      />
    </Link>
  );
}
