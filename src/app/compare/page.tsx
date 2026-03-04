import { db } from "@/db";
import { packages, commands, distros } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { PackageCard } from "@/components/package-card";
import { DistroTabs } from "@/components/distro-tabs";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function getPackageData(slugs: string[]) {
  if (slugs.length === 0) return [];
  
  const pkgData = await db.query.packages.findMany({
    where: (packages, { inArray }) => inArray(packages.slug, slugs),
    with: {
      commands: {
        with: {
          distro: true,
        },
      },
    },
  });

  return pkgData;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;
  const slugs = [a, b].filter(Boolean) as string[];
  
  const compareData = await getPackageData(slugs);

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-7xl">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-black tracking-tight lg:text-6xl mb-6">
          Compare Packages
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          See how different tools stack up across various distributions.
        </p>
      </header>

      {slugs.length < 2 ? (
        <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center bg-muted/20">
          <p className="text-xl text-muted-foreground font-medium mb-4">
            Select two packages to compare.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/category/development-tools"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              BROWSE PACKAGES
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-2">
          {compareData.map((pkg) => {
             const commandsByDistro = pkg.commands.reduce(
                (acc, cmd) => {
                  if (!acc[cmd.distro.slug]) {
                    acc[cmd.distro.slug] = {
                      distroName: cmd.distro.name,
                      commands: [],
                    };
                  }
                  acc[cmd.distro.slug].commands.push({
                    ...cmd,
                    distroName: cmd.distro.name,
                    distroSlug: cmd.distro.slug,
                  });
                  return acc;
                },
                {} as any
              );

            return (
              <div key={pkg.id} className="space-y-8">
                <div className="rounded-3xl border bg-card p-8 shadow-sm">
                  <h2 className="text-3xl font-black mb-4">{pkg.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {pkg.description}
                  </p>
                  <div className="flex items-center gap-4">
                     <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                        {pkg.commands.length} COMMANDS
                     </span>
                     {pkg.homepageUrl && (
                        <a href={pkg.homepageUrl} target="_blank" className="text-sm font-bold hover:underline">
                           Website ↗
                        </a>
                     )}
                  </div>
                </div>

                <DistroTabs commandsByDistro={commandsByDistro} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
