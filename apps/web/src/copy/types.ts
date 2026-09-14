export type SectionCopy = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type CtaCopy = {
  label: string;
  href: string;
};

export type PartnerLogo = {
  name: string;
  /** Omita quando não houver logo oficial — exibe o nome em tipografia institucional. */
  logoSrc?: string;
  logoAlt?: string;
  /** Logo horizontal — altura menor, largura maior. */
  wide?: boolean;
  /** Linha auxiliar sob o logo ou o wordmark (ex.: unidade). */
  caption?: string;
  href?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Instituição ou unidade (ex.: FIEG, ZEISS). */
  org?: string;
  /** Linha curta sob o cargo (ex.: In memoriam). */
  note?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  /** Dado em destaque no card (ex.: 0,9µm). */
  value?: string;
  icon?: string;
  /** Foto de equipamento/peça, quando o laboratório autorizar. Sem arquivo, o bloco usa o ícone. */
  image?: string;
  imageAlt?: string;
  /** contain: recorte de produto em fundo branco. cover: foto de sala. */
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  /** Rótulo curto do tipo de ensaio (ex.: Medição óptica). */
  tag?: string;
  href?: string;
};

/** Setor industrial atendido — tile com ícone e links para serviços relacionados. */
export type SectorItem = FeatureItem & {
  id: string;
  relatedServices: string[];
};

export type LinkCardItem = {
  title: string;
  description: string;
  href: string;
  icon?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

export type ActionCardItem = {
  title: string;
  description: string;
  primaryCta: CtaCopy;
  secondaryCta: CtaCopy;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

export type InfoCardItem = {
  title: string;
  value: string;
  icon: string;
  href?: string;
};

export type ServiceContent = {
  id: string;
  label: string;
  shortDescription: string;
  description: string;
  applications: string[];
  audience: string;
  icon: string;
  /** Foto no card da home (opcional). Sem arquivo, o card usa o ícone. */
  cardImage?: string;
  cardImageAlt?: string;
  cardImageFit?: "cover" | "contain";
  cardImagePosition?: string;
};

export type FieldCopy = {
  label: string;
  placeholder: string;
};
