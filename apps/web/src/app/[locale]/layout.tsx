import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CopyProvider } from "@/copy/CopyProvider";
import { getCatalog } from "@/copy/catalog";
import { ContactCtaBand } from "@/components/layout/ContactCtaBand";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { PageScrollbar } from "@/components/layout/PageScrollbar";
import { SectionSurfaceDevPanel } from "@/components/dev/SectionSurfaceDevPanel";
import { SkipLink } from "@/components/layout/SkipLink";
import { HtmlLang } from "@/i18n/HtmlLang";
import { routing } from "@/i18n/routing";

const isDev = process.env.NODE_ENV === "development";

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
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const catalog = getCatalog(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      <CopyProvider catalog={catalog}>
        <HtmlLang locale={locale} />
        {isDev ? <SectionSurfaceDevPanel /> : null}
        <SkipLink label={catalog.nav.skipToContent} />
        <PageScrollbar />
        <Navbar />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <ContactCtaBand />
        <Footer />
      </CopyProvider>
    </NextIntlClientProvider>
  );
}
