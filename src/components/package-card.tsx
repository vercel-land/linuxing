import Link from "next/link";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  name: string;
  slug: string;
  description?: string | null;
  distroCount: number;
}

export function PackageCard({
  name,
  slug,
  description,
  distroCount,
}: PackageCardProps) {
  return (
    <Link
      href={`/package/${slug}`}
      className={cn(
        "group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-xs text-muted-foreground">
          {distroCount} distros
        </span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}
    </Link>
  );
}
