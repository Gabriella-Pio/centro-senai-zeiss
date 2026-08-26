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
import { Card, CardHeader, CardTitle, CardContent } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import type { FeatureItem } from "@/data/home-content";

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
              <Card key={item.title} className={vitrineCardClass()}>
                <CardHeader className="gap-3">
                  <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                    {Icon && <Icon size={22} strokeWidth={1.75} />}
                  </div>
                  <CardTitle className="font-heading text-lg font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
