import Link from "next/link";
import Image from "next/image";

type BrandLockupProps = {
  /** "nav" mostra o subtítulo; "footer" é mais compacto. */
  variant?: "nav" | "footer";
};

/**
 * Lockup público: wordmarks SENAI e ZEISS (arquivos autorizados) + × de parceria.
 * O laranja do SENAI fica na marca; o azul da ZEISS não vira segundo accent.
 */
export function BrandLockup({ variant = "nav" }: BrandLockupProps) {
  const isNav = variant === "nav";
  const senaiClass = isNav ? "h-9 w-auto sm:h-10" : "h-7 w-auto";
  const zeissClass = isNav ? "h-9 w-auto sm:h-10" : "h-7 w-auto";

  return (
    <Link
      href="/"
      aria-label="SENAI × ZEISS Centro de Excelência"
      className="flex min-w-0 shrink-0 items-center gap-2.5"
    >
      <Image
        src="/brand/senai.png"
        alt=""
        width={148}
        height={40}
        className={senaiClass}
        priority={isNav}
      />
      <span className="font-heading text-lg font-semibold leading-none text-primary sm:text-xl" aria-hidden>
        ×
      </span>
      <Image
        src="/brand/zeiss.png"
        alt=""
        width={80}
        height={80}
        className={zeissClass}
        priority={isNav}
      />
      {isNav && (
        <span className="hidden text-[11px] font-medium uppercase tracking-widest text-foreground/50 sm:inline">
          Centro de Excelência
        </span>
      )}
    </Link>
  );
}
