import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { commands, packages, packageTags, tags } from "@/db/schema";
import { PackageCard } from "@/components/package-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getTagWithPackages(slug: string) {
  const tag = await db
    .select()
    .from(tags)
    .where(eq(tags.name, slug)) // Using name as slug for tags based on seed data
    .then((rows) => rows[0]);

  if (!tag) return null;

  const tagPackages = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      description: packages.description,
    })
    .from(packages)
    .innerJoin(packageTags, eq(packages.id, packageTags.packageId))
    .where(eq(packageTags.tagId, tag.id));

  const packagesWithDetails = await Promise.all(
    tagPackages.map(async (pkg) => {
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

  return { tag, packages: packagesWithDetails };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTagWithPackages(slug);
  if (!data) return {};

  return {
    title: `Packages tagged "${data.tag.name}" | Rosetta`,
    description: `Browse all Linux packages tagged with ${data.tag.name}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTagWithPackages(slug);

  if (!data) notFound();

  const { tag, packages: tagPackages } = data;

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-6xl">
      <nav className="mb-12 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Tags</span>
        <span>/</span>
        <span className="text-foreground font-medium">{tag.name}</span>
      </nav>

      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <span className="text-sm font-bold tracking-widest uppercase text-primary">
            Tag Discovery
          </span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter lg:text-6xl mb-6">
          #{tag.name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Showing all packages tagged with <span className="text-foreground font-semibold">#{tag.name}</span>. 
          Found {tagPackages.length} matching entries.
        </p>
      </header>

      {tagPackages.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center bg-muted/20">
          <p className="text-xl text-muted-foreground font-medium mb-2">
            No packages found with this tag.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tagPackages.map((pkg) => (
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
  );
}
