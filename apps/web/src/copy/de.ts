import { contactCopyActions as ptContactActions, contactHeading as ptContactHeading } from "@/copy/contact";
import {
  equipment as ptEquipment,
  equipmentCard as ptEquipmentCard,
  equipmentCatalogCta as ptEquipmentCta,
  equipmentHeading as ptEquipmentHeading,
} from "@/copy/equipment";
import {
  differentials as ptDifferentials,
  differentialsHeading as ptDifferentialsHeading,
  hero as ptHero,
  labIntro as ptLabIntro,
  partners as ptPartners,
  partnersHeading as ptPartnersHeading,
  sectors as ptSectors,
  sectorsCard as ptSectorsCard,
  sectorsHeading as ptSectorsHeading,
  serviceHubHeading as ptServiceHubHeading,
} from "@/copy/home";
import {
  historyFacts as ptHistoryFacts,
  historyHeading as ptHistoryHeading,
  institutionalHero as ptInstitutionalHero,
  purposeHeading as ptPurposeHeading,
  purposeItems as ptPurposeItems,
  teamGroups as ptTeamGroups,
  teamHeading as ptTeamHeading,
} from "@/copy/institutional";
import { notFoundCopy as ptNotFound } from "@/copy/not-found";
import { quoteForm as ptQuoteForm, quoteHeading as ptQuoteHeading } from "@/copy/quote";
import {
  serviceDetail as ptServiceDetail,
  services as ptServices,
  servicesCatalog as ptServicesCatalog,
  servicesHeading as ptServicesHeading,
} from "@/copy/services";
import {
  brand,
  contactBand as ptContactBand,
  contactBandOnContact as ptContactBandOnContact,
  contactBandOnQuote as ptContactBandOnQuote,
  footer as ptFooter,
  legalPages as ptLegal,
  location as ptLocation,
  nav as ptNav,
} from "@/copy/site";

export const de = {
  siteMeta: {
    title: "SENAI-ZEISS-Kompetenzzentrum für Messtechnik | Goiânia",
    description:
      "Das erste SENAI-ZEISS-Kompetenzzentrum für Messtechnik in Brasilien. Wir messen, digitalisieren und prüfen Industriebauteile an der Faculdade SENAI Ítalo Bologna in Goiânia.",
  },
  brand,
  location: {
    ...ptLocation,
    hours: "Montag bis Freitag, 8 bis 18 Uhr",
  },
  nav: {
    ...ptNav,
    home: { ...ptNav.home, label: "Start" },
    servicesLabel: "Leistungen",
    servicesAllLabel: "Alle Leistungen",
    cta: { ...ptNav.cta, label: "Angebot anfragen" },
    contactCta: { ...ptNav.contactCta, label: "Kontakt" },
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    menuLabel: "Menü",
    skipToContent: "Zum Inhalt springen",
    languages: {
      ...ptNav.languages,
      ariaLabel: "Sprache",
    },
    links: [
      { label: "Über uns", href: "/institutional" },
      { label: "Angebot", href: "/quote" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
  footer: {
    ...ptFooter,
    tagline:
      "Das erste SENAI-ZEISS-Zentrum in Brasilien. Vom Bauteil zum Prüfbericht — mit Methode und Rückverfolgbarkeit.",
    visitTitle: "Besuchen Sie uns",
    servicesTitle: "Leistungen",
    institutionalTitle: "Das Zentrum",
    quickContactLabel: "Kurzkontakt",
    emailAria: "Labor per E-Mail erreichen",
    phoneAria: "Labor anrufen",
    copyright:
      "© 2026 SENAI-ZEISS-Kompetenzzentrum für Messtechnik. Alle Rechte vorbehalten.",
    legal: {
      ...ptFooter.legal,
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutz",
      navLabel: "Rechtliche Dokumente",
    },
    backToTop: "Nach oben",
    mapsLinks: {
      ...ptFooter.mapsLinks,
      openInGoogleMaps: "Adresse in Google Maps öffnen",
      openInWaze: "Adresse in Waze öffnen",
    },
  },
  contactBand: {
    ...ptContactBand,
    eyebrow: "Kontakt",
    title: "Sprechen Sie mit unserem Team",
    description:
      "Fordern Sie ein Angebot an, vereinbaren Sie einen Laborbesuch oder fragen Sie zu Messung und Prüfung.",
    primaryCta: { ...ptContactBand.primaryCta, label: "Angebot anfragen" },
    secondaryCta: { ...ptContactBand.secondaryCta, label: "Adresse und Öffnungszeiten" },
    actionsLabel: "Kontaktaktionen",
  },
  contactBandOnQuote: {
    ...ptContactBandOnQuote,
    eyebrow: "Kontakt",
    title: "Lieber zuerst sprechen?",
    description:
      "Fragen zu Annahme, Besuch oder Zeiten — Adresse und Telefon stehen auf der Kontaktseite.",
    actionsLabel: "Kontaktaktionen",
    primaryCta: { ...ptContactBandOnQuote.primaryCta, label: "Adresse und Öffnungszeiten" },
    secondaryCta: { ...ptContactBandOnQuote.secondaryCta, label: "Leistungen ansehen" },
  },
  contactBandOnContact: {
    ...ptContactBandOnContact,
    eyebrow: "Angebot",
    title: "Lieber ein schriftliches Angebot?",
    description:
      "Beschreiben Sie das Bauteil und was zu klären ist. Was das Labor leistet, steht nebenan.",
    actionsLabel: "Kontaktaktionen",
    primaryCta: { ...ptContactBandOnContact.primaryCta, label: "Angebot anfragen" },
    secondaryCta: { ...ptContactBandOnContact.secondaryCta, label: "Leistungen ansehen" },
  },
  legalPages: {
    terms: {
      ...ptLegal.terms,
      eyebrow: "Nutzungsbedingungen",
      title: "Nutzungsbedingungen",
      description:
        "Diese Website stellt das Labor vor. Angebote, Fristen und technische Bedingungen gelten erst nach Prüfung der Anfrage.",
      blocks: [
        {
          title: "Diese Website",
          text: "Die Inhalte informieren die Industrie über Leistungen, Infrastruktur und Kontaktwege des SENAI-ZEISS-Kompetenzzentrums für Messtechnik an der Faculdade SENAI Ítalo Bologna in Goiânia.",
        },
        {
          title: "Angebote und Aktualisierung",
          text: "Angebote, Fristen und technische Bedingungen gelten erst nach Analyse der Anfrage. Veröffentlichte Angaben können an Geräte, Öffnungszeiten und offizielle Kanäle angepasst werden.",
        },
        {
          title: "Formular",
          text: "Mit einer Angebotsanfrage oder der Übermittlung von Daten über das Formular erklären Sie, dass die Angaben zutreffen und Sie befugt sind, sie gegenüber SENAI Goiás / FIEG zu vertreten.",
        },
      ],
      actions: [{ label: "Datenschutz", href: "/privacy" }],
    },
    privacy: {
      ...ptLegal.privacy,
      eyebrow: "Datenschutz",
      title: "Datenschutzerklärung",
      description:
        "Dieser Hinweis gilt für die Website des SENAI-ZEISS-Kompetenzzentrums für Messtechnik. Die institutionelle Verarbeitung beim SENAI Goiás folgt der Datenschutzrichtlinie des FIEG-Systems.",
      blocks: [
        {
          title: "Daten auf dieser Website",
          text: "Wir nutzen Daten aus dem Angebotsformular oder den Kontaktkanälen — Name, Unternehmen, CNPJ, E-Mail, Telefon und Beschreibung der Anfrage — nur zur Antwort und zur Organisation der technischen Betreuung.",
        },
        {
          title: "Weitergabe",
          text: "Wir verkaufen keine personenbezogenen Daten. Eine Weitergabe erfolgt nur intern, zwischen unseren Teams und denen der Faculdade SENAI Ítalo Bologna, soweit Angebot, Teilelogistik und Prüfbericht es erfordern.",
        },
        {
          title: "Anfragen",
          text: "Zum Aktualisieren oder Löschen von über diese Website übermittelten Angaben nutzen Sie Telefon oder E-Mail der Kontaktseite. Anfragen zur institutionellen Richtlinie des FIEG-Systems gehen an den Datenschutzbeauftragten.",
          cta: ptLegal.privacy.blocks[2]?.cta,
        },
        {
          title: "FIEG-System",
          text: "Die Datenschutzrichtlinie des FIEG-Systems (SESI, SENAI, IEL und FIEG) beschreibt die institutionelle Verarbeitung, die Rechte der betroffenen Personen und den Datenschutzbeauftragten.",
          cta: ptLegal.privacy.blocks[3]?.cta,
        },
      ],
      actions: [
        { label: "Kontakt ansehen", href: "/contact" },
        { label: "Nutzungsbedingungen", href: "/terms" },
      ],
    },
  },
  servicesHeading: {
    ...ptServicesHeading,
    eyebrow: "Unsere Leistungen",
    title: "Was wir im Labor tun",
    description:
      "Von der Maßprüfung bis zur Qualitätsberatung. In jeder Linie stimmen wir Maschinen, Methode und unser Team auf Bauteil und Prüfbericht ab.",
  },
  serviceDetail: {
    ...ptServiceDetail,
    eyebrow: "Leistung",
    backLabel: "Alle unsere Leistungen",
    applicationsLabel: "Anwendungen",
    audienceLabel: "Für wen",
    equipmentLabel: "Geräte, die wir einsetzen",
    ctaLabel: "Angebot für diese Leistung anfragen",
  },
  servicesCatalog: {
    ...ptServicesCatalog,
    detailsLabel: "Details ansehen",
    quoteLabel: "Angebot anfragen",
    allServicesCta: { ...ptServicesCatalog.allServicesCta, label: "Alle Leistungen ansehen" },
  },
  services: ptServices.map((service, index) => {
    const copy = [
      {
        label: "Dimensionelle Qualitätskontrolle",
        cardImageAlt: "ZEISS-Taster und Sensoren an einer Koordinatenmessmaschine für die Maßprüfung.",
        shortDescription:
          "Validierung von Geometrie und Toleranzen per Taster (KMG) und optischer Messung — PRISMO, DuraMax und O-Inspect, einzeln oder kombiniert.",
        description:
          "Maßprüfungen zum Nachweis der Konformität von Bauteilen, Werkzeugen und Vorrichtungen. Wir kombinieren taktile Messung auf KMGs mit optischer Bildmessung, je nach Geometrie, Tolerierung und gefordertem Bericht.",
        applications: [
          "Maßkontrolle zerspanter und gestanzter Teile",
          "Validierung von Werkzeugen und Spannvorrichtungen",
          "Wareneingangs- und Fertigteilprüfung",
          "Ist-Soll-Vergleich Bauteil–CAD und Abweichungsanalyse",
          "Konformitätsbewertung an Serie und Prototypen",
        ],
        audience:
          "Automobil, Luft- und Raumfahrt, Metallverarbeitung und Hersteller, die rückverfolgbare Maßberichte brauchen.",
      },
      {
        label: "Digitalisierung und Reverse Engineering",
        cardImageAlt: "Physisches Bauteil und CAD-Modell am Bildschirm während der digitalen Rekonstruktion.",
        shortDescription:
          "ATOS-Q-Scan im Labor oder T-SCAN vor Ort, mit CAD-Rekonstruktion, 3D-Netz und Vergleich zum Nennmaß.",
        description:
          "Wir digitalisieren in hoher Dichte, um die reale Geometrie zu dokumentieren, Punktwolken und 3D-Netze zu erzeugen, CAD-Modelle zu rekonstruieren und Reverse Engineering zu unterstützen — im Labor oder in Ihrer Fertigung.",
        applications: [
          "As-built-Dokumentation und Kontrolle komplexer Flächen",
          "Reverse Engineering von Teilen ohne Zeichnung",
          "Ist-Soll-Vergleich Bauteil–CAD und Abweichungsanalyse",
          "Datenbasis für Zerspanung und additive Fertigung",
          "Wiederherstellung von Altteilen und Werkzeugen",
        ],
        audience: "Produktentwicklung, Werkzeugbau, Instandhaltung und Entwicklungsteams.",
      },
      {
        label: "Innere Prüfung (ZfP)",
        cardImageAlt: "ZEISS BOSELLO MAX für industrielle Computertomografie und Röntgen.",
        shortDescription:
          "Industrielle CT und Röntgen ohne Zerstörung des Teils — Porosität, Risse, Einschlüsse und Innengeometrie.",
        description:
          "Wir prüfen das Innere von Bauteilen mit Röntgen und Computertomografie, ohne das Teil zu zerstören — Ungänzen, geschlossene Baugruppen und strukturelle Integrität — und liefern einen technischen Bericht.",
        applications: [
          "Porositäts- und Lunkeranalyse an Guss- und Formteilen",
          "Erkennung innerer Risse und Einschlüsse",
          "Prüfung von Baugruppen und verdeckter Geometrie",
          "Validierung kritischer Teile nach Instandhaltung",
          "Qualitätskontrolle an Polymeren und Verbundwerkstoffen",
        ],
        audience:
          "Gießerei, Automobil, Luft- und Raumfahrt, Kunststoffe und Betriebe, in denen innere Integrität entscheidend ist.",
      },
      {
        label: "3D-Prototyping",
        cardImageAlt: "Bauteil in der maßlichen Validierung nach dem Prototyping.",
        shortDescription:
          "3D-Druck von Prototypen aus CAD-Modellen oder hier digitalisierten Netzen, für funktionale und geometrische Tests.",
        description:
          "Wir fertigen additive Prototypen aus CAD oder aus hier erstellten Scans — um Form, Sitz und Konzept vor der Serie zu prüfen.",
        applications: [
          "Funktionale und geometrische Prototypen für die Entwicklung",
          "Ersatzteile und vereinfachte Werkzeuge",
          "Validierung von Sitz und Montage",
          "Schnelle Iteration zwischen Scan, CAD und physischem Teil",
        ],
        audience:
          "Produktentwicklung, Werkzeugbau und F&E, die digitale Modelle schnell materialisieren müssen.",
      },
      {
        label: "Qualitätsberatung",
        cardImageAlt: "Das technische Team des Zentrums bei einer Messoperation.",
        shortDescription:
          "Fachliche und organisatorische Unterstützung: messtechnische Wartungspläne, ISO-Konformität und Gestaltung von Qualitätsprozessen.",
        description:
          "Unser fachliches und organisatorisches Team hilft, Qualitätsprozesse aufzubauen und zu verbessern — von Wartungsplänen für Geräte bis zu Normenkonformität und Audits.",
        applications: [
          "Diagnose und Strukturierung von Messtechnikprozessen",
          "Unterstützung bei der Konformität mit ISO-Qualitätsnormen",
          "Wartungs- und Kalibrierpläne für Geräte",
          "Schulung und Abstimmung interner Teams",
          "Definition von Prüfflüssen und Rückverfolgbarkeit",
        ],
        audience:
          "Unternehmen jeder Größe, die Qualitätsreife anstreben, mit SENAI-Rückhalt und ZEISS-Methodik.",
      },
    ][index];
    return { ...service, ...copy };
  }),
  equipmentHeading: {
    ...ptEquipmentHeading,
    eyebrow: "Unser Park",
    title: "Die Maschinen hinter jeder Prüfung",
    description:
      "Jede Maschine hat eine Rolle. In der Praxis kombiniert eine Leistung oft mehrere — wir wählen den Satz für Bauteil und Bericht.",
  },
  equipment: [
    {
      ...ptEquipment[0],
      tag: "Taktile Messung",
      description:
        "Hochgenaues KMG für komplexe Geometrie, enge Toleranzen und größere Messvolumina.",
      imageAlt: "ZEISS PRISMO Koordinatenmessmaschine.",
    },
    {
      ...ptEquipment[1],
      tag: "Taktile Messung",
      description: "Robustes KMG für die Fertigung — zerspante Teile, Vorrichtungen und Werkzeuge.",
      imageAlt: "ZEISS DuraMax Koordinatenmessmaschine.",
    },
    {
      ...ptEquipment[2],
      tag: "Optische Messung",
      description:
        "Bildmessung für Merkmale, die schwer zu tasten sind, und für visuelle Kontrolle.",
      imageAlt: "ZEISS O-Inspect optisches System.",
    },
    {
      ...ptEquipment[3],
      tag: "Hochgenaues Scannen",
      description:
        "3D-Digitalisierung im Labor — komplexe Flächen, Bauteil–CAD und Reverse Engineering.",
      imageAlt: "ZEISS ATOS Q Scanner.",
    },
    {
      ...ptEquipment[4],
      tag: "Scannen vor Ort",
      description: "Mobiler Scanner für große Teile oder wenn das Teil nicht zu uns kommen kann.",
      imageAlt: "Mobiler Scanner ZEISS T-SCAN hawk 2.",
    },
    {
      ...ptEquipment[5],
      tag: "Computertomografie / Röntgen",
      description: "Zerstörungsfreie Innenprüfung — Porosität, Risse, verdeckte Baugruppen.",
      imageAlt: "ZEISS BOSELLO MAX System.",
    },
    {
      ...ptEquipment[6],
      tag: "3D-Druck",
      description: "Additive Prototypen aus CAD oder im Labor digitalisierten Netzen.",
      imageAlt: "3D-Drucker Bambu Lab A1 mit Filamentsystem.",
    },
  ],
  equipmentCatalogCta: { ...ptEquipmentCta, label: "Alle Leistungen ansehen" },
  equipmentCard: { ...ptEquipmentCard, usedIn: "Eingesetzt in", prev: "Vorheriges Gerät", next: "Nächstes Gerät", goTo: "Gehe zu" },
  hero: {
    ...ptHero,
    eyebrow: "Kompetenzzentrum für Messtechnik",
    subtitle: "Das erste SENAI-ZEISS-Kompetenzzentrum für Messtechnik in Brasilien.",
    body: "Wir messen, digitalisieren und prüfen Industriebauteile — Maßkontrolle, innere Prüfung, 3D-Prototyping und Qualitätsberatung. ZEISS-Technologie, SENAI-Team.",
    primaryCta: { ...ptHero.primaryCta, label: "Angebot anfragen" },
    secondaryCta: { ...ptHero.secondaryCta, label: "Das Labor kennenlernen" },
    image: {
      ...ptHero.image,
      alt: "Blick ins Labor des SENAI-ZEISS-Kompetenzzentrums für Messtechnik, mit ZEISS-Geräten im Hintergrund.",
    },
  },
  labIntro: {
    ...ptLabIntro,
    eyebrow: "Das Labor",
    title: "ZEISS-Technologie und SENAI-Team, in Goiânia",
    body: "Wir arbeiten an der Faculdade SENAI Ítalo Bologna. Hier stehen die Maschinen, die klimatisierten Räume und das technische SENAI-Team.\n\nWir betreuen Industrie in Goiás und anderen Bundesstaaten bei maßlicher Validierung, Schadensanalyse, CAD-Rekonstruktion, zerstörungsfreier Prüfung und 3D-Prototyping — mit demselben Anspruch, den Qualität, Instandhaltung und Produktentwicklung verlangen.",
    image: {
      ...ptLabIntro.image,
      alt: "Blick ins Labor des SENAI-ZEISS-Kompetenzzentrums für Messtechnik, mit dem Messraum im Hintergrund.",
    },
    cta: { ...ptLabIntro.cta, label: "Das Labor kennenlernen" },
  },
  serviceHubHeading: {
    ...ptServiceHubHeading,
    eyebrow: "Unsere Leistungen",
    title: "Was wir messen und was wir liefern",
    description:
      "Vom Maßbericht bis zur Qualitätsberatung wählen wir die Maschinen nach Bauteil und nach dem, was der Bericht beantworten muss.",
  },
  differentialsHeading: {
    ...ptDifferentialsHeading,
    eyebrow: "Warum uns Unternehmen aufsuchen",
    title: "Vom Bauteil, das wir annehmen, zum Bericht, den wir zurückgeben",
    description:
      "Jede Anfrage folgt einem technischen Ablauf — von der Annahme bis zur Berichtsabgabe — mit ZEISS-Methodik und Rückverfolgbarkeit der Messungen.",
  },
  differentials: [
    {
      ...ptDifferentials[0],
      title: "Maßliche Genauigkeit",
      description: "Wir messen enge Toleranzen an kritischen Teilen.",
    },
    {
      ...ptDifferentials[1],
      title: "Rückverfolgbarkeit",
      description: "Wir dokumentieren die Messkette von der Annahme bis zum Bericht.",
    },
    {
      ...ptDifferentials[2],
      title: "Maschinen im Park",
      description: "KMG, optisch, Scanner, Röntgen und 3D-Druck.",
    },
    {
      ...ptDifferentials[3],
      title: "Zentrum in Brasilien",
      description: "Das erste SENAI-ZEISS-Zentrum im Land.",
    },
    {
      ...ptDifferentials[4],
      title: "Investition",
      description: "Eine vollständige messtechnische Infrastruktur.",
    },
  ],
  sectorsCard: {
    ...ptSectorsCard,
    servicesLabel: "Leistungen, die wir kombinieren",
    colSector: "Branche",
    colApplication: "Am Produkt",
    colServices: "Leistungen",
    shortLabels: {
      ...ptSectorsCard.shortLabels,
      "controle-qualidade-dimensional": "Maßhaltigkeit",
      "digitalizacao-engenharia-reversa": "Digitalisierung",
      "inspecao-interna": "ZfP-Prüfung",
      "prototipacao-3d": "Prototyping",
      "consultoria-qualidade": "Beratung",
    },
  },
  sectorsHeading: {
    ...ptSectorsHeading,
    eyebrow: "Branchen, die wir betreuen",
    title: "Wo Messung ins Produkt greift",
    description:
      "Von der Montagelinie bis zum kritischen Bauteil — wir setzen Messtechnik nach Risiko und Toleranz jeder Branche ein.",
  },
  sectors: [
    {
      ...ptSectors[0],
      title: "Automobil",
      description:
        "Maßliche Standardisierung, Wiederholbarkeit zwischen Losen, Validierung von Ersatzteilen und Reverse Engineering von Komponenten.",
    },
    {
      ...ptSectors[1],
      title: "Luft- und Raumfahrt",
      description:
        "Wir prüfen kritische Teile nach der Instandhaltung — KMG, 3D-Scan und Röntgen für innere Integrität.",
    },
    {
      ...ptSectors[2],
      title: "Metallverarbeitung",
      description:
        "Zerspanungskontrolle, Werkzeuge, Teilekonformität und Schadensanalyse in der Fertigung.",
    },
    {
      ...ptSectors[3],
      title: "Pharma",
      description:
        "Wir unterstützen Qualität und Rückverfolgbarkeit von Komponenten, Verpackungen und Prozessvorrichtungen.",
    },
  ],
  partnersHeading: {
    ...ptPartnersHeading,
    eyebrow: "Wer uns trägt",
    title: "Die Institutionen hinter dem Labor",
    description:
      "FIEG, SENAI Goiás, ZEISS und die Faculdade SENAI Ítalo Bologna — die Struktur, die ZEISS-Messtechnik in Goiânia hält.",
  },
  partners: [
    {
      ...ptPartners[0],
      logoAlt: "Logo Carl Zeiss — Technologiepartner in der industriellen Messtechnik",
    },
    {
      ...ptPartners[1],
      logoAlt: "Logo SENAI Goiás — Netz für Berufsbildung und Industriedienstleistungen",
    },
    {
      ...ptPartners[2],
      logoAlt: "Logo FIEG — Industrieverband des Bundesstaates Goiás",
    },
    ptPartners[3],
  ],
  institutionalHero: {
    ...ptInstitutionalHero,
    eyebrow: "Das Zentrum",
    title: "Das erste SENAI-ZEISS-Zentrum in Brasilien",
    subtitle: "Eröffnet 2024 an der Faculdade SENAI Ítalo Bologna.",
    body: "Wir sind die Partnerschaft von FIEG, SENAI Goiás und Carl Zeiss: industrielle Messtechnik mit Service für die Industrie und Ausbildung im selben Labor, in Goiânia.",
    primaryCta: { ...ptInstitutionalHero.primaryCta, label: "Die Geschichte lesen" },
    secondaryCta: { ...ptInstitutionalHero.secondaryCta, label: "Angebot anfragen" },
    image: {
      ...ptInstitutionalHero.image,
      alt: "Messraum des SENAI-ZEISS-Kompetenzzentrums für Messtechnik, mit Geräten im Hintergrund.",
    },
  },
  historyHeading: {
    ...ptHistoryHeading,
    eyebrow: "Unsere Geschichte",
    title: "Wie wir nach Goiânia kamen",
    description: "Eine Partnerschaft ohne Vorbild im Land, an der Faculdade SENAI Ítalo Bologna.",
  },
  historyFacts: [
    { ...ptHistoryFacts[0], label: "SENAI-ZEISS-Zentrum in Brasilien" },
    { ...ptHistoryFacts[1], label: "Investition in Maschinen, Software und kontrollierte Umgebung" },
    { ...ptHistoryFacts[2], label: "Eröffnung an der Faculdade SENAI Ítalo Bologna" },
  ],
  historyParagraphs: [
    "Am 25. November 2024 eröffnete die FIEG an der Faculdade SENAI Ítalo Bologna das erste SENAI-ZEISS-Kompetenzzentrum für Messtechnik in Brasilien. Die Partnerschaft mit Carl Zeiss — einer weltweiten Referenz in der industriellen Messtechnik — brachte das Labor nach Goiânia.",
    "Die Investition von 40 Millionen Real vereinte KMGs, optische Messung, Multisensorsysteme, 3D-Scan, Röntgen und 3D-Druck. Das Labor erbringt hochgenaue Leistungen für Unternehmen und bildet Fachkräfte aus, die diese Technologien bedienen.",
  ],
  purposeHeading: {
    ...ptPurposeHeading,
    eyebrow: "Auftrag, Vision und Werte",
    title: "Drei Bezüge, derselbe Anspruch wie der Bericht",
    description: "Auftrag, Vision und Werte — jedes an seinem Platz, ohne Abkürzung in der Auslegung.",
  },
  purposeItems: [
    {
      ...ptPurposeItems[0],
      title: "Auftrag",
      value: "Die Industrie mit Daten unterstützen, die sich rückverfolgen lassen",
      description:
        "Wir messen, prüfen und setzen Engineering ein — Evidenz für Qualität, Instandhaltung und Wettbewerbsfähigkeit, mit demselben Anspruch, den die SENAI-Ausbildung im Unterricht verlangt.",
    },
    {
      ...ptPurposeItems[1],
      title: "Vision",
      value: "Das Labor sein, das die Industrie fragt und in dem die nächste Generation messen lernt",
      description:
        "Nationale Referenz in der industriellen Messtechnik, die ZEISS-Technologie und das berufliche Bildungsnetz des SENAI verbindet.",
    },
    {
      ...ptPurposeItems[2],
      title: "Werte",
      value: "Technische Strenge, Rückverfolgbarkeit und Präzision",
      description:
        "Verpflichtung zur Entwicklung der Industrie. Jedes Teil in unserem Ablauf trägt Identifikation, Methode und Bericht — ohne Abkürzung in der Prüfung.",
    },
  ],
  teamHeading: {
    ...ptTeamHeading,
    eyebrow: "Wer es möglich machte",
    title: "Wer das Zentrum dachte, ermöglichte und eröffnete",
    description:
      "Die FIEG ermöglichte die Investition, die Faculdade SENAI Ítalo Bologna beherbergt den Komplex, ZEISS bringt die Technologie.",
  },
  teamGroups: [
    {
      ...ptTeamGroups[0],
      members: [
        {
          ...ptTeamGroups[0].members[0],
          role: "Präsident der FIEG und der Regionalräte von SENAI und SESI",
          imageAlt: "Sandro Mabel, Präsident der FIEG.",
        },
      ],
    },
    {
      ...ptTeamGroups[1],
      members: [
        {
          ...ptTeamGroups[1].members[0],
          role: "Regionaldirektor des SENAI und SESI-Superintendent bei der Eröffnung",
          imageAlt: "Paulo Vargas, Regionaldirektor des SENAI und SESI-Superintendent.",
        },
        {
          ...ptTeamGroups[1].members[1],
          role: "Direktor für Bildung und Technologie bei SESI und SENAI",
          imageAlt: "Claudemir Bonatto, Direktor für Bildung und Technologie bei SESI und SENAI Goiás.",
        },
        {
          ...ptTeamGroups[1].members[2],
          role: "Direktor der Faculdade SENAI Ítalo Bologna",
          imageAlt: "Dario Queija de Siqueira, Direktor der Faculdade SENAI Ítalo Bologna.",
        },
        {
          ...ptTeamGroups[1].members[3],
          role: "Leiter Technologie und Innovation",
          imageAlt: "Rolando Vargas Vallejos, Leiter Technologie und Innovation bei SENAI Goiás.",
        },
      ],
    },
    {
      ...ptTeamGroups[2],
      members: [
        {
          ...ptTeamGroups[2].members[0],
          role: "Vizepräsident Vertrieb für Lateinamerika, Naher Osten und Afrika",
          imageAlt:
            "Jochen Weinisch, Vizepräsident Vertrieb der ZEISS-Sparte Industrielle Messtechnik für Lateinamerika, Naher Osten und Afrika.",
        },
        {
          ...ptTeamGroups[2].members[1],
          role: "Direktor der Sparte Messtechnik in Brasilien",
          note: "Bei der Eröffnung",
          imageAlt:
            "Alan Toniette, Direktor der ZEISS-Sparte Industrielle Messtechnik in Brasilien, bei der Eröffnung des Zentrums.",
        },
      ],
    },
  ],
  contactHeading: {
    ...ptContactHeading,
    eyebrow: "Kontakt",
    title: "Sprechen Sie mit uns",
    description: {
      ...ptContactHeading.description,
      before:
        "Rufen Sie an, schreiben Sie oder kommen Sie ins Labor — Besuch, Abstimmung der Prüfung oder Annahme des Teils. Wenn Sie schon wissen, was zu messen ist, fordern Sie das Angebot auf der ",
      link: "Angebotsseite",
      after: ".",
    },
    fields: {
      address: "Adresse",
      phone: "Telefon",
      hours: "Öffnungszeiten",
      email: "E-Mail",
    },
    mapTitle: "Karte",
  },
  contactCopyActions: {
    ...ptContactActions,
    phone: "Telefon kopieren",
    email: "E-Mail kopieren",
    address: "Adresse kopieren",
    phoneDone: "Telefon kopiert",
    emailDone: "E-Mail kopiert",
    addressDone: "Adresse kopiert",
  },
  quoteHeading: {
    ...ptQuoteHeading,
    eyebrow: "Angebot",
    title: "Ein Angebot anfragen",
    description: "Beschreiben Sie das Unternehmen und was zu klären ist. Wir übernehmen Prüfung und Angebot.",
  },
  quoteNotes: {
    heading: "Was uns beim Angebot hilft",
    items: [
      { label: "Bauteil", text: "Art, Werkstoff und Menge." },
      { label: "Bedarf", text: "Was am Bauteil zu klären oder nachzuweisen ist." },
      { label: "Termin", text: "Wann das Teil ankommen kann und wann der Bericht da sein muss." },
    ],
  },
  quoteForm: {
    ...ptQuoteForm,
    fields: {
      company: { label: "Unternehmen", placeholder: "Name des Unternehmens" },
      cnpj: { label: "CNPJ", placeholder: "00.000.000/0000-00" },
      contactName: { label: "Ansprechperson", placeholder: "Ihr Name" },
      email: { label: "E-Mail", placeholder: "sie@unternehmen.com" },
      phone: { label: "Telefon", placeholder: "(00) 00000-0000" },
      service: { label: "Gewünschte Leistungen", placeholder: "Leistungen auswählen" },
      otherDetail: {
        label: "Welche andere Leistung",
        placeholder: "Welche Prüfung oder Anfrage nicht auf der Liste steht",
      },
      description: {
        label: "Beschreibung des Bedarfs",
        placeholder: "Bauteil, Menge, Termin und was zu klären ist",
      },
    },
    otherService: { ...ptQuoteForm.otherService, label: "Andere" },
    requiredLegend: "Pflichtfelder",
    submit: "Anfrage senden",
    submitPending: "Wird gesendet…",
    validation: {
      required: "Bitte dieses Feld ausfüllen.",
      email: "Bitte eine gültige E-Mail angeben.",
      phone: "Bitte eine Telefonnummer mit Vorwahl angeben.",
      cnpj: "Bitte eine gültige CNPJ angeben.",
      service: "Bitte mindestens eine Leistung wählen.",
      submit: "Senden nicht möglich. Versuchen Sie es erneut oder rufen Sie die Nummer auf der Kontaktseite an.",
    },
    privacy: {
      ...ptQuoteForm.privacy,
      before: "Wir nutzen die Daten nur, um auf das Angebot zu antworten. Lesen Sie die ",
      link: "Datenschutzerklärung",
      after: ".",
    },
    success: {
      title: "Wir haben die Anfrage erhalten",
      body: "Wir haben die Anfrage erfasst. Unser Team prüft den Bedarf und antwortet mit einem Angebot per E-Mail, WhatsApp oder Anruf.",
      close: "Schließen",
    },
  },
  notFoundCopy: {
    ...ptNotFound,
    eyebrow: "Seite nicht gefunden",
    title: "Diese Seite haben wir nicht gefunden",
    description: "Diese Adresse gibt es auf der Website nicht. Zurück zum Start oder eine Leistung wählen.",
    homeCta: { ...ptNotFound.homeCta, label: "Zur Startseite" },
  },
};
