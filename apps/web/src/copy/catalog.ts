import { contactCopyActions, contactHeading } from "@/copy/contact";
import {
  equipment,
  equipmentCard,
  equipmentCatalogCta,
  equipmentHeading,
} from "@/copy/equipment";
import {
  differentials,
  differentialsHeading,
  hero,
  labIntro,
  partners,
  partnersHeading,
  sectors,
  sectorsCard,
  sectorsHeading,
  serviceHubHeading,
} from "@/copy/home";
import {
  historyFacts,
  historyHeading,
  historyParagraphs,
  institutionalHero,
  purposeHeading,
  purposeItems,
  teamGroups,
  teamHeading,
} from "@/copy/institutional";
import { de } from "@/copy/de";
import { en } from "@/copy/en";
import { notFoundCopy } from "@/copy/not-found";
import { quoteForm, quoteHeading, quoteNotes } from "@/copy/quote";
import {
  serviceDetail,
  services,
  servicesCatalog,
  servicesHeading,
} from "@/copy/services";
import {
  brand,
  contactBand,
  contactBandOnContact,
  contactBandOnQuote,
  footer,
  legalPages,
  location,
  nav,
  siteMeta,
} from "@/copy/site";

export const pt = {
  siteMeta,
  brand,
  location,
  nav,
  footer,
  contactBand,
  contactBandOnQuote,
  contactBandOnContact,
  legalPages,
  servicesHeading,
  serviceDetail,
  servicesCatalog,
  services,
  equipmentHeading,
  equipment,
  equipmentCatalogCta,
  equipmentCard,
  hero,
  labIntro,
  serviceHubHeading,
  differentialsHeading,
  differentials,
  sectorsCard,
  sectorsHeading,
  sectors,
  partnersHeading,
  partners,
  institutionalHero,
  historyHeading,
  historyFacts,
  historyParagraphs,
  purposeHeading,
  purposeItems,
  teamHeading,
  teamGroups,
  contactHeading,
  contactCopyActions,
  quoteHeading,
  quoteNotes,
  quoteForm,
  notFoundCopy,
};

export type CopyCatalog = typeof pt;

export function getCatalog(locale: string): CopyCatalog {
  if (locale === "en") return en;
  if (locale === "de") return de;
  return pt;
}
