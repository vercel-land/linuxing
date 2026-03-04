import { db } from "@/db";
import { guides, distros } from "@/db/schema";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eq } from "drizzle-orm";

async function getGuides() {
  return await db
    .select({
      id: guides.id,
      title: guides.title,
      slug: guides.slug,
      distroName: distros.name,
      distroSlug: distros.slug,
    })
    .from(guides)
    .leftJoin(distros, eq(guides.distroId, distros.id));
}

export const metadata = {
  title: "Linux Quick Start Guides",
  description: "Focused guides to get you up and running with your favorite Linux distribution.",
};

export default async function GuidesPage() {
  const allGuides = await getGuides();

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-6xl">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          LEARN & CONFIGURE
        </div>
        <h1 className="text-4xl font-black tracking-tight lg:text-6xl mb-6">
          Quick Start Guides
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Hand-picked, step-by-step guides to help you set up your Linux system like a pro.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {allGuides.map((guide) => (
          <Link key={guide.id} href={`/guide/${guide.slug}`} className="group">
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl bg-card/50 backdrop-blur-sm group-active:scale-[0.99]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  {guide.distroName && (
                    <span className="rounded-md bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {guide.distroName}
                    </span>
                  )}
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    5 MIN READ
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  Learn the essential steps to get your system ready for daily use and development.
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Read Guide <span className="ml-2">→</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
