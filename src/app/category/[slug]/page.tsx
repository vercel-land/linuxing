import { eq, sql, and, or, inArray } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/package-card";
import { db } from "@/db";
import { categories, commands, distros, packages, packageTags, tags } from "@/db/schema";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string; distro?: string }>;
}

async function getCategoryData(slug: string, tagFilter?: string, distroFilter?: string) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .then((rows) => rows[0]);

  if (!category) return null;

  // Build the query for packages in this category
  let query = db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      description: packages.description,
    })
    .from(packages)
    .where(eq(packages.categoryId, category.id))
    .prepare();

  // If we have filters, we need a more complex query. 
  // For simplicity with Drizzle and current schema, we'll fetch all and filter in memory if needed, 
  // or build better queries if we had more complex needs.
  // But let's try to be efficient.

  let packageIds: number[] | null = null;

  if (tagFilter) {
    const taggedPackageIds = await db
      .select({ packageId: packageTags.packageId })
      .from(packageTags)
      .innerJoin(tags, eq(packageTags.tagId, tags.id))
      .where(eq(tags.name, tagFilter));
    
    packageIds = taggedPackageIds.map(p => p.packageId);
    if (packageIds.length === 0) return { category, packages: [], allTags: [], allDistros: [] };
  }

  if (distroFilter) {
    const distroPackageIds = await db
      .select({ packageId: commands.packageId })
      .from(commands)
      .innerJoin(distros, eq(commands.distroId, distros.id))
      .where(eq(distros.slug, distroFilter));
    
    const ids = distroPackageIds.map(p => p.packageId);
    if (packageIds) {
      packageIds = packageIds.filter(id => ids.includes(id));
    } else {
      packageIds = ids;
    }
    if (packageIds && packageIds.length === 0) return { category, packages: [], allTags: [], allDistros: [] };
  }

  const categoryPackages = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      description: packages.description,
    })
    .from(packages)
    .where(
      and(
        eq(packages.categoryId, category.id),
        packageIds ? inArray(packages.id, packageIds) : undefined
      )
    );

  const packagesWithDetails = await Promise.all(
    categoryPackages.map(async (pkg) => {
      const distroResult = await db
        .select({ count: sql<number>`count(distinct ${commands.distroId})` })
        .from(commands)
        .where(eq(commands.packageId, pkg.id));
      
      const tagResult = await db
        .select({ name: tags.name })
        .from(tags)
        .innerJoin(packageTags, eq(tags.id, packageTags.tagId))
        .where(eq(packageTags.packageId, pkg.id));

      return {
        ...pkg,
        distroCount: Number(distroResult[0]?.count || 0),
        tags: tagResult.map(t => t.name),
      };
    }),
  );

  // Fetch all tags and distros for filtering
  const allTags = await db.select().from(tags);
  const allDistros = await db.select().from(distros);

  return { category, packages: packagesWithDetails, allTags, allDistros };
}

export async function generateStaticParams() {
  const allCategories = await db
    .select({ slug: categories.slug })
    .from(categories);
  return allCategories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tag, distro } = await searchParams;
  const data = await getCategoryData(slug, tag, distro);

  if (!data) {
    notFound();
  }

  const { category, packages: categoryPackages, allTags, allDistros } = data;

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-7xl">
      <nav className="mb-12 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Filter by Tag
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <Link
                href={`/category/${slug}${distro ? `?distro=${distro}` : ""}`}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted",
                  !tag ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                All Tags
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t.id}
                  href={`/category/${slug}?tag=${t.name}${distro ? `&distro=${distro}` : ""}`}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted",
                    tag === t.name ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Distro Support
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <Link
                href={`/category/${slug}${tag ? `?tag=${tag}` : ""}`}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted",
                  !distro ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                All Distros
              </Link>
              {allDistros.map((d) => (
                <Link
                  key={d.id}
                  href={`/category/${slug}?distro=${d.slug}${tag ? `&tag=${tag}` : ""}`}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted",
                    distro === d.slug ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {category.description}
              </p>
            )}
          </header>

          {(tag || distro) && (
            <div className="mb-8 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {tag && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    #{tag}
                    <Link href={`/category/${slug}${distro ? `?distro=${distro}` : ""}`} className="ml-2 hover:text-foreground">×</Link>
                  </Badge>
                )}
                {distro && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {allDistros.find(d => d.slug === distro)?.name}
                    <Link href={`/category/${slug}${tag ? `?tag=${tag}` : ""}`} className="ml-2 hover:text-foreground">×</Link>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {categoryPackages.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center bg-muted/20">
              <p className="text-xl text-muted-foreground font-medium mb-2">
                No matching packages found in this category.
              </p>
              <p className="text-sm text-muted-foreground/60">
                Try adjusting your filters or browsing all tags.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {categoryPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  name={pkg.name}
                  slug={pkg.slug}
                  description={pkg.description}
                  distroCount={pkg.distroCount}
                  tags={pkg.tags}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
