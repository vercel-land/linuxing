import {
  Code,
  Cpu,
  Database,
  FileText,
  Globe,
  type LucideIcon,
  Monitor,
  Music,
  Package,
  Terminal,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  packageCount: number;
}

const icons: Record<string, LucideIcon> = {
  Code,
  Terminal,
  FileText,
  Monitor,
  Music,
  Package,
  Wrench,
  Cpu,
  Globe,
  Database,
};

export function CategoryCard({
  name,
  slug,
  description,
  icon,
  packageCount,
}: CategoryCardProps) {
  const IconComponent = icon ? icons[icon] : null;

  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-linear-to-b from-background/80 via-background/60 to-background/40 p-6 shadow-sm ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="absolute -inset-16 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_55%)]/[20]" />
      </div>

      <div className="relative flex items-center gap-3">
        {IconComponent && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="font-semibold tracking-tight">{name}</h3>
          <p className="text-sm text-muted-foreground/90">
            {packageCount} packages
          </p>
        </div>
      </div>

      {description && (
        <p className="relative text-sm text-muted-foreground/90 line-clamp-2">
          {description}
        </p>
      )}
    </Link>
  );
}
