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
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        {IconComponent && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {packageCount} packages
          </p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}
    </Link>
  );
}
