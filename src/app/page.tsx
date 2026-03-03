import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, packages } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";

async function getCategoriesWithCount() {
  const categoriesData = await db.select().from(categories);

  const categoriesWithCount = await Promise.all(
    categoriesData.map(async (category) => {
      const result = await db
        .select({ count: count() })
        .from(packages)
        .where(eq(packages.categoryId, category.id));
      return {
        ...category,
        packageCount: result[0]?.count || 0,
      };
    }),
  );

  return categoriesWithCount;
}

export default async function Home() {
  const categoriesWithCount = await getCategoriesWithCount();

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-background via-background/95 to-background">
      <section className="relative flex flex-col items-center justify-center gap-6 overflow-hidden py-20 text-center sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
        >
          <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        </div>
        <div className="container relative mx-auto px-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/80">
            Linuxing
          </p>
          <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Find the right command
            <span className="block bg-linear-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              for your distro
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            Stop digging through outdated forum threads. Browse curated tools,
            pick your distro, and copy the exact install command in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full px-6 shadow-lg shadow-primary/20 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <a href="#categories">Browse categories</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border/70 bg-background/60 backdrop-blur-sm"
              disabled
            >
              Cmd+K search soon
            </Button>
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="container mx-auto flex-1 px-4 pb-20 pt-4 sm:pt-0"
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Browse by category
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore popular areas like development tools, system utilities,
              and more.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCount.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              slug={category.slug}
              description={category.description}
              icon={category.icon}
              packageCount={category.packageCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
