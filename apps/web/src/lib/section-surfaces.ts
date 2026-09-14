export type SectionSurface = "cream" | "white" | "tint" | "muted" | "dark";
export type SectionPattern = "none" | "blueprint" | "crosshair" | "dots";

/** Atmosfera no fundo — gradiente localizado, sem textura full. */
export type SectionAmbient = "none" | "diagonal" | "spotlight";

export type SectionSurfaceConfig = {
  surface: SectionSurface;
  pattern: SectionPattern;
};

export type SectionFlowKey =
  | "hero"
  | "lab-intro"
  | "services"
  | "differentials"
  | "equipment"
  | "sectors"
  | "partners"
  | "contact";

export const SECTION_FLOW_LABELS: Record<SectionFlowKey, string> = {
  hero: "Hero",
  "lab-intro": "Sobre o centro",
  services: "Serviços",
  differentials: "Diferenciais",
  equipment: "Equipamentos",
  sectors: "Setores",
  partners: "Parceiros",
  contact: "Contato",
};

export const SECTION_FLOW_SUGGESTED: Record<SectionFlowKey, SectionSurfaceConfig> = {
  hero: { surface: "cream", pattern: "none" },
  "lab-intro": { surface: "tint", pattern: "none" },
  services: { surface: "cream", pattern: "none" },
  differentials: { surface: "dark", pattern: "blueprint" },
  equipment: { surface: "white", pattern: "none" },
  sectors: { surface: "cream", pattern: "none" },
  partners: { surface: "white", pattern: "none" },
  contact: { surface: "dark", pattern: "none" },
};

export const SECTION_SURFACES: { id: SectionSurface; label: string }[] = [
  { id: "cream", label: "Off-white" },
  { id: "white", label: "Branco" },
  { id: "tint", label: "Azul claro" },
  { id: "muted", label: "Creme suave" },
  { id: "dark", label: "Azul escuro" },
];

export const SECTION_PATTERNS: { id: SectionPattern; label: string }[] = [
  { id: "none", label: "Sem textura" },
  { id: "blueprint", label: "Malha" },
  { id: "crosshair", label: "Miras +" },
  { id: "dots", label: "Pontos" },
];
