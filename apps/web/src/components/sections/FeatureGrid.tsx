import {
  Target,
  ShieldCheck,
  Cpu,
  Users,
  Thermometer,
  Scan,
  Ruler,
  PackageCheck,
  Box,
  Aperture,
  Layers,
  MoveDiagonal,
  Car,
  Plane,
  HeartPulse,
  Factory,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FeatureItem } from "@/data/home-content";

// Mapa central de ícones — assim o conteúdo em data/home-content.ts guarda só
// o nome (string) do ícone, sem depender de importar componentes React.
const iconMap: Record<string, LucideIcon> = {
  Target,
  ShieldCheck,
  Cpu,
  Users,
  Thermometer,
  Scan,
  Ruler,
  PackageCheck,
  Box,
  Aperture,
  Layers,
  MoveDiagonal,
  Car,
  Plane,
  HeartPulse,
  Factory,
};

interface FeatureGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FeatureItem[];
  variant?: "default" | "muted" | "surface";
}

export function FeatureGrid({ eyebrow, title, description, items, variant = "default" }: FeatureGridProps) {
  return (
    <Section variant={variant}>
      <Container className="flex flex-col gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Card key={item.title} className="p-2 hover:ring-accent/40 transition-all">
                <CardHeader className="gap-3">
                  <div className="w-11 h-11 flex items-center justify-center bg-primary/10 text-accent">
                    {Icon && <Icon size={22} strokeWidth={1.75} />}
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
