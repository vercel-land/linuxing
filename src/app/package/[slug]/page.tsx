import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, commands, distros, packages } from "@/db/schema";
import { CopyButton } from "./copy-button";

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

  return { pkg, category, commands: packageCommands };
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

  const { pkg, category, commands: packageCommands } = data;

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
    <div className="container mx-auto min-h-screen px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{pkg.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{pkg.name}</h1>
        {pkg.description && (
          <p className="text-muted-foreground">{pkg.description}</p>
        )}
        {pkg.homepageUrl && (
          <a
            href={pkg.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Official Website
          </a>
        )}
      </header>

      {Object.keys(commandsByDistro).length === 0 ? (
        <p className="text-muted-foreground">
          No install commands available yet.
        </p>
      ) : (
        <div className="space-y-8">
          {Object.entries(commandsByDistro).map(
            ([distroSlug, { distroName, commands: cmds }]) => (
              <div
                key={distroSlug}
                className="rounded-xl border border-border bg-card"
              >
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-lg font-semibold">{distroName}</h2>
                </div>
                <div className="divide-y divide-border">
                  {cmds.map((cmd) => (
                    <div key={cmd.id} className="px-6 py-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">
                          {cmd.packageManager}
                        </span>
                        {cmd.verified && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <p className="mb-1 text-xs text-muted-foreground">
                          Install
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
                            {cmd.installCommand}
                          </code>
                          <CopyButton text={cmd.installCommand} />
                        </div>
                      </div>
                      {cmd.uninstallCommand && (
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">
                            Uninstall
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
                              {cmd.uninstallCommand}
                            </code>
                            <CopyButton text={cmd.uninstallCommand} />
                          </div>
                        </div>
                      )}
                      {cmd.notes && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {cmd.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
