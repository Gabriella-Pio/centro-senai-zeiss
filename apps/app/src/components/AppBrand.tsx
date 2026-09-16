import Image from "next/image";
import Link from "next/link";
import "./app-brand.css";

type AppBrandProps = {
  href?: string;
  variant?: "nav" | "footer";
};

export function AppBrand({ href, variant = "nav" }: AppBrandProps) {
  const mark = (
    <Image
      src="/brand/logo-senai.png"
      alt="Centro de Excelência em Metrologia SENAI ZEISS"
      width={4692}
      height={436}
      unoptimized
      priority={variant === "nav"}
      className={`app-brand__mark app-brand__mark--${variant}`}
    />
  );

  if (!href) {
    return <div className="app-brand">{mark}</div>;
  }

  return (
    <Link href={href} className="app-brand" aria-label="Área da equipe — Centro de Excelência em Metrologia SENAI ZEISS">
      {mark}
    </Link>
  );
}
