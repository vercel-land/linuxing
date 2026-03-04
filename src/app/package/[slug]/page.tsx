import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { categories, commands, distros, packages, packageTags, tags } from "@/db/schema";
import { DistroTabs } from "@/components/distro-tabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPackageWithCommands(slug: string) {
  const pkg = await db
    .select()
    .from(packages)
    .where(eq(packages.slug, slug))
    .then((rows) => rows[0]);

  if (!pkg) {
    return null;
  }

  const category = pkg.categoryId
    ? await db
        .select()
        .from(categories)
        .where(eq(categories.id, pkg.categoryId))
        .then((rows) => rows[0])
    : null;

  const packageCommands = await db
    .select({
      id: commands.id,
      installCommand: commands.installCommand,
      uninstallCommand: commands.uninstallCommand,
      packageManager: commands.packageManager,
      notes: commands.notes,
      verified: commands.verified,
      distroName: distros.name,
      distroSlug: distros.slug,
    })
    .from(commands)
    .innerJoin(distros, eq(commands.distroId, distros.id))
    .where(eq(commands.packageId, pkg.id));

  const packageTagsList = await db
    .select({ name: tags.name })
    .from(tags)
    .innerJoin(packageTags, eq(tags.id, packageTags.tagId))
    .where(eq(packageTags.packageId, pkg.id));

  return { pkg, category, commands: packageCommands, tags: packageTagsList.map(t => t.name) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPackageWithCommands(slug);
  
  if (!data) return {};

  const { pkg } = data;
  return {
    title: `${pkg.name} | Rosetta`,
    description: pkg.description || `Install ${pkg.name} on your Linux distro with one command.`,
    openGraph: {
      title: `${pkg.name} | Rosetta`,
      description: pkg.description || `Install ${pkg.name} on your Linux distro with one command.`,
    },
  };
}

export async function generateStaticParams() {
  const allPackages = await db.select({ slug: packages.slug }).from(packages);
  return allPackages.map((p) => ({ slug: p.slug }));
}

export default async function PackagePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPackageWithCommands(slug);

  if (!data) {
    notFound();
  }

  const { pkg, category, commands: packageCommands, tags: packageTagsList } = data;

  const commandsByDistro = packageCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.distroSlug]) {
        acc[cmd.distroSlug] = {
          distroName: cmd.distroName,
          commands: [],
        };
      }
      acc[cmd.distroSlug].commands.push(cmd);
      return acc;
    },
    {} as Record<
      string,
      { distroName: string; commands: typeof packageCommands }
    >,
  );

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-5xl">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{pkg.name}</span>
      </nav>

      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {packageTagsList.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
              {pkg.name}
            </h1>
            {pkg.description && (
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {pkg.description}
              </p>
            )}
          </div>
          {pkg.homepageUrl && (
            <div className="shrink-0 pb-1">
              <a
                href={pkg.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary/10 px-6 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
              >
                Official Website
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="mt-12">
        {Object.keys(commandsByDistro).length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <p className="text-lg text-muted-foreground font-medium">
              No install commands available yet for this package.
            </p>
          </div>
        ) : (
          <DistroTabs commandsByDistro={commandsByDistro} />
        )}
      </div>
    </div>
  );
}
