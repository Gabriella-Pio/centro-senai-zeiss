"use client";

import { useEffect } from "react";
import { htmlLang } from "@/i18n/routing";

export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
  }, [locale]);

  return null;
}
