import type { FeatureItem, SectionCopy } from "@/copy/types";

export const equipmentHeading: SectionCopy = {
  eyebrow: "Nosso parque",
  title: "As máquinas ZEISS de cada ensaio",
  description:
    "Cada máquina tem um papel. Na prática, um serviço pode combinar várias — escolhemos o conjunto para a peça e o relatório.",
};

export const equipment: FeatureItem[] = [
  {
    title: "ZEISS PRISMO",
    tag: "Medição por apalpação",
    description:
      "CMM de alta precisão para geometria complexa, tolerâncias apertadas e volumes de medição maiores.",
    icon: "Box",
    image: "/equipment/prismo.png",
    imageAlt: "Máquina de coordenadas ZEISS PRISMO.",
    imageFit: "contain",
    href: "/services/controle-qualidade-dimensional",
  },
  {
    title: "ZEISS DuraMax",
    tag: "Medição por apalpação",
    description:
      "CMM robusta para o chão de fábrica — peças usinadas, dispositivos e ferramental.",
    icon: "Box",
    image: "/equipment/duramax.png",
    imageAlt: "Máquina de coordenadas ZEISS DuraMax.",
    imageFit: "contain",
    href: "/services/controle-qualidade-dimensional",
  },
  {
    title: "ZEISS O-Inspect",
    tag: "Medição óptica",
    description:
      "Medição por imagem para características de difícil acesso ao apalpador e controle visual.",
    icon: "Aperture",
    image: "/equipment/o-inspect.png",
    imageAlt: "Sistema óptico ZEISS O-Inspect.",
    imageFit: "contain",
    href: "/services/controle-qualidade-dimensional",
  },
  {
    title: "ZEISS ATOS Q",
    tag: "Escaneamento de alta precisão",
    description:
      "Digitalização 3D no laboratório — superfícies complexas, peça–CAD e engenharia reversa.",
    icon: "Scan",
    image: "/equipment/atosq.png",
    imageAlt: "Scanner ZEISS ATOS Q.",
    imageFit: "contain",
    href: "/services/digitalizacao-engenharia-reversa",
  },
  {
    title: "ZEISS T-SCAN hawk 2",
    tag: "Escaneamento in loco",
    description:
      "Scanner portátil para peças grandes ou quando a peça não pode vir até nós.",
    icon: "Scan",
    image: "/equipment/t-scan-hawk-2.png",
    imageAlt: "Scanner portátil ZEISS T-SCAN hawk 2.",
    imageFit: "contain",
    href: "/services/digitalizacao-engenharia-reversa",
  },
  {
    title: "ZEISS BOSELLO MAX",
    tag: "Tomografia / raio-X",
    description:
      "Inspeção interna não destrutiva — porosidade, trincas, montagens ocultas.",
    icon: "Layers",
    image: "/equipment/bosello-max.png",
    imageAlt: "Sistema ZEISS BOSELLO MAX.",
    imageFit: "contain",
    href: "/services/inspecao-interna",
  },
];

export const equipmentCatalogCta = {
  label: "Ver todos os serviços",
  href: "/services",
};

export const equipmentCard = {
  usedIn: "Usado em",
};
