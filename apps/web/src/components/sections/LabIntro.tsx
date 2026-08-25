import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const stats = [
  { value: "±0,001mm", label: "Precisão de medição" },
  { value: "100%", label: "Rastreabilidade metrológica" },
  { value: "4", label: "Áreas de atuação" },
];

export function LabIntro() {
  return (
    <Section variant="default">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <Eyebrow>Sobre o laboratório</Eyebrow>
          <h2 className="text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
            Precisão alemã, aplicada à indústria brasileira
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
            O Centro de Excelência em Metrologia SENAI × ZEISS reúne
            equipamentos de última geração e uma equipe técnica dedicada para
            oferecer medições dimensionais de alta precisão, engenharia
            reversa e inspeção industrial não destrutiva — apoiando empresas
            que precisam de confiabilidade absoluta em cada medição.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 p-6 bg-card ring-1 ring-foreground/10"
            >
              <span className="text-display-sm font-bold text-accent">{stat.value}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
