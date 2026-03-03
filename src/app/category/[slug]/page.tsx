import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/package-card";
import { db } from "@/db";
import { categories, commands, distros, packages } from "@/db/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryWithPackages(slug: string) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .then((rows) => rows[0]);

  if (!category) {
    return null;
  }

  const categoryPackages = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      description: packages.description,
    })
    .from(packages)
    .where(eq(packages.categoryId, category.id));

  const packagesWithDistroCount = await Promise.all(
    categoryPackages.map(async (pkg) => {
      const result = await db
        .select({ count: sql<number>`count(distinct ${commands.distroId})` })
        .from(commands)
        .where(eq(commands.packageId, pkg.id));
      return {
        ...pkg,
        distroCount: Number(result[0]?.count || 0),
      };
    }),
  );

  return { category, packages: packagesWithDistroCount };
}

export async function generateStaticParams() {
  const allCategories = await db
    .select({ slug: categories.slug })
    .from(categories);
  return allCategories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCategoryWithPackages(slug);

  if (!data) {
    notFound();
  }

  const { category, packages: categoryPackages } = data;

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </header>

      {categoryPackages.length === 0 ? (
        <p className="text-muted-foreground">
          No packages in this category yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              name={pkg.name}
              slug={pkg.slug}
              description={pkg.description}
              distroCount={pkg.distroCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
