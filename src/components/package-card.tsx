import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  name: string;
  slug: string;
  description?: string | null;
  distroCount: number;
  tags?: string[];
}

export function PackageCard({
  name,
  slug,
  description,
  distroCount,
  tags = [],
}: PackageCardProps) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/package/${slug}`} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex items-start justify-between">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">
          {name}
        </h3>
        <Badge variant="secondary" className="font-mono text-[10px] px-2 py-0 bg-primary/5 text-primary border-primary/10">
          {distroCount} DISTROS
        </Badge>
      </div>

      {description && (
        <p className="relative z-10 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
          {description}
        </p>
      )}

      <div className="relative z-10 mt-auto pt-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors uppercase tracking-wider"
            >
              #{tag}
            </Link>
          ))}
          {tags.length > 2 && (
            <span className="text-[10px] text-muted-foreground font-medium">+{tags.length - 2} more</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild title="Compare">
            <Link href={`/compare?a=${slug}`}>
              <ArrowRightLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
