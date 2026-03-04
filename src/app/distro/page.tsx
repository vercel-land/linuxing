import { sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { commands, distros } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getDistrosWithPackageCount() {
  const result = await db
    .select({
      id: distros.id,
      name: distros.name,
      slug: distros.slug,
      iconUrl: distros.iconUrl,
      family: distros.family,
      packageCount: sql<number>`count(distinct ${commands.packageId})`,
    })
    .from(distros)
    .leftJoin(commands, sql`${distros.id} = ${commands.distroId}`)
    .groupBy(distros.id);

  return result;
}

export const metadata = {
  title: "Supported Distributions",
  description: "Browse Linux packages and commands by distribution.",
};

export default async function DistrosPage() {
  const allDistros = await getDistrosWithPackageCount();

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Pick Your Distro
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select a distribution to see all available packages and optimized
          install commands.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allDistros.map((distro) => (
          <Link key={distro.id} href={`/distro/${distro.slug}`} className="group">
            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg group-active:scale-[0.98]">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                  {distro.iconUrl ? (
                    <img
                      src={distro.iconUrl}
                      alt={distro.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {distro.name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {distro.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">
                    {distro.family} family
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available packages</span>
                  <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded text-primary">
                    {distro.packageCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
