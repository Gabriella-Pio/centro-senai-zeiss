import type { Metadata } from "next";
import { LocaleShell } from "@/components/layout/LocaleShell";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { getCatalog } from "@/copy/catalog";
import { routing } from "@/i18n/routing";

const copy = getCatalog(routing.defaultLocale);

export const metadata: Metadata = {
  title: copy.notFoundCopy.title,
};

/** Fallback quando o layout do locale chama notFound() (idioma inválido) ou a URL não entra no middleware. */
export default function RootNotFound() {
  return (
    <LocaleShell locale={routing.defaultLocale}>
      <NotFoundView />
    </LocaleShell>
  );
}
