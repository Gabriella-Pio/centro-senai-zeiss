import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { LogoRow } from "@/components/sections/LogoRow";
import {
  differentials,
  infrastructure,
  equipment,
  areasOfExpertise,
  certifications,
  partners,
} from "@/data/home-content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LabIntro />

      <FeatureGrid
        eyebrow="Diferenciais"
        title="Por que a indústria escolhe o laboratório"
        description="Cada medição passa por um processo rigoroso, do recebimento da peça à entrega do laudo."
        items={differentials}
        variant="surface"
      />

      <FeatureGrid
        eyebrow="Infraestrutura"
        title="Estrutura preparada para alta precisão"
        items={infrastructure}
        variant="default"
      />

      <FeatureGrid
        eyebrow="Equipamentos"
        title="Tecnologia ZEISS de ponta"
        items={equipment}
        variant="muted"
      />

      <FeatureGrid
        eyebrow="Áreas de atuação"
        title="Setores que atendemos"
        items={areasOfExpertise}
        variant="default"
      />

      <LogoRow title="Certificações" items={certifications} variant="surface" />
      <LogoRow title="Parceiros" items={partners} variant="muted" />
    </>
  );
}
