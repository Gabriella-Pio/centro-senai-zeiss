import {
  Aperture,
  Box,
  Clock,
  Cpu,
  Factory,
  HeartPulse,
  Layers,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plane,
  Ruler,
  Scan,
  ShieldCheck,
  Target,
  Thermometer,
  Users,
  Car,
  type LucideIcon,
} from "lucide-react";

const icons = {
  Aperture,
  Box,
  Car,
  Clock,
  Cpu,
  Factory,
  HeartPulse,
  Layers,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plane,
  Ruler,
  Scan,
  ShieldCheck,
  Target,
  Thermometer,
  Users,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function getIcon(name: string | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return icons[name as IconName];
}
