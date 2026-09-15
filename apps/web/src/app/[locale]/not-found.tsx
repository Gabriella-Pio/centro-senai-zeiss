import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { getCatalog } from "@/copy/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = getCatalog(locale);
  return {
    title: copy.notFoundCopy.title,
  };
}

export default function NotFound() {
  return <NotFoundView />;
}
