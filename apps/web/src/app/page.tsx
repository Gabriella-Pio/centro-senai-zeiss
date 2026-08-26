import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { ServiceHub } from "@/components/sections/ServiceHub";
import { DifferentialsSwitch } from "@/components/sections/DifferentialsSwitch";
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
      <ServiceHub />

      <DifferentialsSwitch items={differentials} />

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
        variant="default"
      />

      <FeatureGrid
        eyebrow="Áreas de atuação"
        title="Setores que atendemos"
        items={areasOfExpertise}
        variant="default"
      />

      <LogoRow title="Certificações" items={certifications} variant="default" />
      <LogoRow title="Parceiros" items={partners} variant="default" />
    </>
  );
}
