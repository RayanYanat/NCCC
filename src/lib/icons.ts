import {
  Flame,
  Layers,
  ShieldCheck,
  Shield,
  Cylinder,
  Droplets,
  Factory,
  type LucideIcon,
} from "lucide-react";

/** Resolves a CMS-stored icon name (string) to a lucide component. */
const ICONS: Record<string, LucideIcon> = {
  Flame,
  Layers,
  ShieldCheck,
  Shield,
  Cylinder,
  Droplets,
  Factory,
};

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Shield;
}
