import { SEED_RECORDS } from "@/lib/demo-store-seed";

export const DEMO_EQUIPMENT = [
  "CMM ZEISS CONTURA",
  "Scanner 3D ATOS",
  "Tomógrafo industrial",
  "Sala climatizada",
] as const;

export const DEMO_RECORDS = SEED_RECORDS.slice(0, 2);
