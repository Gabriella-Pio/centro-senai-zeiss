import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "de"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function htmlLang(locale: string) {
  return locale === "pt" ? "pt-BR" : locale;
}
