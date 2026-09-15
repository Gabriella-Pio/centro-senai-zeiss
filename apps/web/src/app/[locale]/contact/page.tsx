import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { getCatalog } from "@/copy/catalog";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.contactHeading.eyebrow,
    description: copy.contactHeading.title,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactChannels />;
}
