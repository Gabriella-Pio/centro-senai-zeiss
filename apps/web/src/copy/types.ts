export type SectionCopy = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type CtaCopy = {
  label: string;
  href: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon?: string;
  /** Foto de equipamento/peça, quando o laboratório autorizar. Sem arquivo, o bloco usa o ícone. */
  image?: string;
};

export type LinkCardItem = {
  title: string;
  description: string;
  href: string;
  icon?: string;
};

export type ActionCardItem = {
  title: string;
  description: string;
  primaryCta: CtaCopy;
  secondaryCta: CtaCopy;
};

export type InfoCardItem = {
  title: string;
  value: string;
  icon: string;
};

export type ServiceContent = {
  id: string;
  label: string;
  shortDescription: string;
  description: string;
  applications: string[];
  audience: string;
  icon: string;
};

export type FieldCopy = {
  label: string;
  placeholder: string;
};
