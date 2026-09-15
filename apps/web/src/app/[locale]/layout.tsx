import type { Metadata } from "next";
import { getCatalog } from "@/copy/catalog";
import { LocaleShell } from "@/components/layout/LocaleShell";
import { routing } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  const brand = copy.siteMeta.title.split("|")[0].trim();
  return {
    title: {
      default: copy.siteMeta.title,
      template: `%s | ${brand}`,
    },
    description: copy.siteMeta.description,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  return <LocaleShell locale={locale}>{children}</LocaleShell>;
}
