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
  historyParagraphs as ptHistoryParagraphs,
  institutionalHero as ptInstitutionalHero,
  purposeHeading as ptPurposeHeading,
  purposeItems as ptPurposeItems,
  teamGroups as ptTeamGroups,
  teamHeading as ptTeamHeading,
} from "@/copy/institutional";
import { notFoundCopy as ptNotFound } from "@/copy/not-found";
import { quoteForm as ptQuoteForm, quoteHeading as ptQuoteHeading, quoteNotes as ptQuoteNotes } from "@/copy/quote";
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
  siteMeta as ptSiteMeta,
} from "@/copy/site";

export const en = {
  siteMeta: {
    title: "SENAI ZEISS Center of Excellence in Metrology | Goiânia",
    description:
      "The first SENAI ZEISS Center of Excellence in Metrology in Brazil. We measure, digitize and inspect industrial parts at Faculdade SENAI Ítalo Bologna, in Goiânia.",
  },
  brand,
  location: {
    ...ptLocation,
    hours: "Monday to Friday, 8 a.m. to 6 p.m.",
  },
  nav: {
    ...ptNav,
    home: { ...ptNav.home, label: "Home" },
    servicesLabel: "Services",
    servicesAllLabel: "All services",
    cta: { ...ptNav.cta, label: "Request a quote" },
    contactCta: { ...ptNav.contactCta, label: "Contact" },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Menu",
    skipToContent: "Skip to content",
    languages: {
      ...ptNav.languages,
      ariaLabel: "Language",
    },
    links: [
      { label: "About", href: "/institutional" },
      { label: "Quote", href: "/quote" },
      { label: "Contact", href: "/contact" },
    ],
  },
  footer: {
    ...ptFooter,
    tagline:
      "The first SENAI ZEISS center in Brazil. From the part to the report, with method and traceability.",
    visitTitle: "Visit us",
    servicesTitle: "Services",
    institutionalTitle: "The center",
    quickContactLabel: "Quick contact",
    emailAria: "Email the laboratory",
    phoneAria: "Call the laboratory",
    copyright:
      "© 2026 SENAI ZEISS Center of Excellence in Metrology. All rights reserved.",
    legal: {
      ...ptFooter.legal,
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      navLabel: "Legal documents",
    },
    backToTop: "Back to top",
    mapsLinks: {
      ...ptFooter.mapsLinks,
      openInGoogleMaps: "Open address in Google Maps",
      openInWaze: "Open address in Waze",
    },
  },
  contactBand: {
    ...ptContactBand,
    eyebrow: "Contact",
    title: "Talk to our team",
    description:
      "Request a quote, schedule a lab visit or ask about measurement and testing.",
    primaryCta: { ...ptContactBand.primaryCta, label: "Request a quote" },
    secondaryCta: { ...ptContactBand.secondaryCta, label: "See address and hours" },
    actionsLabel: "Contact actions",
  },
  contactBandOnQuote: {
    ...ptContactBandOnQuote,
    eyebrow: "Contact",
    title: "Prefer to talk first?",
    description:
      "Questions about intake, visits or hours — address and phone are on the contact page.",
    actionsLabel: "Contact actions",
    primaryCta: { ...ptContactBandOnQuote.primaryCta, label: "See address and hours" },
    secondaryCta: { ...ptContactBandOnQuote.secondaryCta, label: "See the services" },
  },
  contactBandOnContact: {
    ...ptContactBandOnContact,
    eyebrow: "Quote",
    title: "Prefer a written proposal?",
    description:
      "Describe the part and what you need to solve. Want to see what the lab does? Services are next door.",
    actionsLabel: "Contact actions",
    primaryCta: { ...ptContactBandOnContact.primaryCta, label: "Request a quote" },
    secondaryCta: { ...ptContactBandOnContact.secondaryCta, label: "See the services" },
  },
  legalPages: {
    terms: {
      ...ptLegal.terms,
      eyebrow: "Terms of use",
      title: "Terms of Use",
      description:
        "This site presents the laboratory. Quotes, lead times and technical conditions are confirmed only after we review the request.",
      blocks: [
        {
          title: "This site",
          text: "The content informs industry about the services, infrastructure and contact channels of the SENAI ZEISS Center of Excellence in Metrology, at Faculdade SENAI Ítalo Bologna, in Goiânia.",
        },
        {
          title: "Quotes and updates",
          text: "Quotes, lead times and technical conditions are confirmed only after we analyze the request. Published information may be updated to reflect equipment, hours and official channels.",
        },
        {
          title: "Form",
          text: "By requesting a quote or sending data through the form, you declare that the information is true and that you are authorized to represent it before SENAI Goiás / FIEG.",
        },
      ],
      actions: [{ label: "Privacy policy", href: "/privacy" }],
    },
    privacy: {
      ...ptLegal.privacy,
      eyebrow: "Privacy",
      title: "Privacy Policy",
      description:
        "This notice applies to the SENAI ZEISS Center of Excellence in Metrology website. Institutional processing at SENAI Goiás follows the FIEG System privacy policy.",
      blocks: [
        {
          title: "Data on this site",
          text: "We use data sent through the quote form or contact channels — name, company, CNPJ, email, phone and a description of the request — only to respond and organize technical service.",
        },
        {
          title: "Sharing",
          text: "We do not sell personal data. Sharing happens only internally, among our teams and those at Faculdade SENAI Ítalo Bologna needed for the quote, part logistics and the report.",
        },
        {
          title: "Requests",
          text: "To update or delete information sent through this site, use the phone or email on the contact page. Requests about the FIEG System institutional policy go to the data protection officer.",
          cta: ptLegal.privacy.blocks[2]?.cta,
        },
        {
          title: "FIEG System",
          text: "The FIEG System privacy policy (SESI, SENAI, IEL and FIEG) describes institutional processing, data-subject rights and the data protection officer.",
          cta: ptLegal.privacy.blocks[3]?.cta,
        },
      ],
      actions: [
        { label: "See contact", href: "/contact" },
        { label: "Terms of use", href: "/terms" },
      ],
    },
  },
  servicesHeading: {
    ...ptServicesHeading,
    eyebrow: "Our services",
    title: "What we do in the laboratory",
    description:
      "From dimensional inspection to quality consulting. In each line we match the machines, method and our team to the part and the report.",
  },
  serviceDetail: {
    ...ptServiceDetail,
    eyebrow: "Service",
    backLabel: "All our services",
    applicationsLabel: "Applications",
    audienceLabel: "Who it is for",
    equipmentLabel: "Equipment we use",
    ctaLabel: "Request a quote for this service",
  },
  servicesCatalog: {
    ...ptServicesCatalog,
    detailsLabel: "See details",
    quoteLabel: "Request a quote",
    allServicesCta: { ...ptServicesCatalog.allServicesCta, label: "See all services" },
  },
  services: ptServices.map((service, index) => {
    const copy = [
      {
        label: "Dimensional quality control",
        cardImageAlt: "ZEISS styli and sensors on a coordinate measuring machine for dimensional inspection.",
        shortDescription:
          "Geometry and tolerance validation by tactile probing (CMM) and optical measurement — PRISMO, DuraMax and O-Inspect, alone or combined.",
        description:
          "Dimensional tests to prove conformity of parts, tooling and fixtures. We combine contact measurement on CMMs with optical image measurement, according to geometry, tolerancing and the required report.",
        applications: [
          "Dimensional control of machined and stamped parts",
          "Validation of tooling and fixturing",
          "Incoming and finished-product inspection",
          "Part-to-CAD comparison and nominal deviation analysis",
          "Conformity assessment on series and prototypes",
        ],
        audience:
          "Automotive, aerospace, metalworking and manufacturers that need traceable dimensional reports.",
      },
      {
        label: "Digitizing and reverse engineering",
        cardImageAlt: "Physical part and CAD model on screen during digital reconstruction.",
        shortDescription:
          "ATOS Q scanning in the lab or T-SCAN on site, with CAD reconstruction, 3D mesh and comparison to nominal.",
        description:
          "We digitize at high density to document real geometry, generate point clouds and 3D meshes, reconstruct CAD models and support reverse engineering — in the lab or on your shop floor.",
        applications: [
          "As-built documentation and complex-surface control",
          "Reverse engineering of parts without drawings",
          "Part-to-CAD comparison and deviation analysis",
          "Data for machining and additive manufacturing",
          "Recovery of legacy components and tooling",
        ],
        audience: "Product engineering, toolrooms, industrial maintenance and development teams.",
      },
      {
        label: "Internal inspection (NDT)",
        cardImageAlt: "ZEISS BOSELLO MAX system for industrial CT and X-ray.",
        shortDescription:
          "Industrial CT and X-ray without destroying the part — porosity, cracks, inclusions and internal geometry.",
        description:
          "We inspect the inside of components with X-ray and computed tomography, without destroying the part — discontinuities, closed assemblies and structural integrity — and deliver a technical report.",
        applications: [
          "Porosity and void analysis in cast and molded parts",
          "Detection of internal cracks and inclusions",
          "Inspection of assemblies and hidden geometry",
          "Post-maintenance validation of critical parts",
          "Quality control in polymers and composites",
        ],
        audience:
          "Foundry, automotive, aerospace, polymers and operations where internal integrity is critical.",
      },
      {
        label: "3D prototyping",
        cardImageAlt: "Part in dimensional validation after prototyping.",
        shortDescription:
          "3D printing of prototypes from CAD models or meshes digitized here, for functional and geometric tests.",
        description:
          "We build additive prototypes from CAD or from scans made here — to validate form, fit and concept before series production.",
        applications: [
          "Functional and geometric prototypes for development",
          "Replacement parts and simplified tooling",
          "Fit and assembly validation",
          "Fast iteration among scanning, CAD and the physical part",
        ],
        audience:
          "Product development, toolrooms and R&D that need to materialize digital models quickly.",
      },
      {
        label: "Quality consulting",
        cardImageAlt: "The center’s technical team during a measurement operation.",
        shortDescription:
          "Managerial and technical support: metrology maintenance plans, ISO compliance and quality-process design.",
        description:
          "Our managerial and technical team helps structure and improve quality processes — from equipment maintenance plans to standards compliance and audits.",
        applications: [
          "Diagnosis and structuring of metrology processes",
          "Support for ISO quality-standard compliance",
          "Equipment maintenance and calibration plans",
          "Training and alignment of internal teams",
          "Definition of inspection flows and traceability",
        ],
        audience:
          "Companies of all sizes seeking quality maturity, with SENAI backing and ZEISS methodology.",
      },
    ][index];
    return { ...service, ...copy };
  }),
  equipmentHeading: {
    ...ptEquipmentHeading,
    eyebrow: "Our park",
    title: "The machines behind each test",
    description:
      "Each machine has a role. In practice a service may combine several — we choose the set for the part and the report.",
  },
  equipment: [
    {
      ...ptEquipment[0],
      tag: "Tactile measurement",
      description:
        "High-precision CMM for complex geometry, tight tolerances and larger measuring volumes.",
      imageAlt: "ZEISS PRISMO coordinate measuring machine.",
    },
    {
      ...ptEquipment[1],
      tag: "Tactile measurement",
      description: "Shop-floor CMM — machined parts, fixtures and tooling.",
      imageAlt: "ZEISS DuraMax coordinate measuring machine.",
    },
    {
      ...ptEquipment[2],
      tag: "Optical measurement",
      description:
        "Image-based measurement for features that are hard to probe and for visual control.",
      imageAlt: "ZEISS O-Inspect optical system.",
    },
    {
      ...ptEquipment[3],
      tag: "High-precision scanning",
      description:
        "3D digitizing in the lab — complex surfaces, part-to-CAD and reverse engineering.",
      imageAlt: "ZEISS ATOS Q scanner.",
    },
    {
      ...ptEquipment[4],
      tag: "On-site scanning",
      description: "Portable scanner for large parts or when the part cannot come to us.",
      imageAlt: "ZEISS T-SCAN hawk 2 portable scanner.",
    },
    {
      ...ptEquipment[5],
      tag: "Computed tomography / X-ray",
      description: "Nondestructive internal inspection — porosity, cracks, hidden assemblies.",
      imageAlt: "ZEISS BOSELLO MAX system.",
    },
    {
      ...ptEquipment[6],
      tag: "3D printing",
      description: "Additive prototyping from CAD or from meshes digitized in the lab.",
      imageAlt: "Bambu Lab A1 3D printer with filament system.",
    },
  ],
  equipmentCatalogCta: { ...ptEquipmentCta, label: "See all services" },
  equipmentCard: { ...ptEquipmentCard, usedIn: "Used in", prev: "Previous equipment", next: "Next equipment", goTo: "Go to" },
  hero: {
    ...ptHero,
    eyebrow: "Center of Excellence in Metrology",
    subtitle: "The first SENAI ZEISS center of excellence in metrology in Brazil.",
    body: "We measure, digitize and inspect industrial parts — dimensional control, internal inspection, 3D prototyping and quality consulting. ZEISS technology, SENAI team.",
    primaryCta: { ...ptHero.primaryCta, label: "Request a quote" },
    secondaryCta: { ...ptHero.secondaryCta, label: "Explore the lab" },
    image: {
      ...ptHero.image,
      alt: "View of the SENAI ZEISS Center of Excellence in Metrology laboratory, with ZEISS equipment in the background.",
    },
    place: "Goiânia · Faculdade SENAI Ítalo Bologna",
  },
  labIntro: {
    ...ptLabIntro,
    eyebrow: "The laboratory",
    title: "ZEISS technology and a SENAI team, in Goiânia",
    body: "We operate at Faculdade SENAI Ítalo Bologna. This is where the machines, climate-controlled rooms and SENAI technical team are.\n\nWe serve industry in Goiás and other states on dimensional validation, failure analysis, CAD reconstruction, nondestructive testing and 3D prototyping — the same rigor that quality, maintenance and product development require.",
    image: {
      ...ptLabIntro.image,
      alt: "View of the SENAI ZEISS Center of Excellence in Metrology laboratory, with the measuring room in the background.",
    },
    cta: { ...ptLabIntro.cta, label: "Explore the lab" },
  },
  serviceHubHeading: {
    ...ptServiceHubHeading,
    eyebrow: "Our services",
    title: "What we measure and what we deliver",
    description:
      "From the dimensional report to quality consulting, we choose the machines according to the part and what the report needs to answer.",
  },
  differentialsHeading: {
    ...ptDifferentialsHeading,
    eyebrow: "Why companies come to us",
    title: "From the part we receive to the report we return",
    description:
      "Each request follows a technical flow — from part intake to report delivery — with ZEISS methodology and measurement traceability.",
  },
  differentials: [
    {
      ...ptDifferentials[0],
      title: "Dimensional accuracy",
      description: "We measure tight tolerances on critical parts.",
    },
    {
      ...ptDifferentials[1],
      title: "Traceability",
      description: "We document the measurement chain from intake to the report.",
    },
    {
      ...ptDifferentials[2],
      title: "Machines in the park",
      description: "CMM, optical, scanner, X-ray and 3D printing.",
    },
    {
      ...ptDifferentials[3],
      title: "Center in Brazil",
      description: "The first SENAI ZEISS center in the country.",
    },
    {
      ...ptDifferentials[4],
      title: "Investment",
      description: "A complete metrology infrastructure.",
    },
  ],
  sectorsCard: {
    ...ptSectorsCard,
    servicesLabel: "Services we combine",
    colSector: "Sector",
    colApplication: "On the product",
    colServices: "Services",
    shortLabels: {
      ...ptSectorsCard.shortLabels,
      "digitalizacao-engenharia-reversa": "Digitizing",
      "inspecao-interna": "NDT inspection",
      "prototipacao-3d": "Prototyping",
      "consultoria-qualidade": "Consulting",
    },
  },
  sectorsHeading: {
    ...ptSectorsHeading,
    eyebrow: "Sectors we serve",
    title: "Where measurement meets the product",
    description:
      "From the assembly line to the critical component — we apply metrology according to each sector’s risk and tolerance.",
  },
  sectors: [
    {
      ...ptSectors[0],
      title: "Automotive",
      description:
        "Dimensional standardization, batch-to-batch repeatability, spare-part validation and reverse engineering of components.",
    },
    {
      ...ptSectors[1],
      title: "Aerospace",
      description:
        "We inspect critical parts after maintenance — CMM, 3D scanning and X-ray for internal integrity.",
    },
    {
      ...ptSectors[2],
      title: "Metalworking",
      description:
        "Machining control, tooling, part conformity and failure analysis in manufacturing.",
    },
    {
      ...ptSectors[3],
      title: "Pharmaceutical",
      description:
        "We support quality and traceability of components, packaging and process devices.",
    },
  ],
  partnersHeading: {
    ...ptPartnersHeading,
    eyebrow: "Who stands behind us",
    title: "The institutions behind the laboratory",
    description:
      "FIEG, SENAI Goiás and ZEISS — the structure that keeps ZEISS metrology at Faculdade SENAI Ítalo Bologna, in Goiânia.",
  },
  partners: [
    {
      ...ptPartners[0],
      logoAlt: "Carl Zeiss logo — technology partner in industrial metrology",
    },
    {
      ...ptPartners[1],
      logoAlt: "SENAI Goiás logo — vocational education and industry services network",
    },
    {
      ...ptPartners[2],
      logoAlt: "FIEG logo — Federation of Industries of the State of Goiás",
    },
  ],
  institutionalHero: {
    ...ptInstitutionalHero,
    eyebrow: "The center",
    title: "The first SENAI ZEISS center in Brazil",
    subtitle: "Opened in 2024 at Faculdade SENAI Ítalo Bologna.",
    body: "We are the partnership of FIEG, SENAI Goiás and Carl Zeiss: industrial metrology with industry service and training in the same laboratory, in Goiânia.",
    primaryCta: { ...ptInstitutionalHero.primaryCta, label: "See the story" },
    secondaryCta: { ...ptInstitutionalHero.secondaryCta, label: "Request a quote" },
    image: {
      ...ptInstitutionalHero.image,
      alt: "Measuring room at the SENAI ZEISS Center of Excellence in Metrology, with equipment in the background.",
    },
  },
  historyHeading: {
    ...ptHistoryHeading,
    eyebrow: "Our story",
    title: "How we arrived in Goiânia",
    description: "A first-of-its-kind partnership in the country, at Faculdade SENAI Ítalo Bologna.",
  },
  historyFacts: [
    { ...ptHistoryFacts[0], label: "SENAI ZEISS center in Brazil" },
    { ...ptHistoryFacts[1], label: "Investment in machines, software and a controlled environment" },
    { ...ptHistoryFacts[2], label: "Opening at Faculdade SENAI Ítalo Bologna" },
  ],
  historyParagraphs: [
    "On 25 November 2024, FIEG opened the first SENAI ZEISS Center of Excellence in Metrology in Brazil at Faculdade SENAI Ítalo Bologna. The partnership with Carl Zeiss — a global reference in industrial metrology — placed the laboratory in Goiânia.",
    "The R$ 40 million investment brought together CMMs, optical measurement, multisensor systems, 3D scanning, X-ray and 3D printing. The lab delivers high-precision services to companies and trains professionals to operate these technologies.",
  ],
  purposeHeading: {
    ...ptPurposeHeading,
    eyebrow: "Mission, vision and values",
    title: "Three references, the same rigor as the report",
    description: "Mission, vision and values — each in its place, with no shortcut in interpretation.",
  },
  purposeItems: [
    {
      ...ptPurposeItems[0],
      title: "Mission",
      value: "Support industry with data that can be traced",
      description:
        "We measure, inspect and apply engineering — evidence for quality, maintenance and competitiveness, with the same rigor SENAI training requires in the classroom.",
    },
    {
      ...ptPurposeItems[1],
      title: "Vision",
      value: "Be the lab industry consults and where the next generation learns to measure",
      description:
        "A national reference in industrial metrology, joining ZEISS technology and SENAI’s vocational education network.",
    },
    {
      ...ptPurposeItems[2],
      title: "Values",
      value: "Technical rigor, traceability and precision",
      description:
        "A commitment to industry development. Every part that enters our flow carries identification, method and a report — no shortcut in testing.",
    },
  ],
  teamHeading: {
    ...ptTeamHeading,
    eyebrow: "Who made it happen",
    title: "Who conceived, enabled and opened the center",
    description:
      "FIEG enabled the investment, Faculdade SENAI Ítalo Bologna houses the complex, ZEISS brings the technology.",
  },
  teamGroups: [
    {
      ...ptTeamGroups[0],
      members: [
        {
          ...ptTeamGroups[0].members[0],
          role: "President of FIEG and of the SENAI and SESI Regional Councils",
          imageAlt: "Sandro Mabel, president of FIEG.",
        },
      ],
    },
    {
      ...ptTeamGroups[1],
      members: [
        {
          ...ptTeamGroups[1].members[0],
          role: "SENAI regional director and SESI superintendent at the opening",
          imageAlt: "Paulo Vargas, SENAI regional director and SESI superintendent.",
        },
        {
          ...ptTeamGroups[1].members[1],
          role: "Director of Education and Technology at SESI and SENAI",
          imageAlt: "Claudemir Bonatto, Director of Education and Technology at SESI and SENAI Goiás.",
        },
        {
          ...ptTeamGroups[1].members[2],
          role: "Director of Faculdade SENAI Ítalo Bologna",
          imageAlt: "Dario Queija de Siqueira, director of Faculdade SENAI Ítalo Bologna.",
        },
        {
          ...ptTeamGroups[1].members[3],
          role: "Technology and Innovation manager",
          imageAlt: "Rolando Vargas Vallejos, Technology and Innovation manager at SENAI Goiás.",
        },
      ],
    },
    {
      ...ptTeamGroups[2],
      members: [
        {
          ...ptTeamGroups[2].members[0],
          role: "Vice President of Sales for Latin America, Middle East and Africa",
          imageAlt:
            "Jochen Weinisch, Vice President of Sales for ZEISS Industrial Quality Solutions in Latin America, Middle East and Africa.",
        },
        {
          ...ptTeamGroups[2].members[1],
          role: "Director of the Metrology Division in Brazil",
          note: "At the opening",
          imageAlt:
            "Alan Toniette, director of ZEISS Industrial Quality Solutions in Brazil, at the center’s opening.",
        },
      ],
    },
  ],
  contactHeading: {
    ...ptContactHeading,
    eyebrow: "Contact",
    title: "Talk to us",
    description: {
      ...ptContactHeading.description,
      before:
        "Call, write or come to the lab — a visit, a test alignment or part intake. If you already know what you need to measure, request a proposal on the ",
      link: "quote page",
      after: ".",
    },
    fields: {
      address: "Address",
      phone: "Phone",
      hours: "Hours",
      email: "Email",
    },
    mapTitle: "Map",
  },
  contactCopyActions: {
    ...ptContactActions,
    phone: "Copy phone",
    email: "Copy email",
    address: "Copy address",
    phoneDone: "Phone copied",
    emailDone: "Email copied",
    addressDone: "Address copied",
  },
  quoteHeading: {
    ...ptQuoteHeading,
    eyebrow: "Quote",
    title: "Request a quote",
    description: "Describe the company and what you need to solve. We handle the test and the proposal.",
  },
  quoteNotes: {
    heading: "What helps us build the proposal",
    items: [
      { label: "Part", text: "Type, material and quantity." },
      { label: "Need", text: "What you need to solve or prove on the part." },
      { label: "Timing", text: "When the part can arrive and when the report is needed." },
    ],
  },
  quoteForm: {
    ...ptQuoteForm,
    fields: {
      company: { label: "Company", placeholder: "Company name" },
      cnpj: { label: "CNPJ", placeholder: "00.000.000/0000-00" },
      contactName: { label: "Contact", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@company.com" },
      phone: { label: "Phone", placeholder: "(00) 00000-0000" },
      service: { label: "Requested services", placeholder: "Select the services" },
      otherDetail: {
        label: "Which other service",
        placeholder: "Which test or request is not on the list",
      },
      description: {
        label: "Description of the need",
        placeholder: "Part, quantity, timing and what you need to solve",
      },
    },
    otherService: { ...ptQuoteForm.otherService, label: "Other" },
    requiredLegend: "Required fields",
    submit: "Send request",
    submitPending: "Sending…",
    validation: {
      required: "Fill in this field.",
      email: "Enter a valid email.",
      phone: "Enter a phone number with area code.",
      cnpj: "Enter a valid CNPJ.",
      service: "Select at least one service.",
      submit: "We could not send it. Try again or call the number on the contact page.",
    },
    privacy: {
      ...ptQuoteForm.privacy,
      before: "We use the data only to respond to the quote. Read the ",
      link: "privacy policy",
      after: ".",
    },
    success: {
      title: "We received the request",
      body: "We registered the request. Our team reviews the demand and replies with a proposal by email, WhatsApp or phone.",
      close: "Close",
    },
  },
  notFoundCopy: {
    ...ptNotFound,
    eyebrow: "Page not found",
    title: "We could not find this page",
    description: "This address does not exist on the site. Go home or choose a service.",
    homeCta: { ...ptNotFound.homeCta, label: "Go to the home page" },
  },
};
