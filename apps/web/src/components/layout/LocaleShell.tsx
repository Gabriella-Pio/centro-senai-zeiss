import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
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

export function LocaleShell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
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
