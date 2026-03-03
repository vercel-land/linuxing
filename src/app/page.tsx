import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, packages } from "@/db/schema";
import { CategoryCard } from "./_components/category-card";

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
    <div className="flex min-h-screen flex-col">
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Find the right command for your distro
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Search for any tool, pick your Linux distribution, and copy the
          install command. Done.
        </p>
      </section>

      <section className="container mx-auto flex-1 px-4 pb-20">
        <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
