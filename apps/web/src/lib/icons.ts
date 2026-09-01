import {
  Aperture,
  BadgePercent,
  Box,
  ClipboardCheck,
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
  Printer,
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
  BadgePercent,
  Box,
  Car,
  ClipboardCheck,
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
  Printer,
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
