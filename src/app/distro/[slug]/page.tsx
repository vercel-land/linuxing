import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { commands, distros, packages, packageTags, tags } from "@/db/schema";
import { PackageCard } from "@/components/package-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDistroWithPackages(slug: string) {
  const distro = await db
    .select()
    .from(distros)
    .where(eq(distros.slug, slug))
    .then((rows) => rows[0]);

  if (!distro) return null;

  const distroPackages = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      description: packages.description,
    })
    .from(packages)
    .innerJoin(commands, eq(packages.id, commands.packageId))
    .where(eq(commands.distroId, distro.id))
    .groupBy(packages.id);

  const packagesWithDetails = await Promise.all(
    distroPackages.map(async (pkg) => {
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

  return { distro, packages: packagesWithDetails };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getDistroWithPackages(slug);
  if (!data) return {};

  return {
    title: `${data.distro.name} Packages | Rosetta`,
    description: `Browse all available packages and install commands for ${data.distro.name}.`,
  };
}

export default async function DistroPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getDistroWithPackages(slug);

  if (!data) notFound();

  const { distro, packages: distroPackages } = data;

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-6xl">
      <nav className="mb-12 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/distro" className="hover:text-foreground transition-colors">
          Distributions
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{distro.name}</span>
      </nav>

      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted p-4 shadow-inner">
              {distro.iconUrl ? (
                <img
                  src={distro.iconUrl}
                  alt={distro.name}
                  className="h-full w-full object-contain grayscale-[0.5] group-hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="text-3xl font-black text-muted-foreground uppercase">
                  {distro.name[0]}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-black tracking-tighter lg:text-6xl">
              {distro.name}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            All packages currently available for the <span className="text-foreground font-semibold">{distro.family}</span> family
            of distributions on Rosetta.
          </p>
        </div>
        <div className="shrink-0">
          <div className="rounded-full bg-primary/5 px-6 py-3 border border-primary/10">
            <span className="text-sm font-bold text-primary tracking-tight">
              {distroPackages.length} PACKAGES SUPPORTED
            </span>
          </div>
        </div>
      </header>

      {distroPackages.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center bg-muted/20">
          <p className="text-xl text-muted-foreground font-medium mb-2">
            No packages found for this distribution.
          </p>
          <p className="text-sm text-muted-foreground/60">
            We're constantly adding new commands. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {distroPackages.map((pkg) => (
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
