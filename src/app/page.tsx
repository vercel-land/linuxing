import { count, eq } from "drizzle-orm";
import { ArrowRight, Copy, Terminal, Github } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/category-card";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { categories, packages } from "@/db/schema";

async function getCategoriesWithCount() {
  const allCategories = await db.select().from(categories);

  const categoriesWithCount = await Promise.all(
    allCategories.map(async (category) => {
      const [result] = await db
        .select({ value: count() })
        .from(packages)
        .where(eq(packages.categoryId, category.id));

      return {
        ...category,
        packageCount: result.value,
      };
    }),
  );

  return categoriesWithCount;
}

export default async function Home() {
  const categoriesWithCount = await getCategoriesWithCount();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now supporting over 500+ commands
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Master your Linux <br />
            <span className="text-primary">Environment.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed md:text-xl">
            Stop digging through outdated forums. Find the right command for
            your distro, copy it, and get back to work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 rounded-full text-base group"
              asChild
            >
              <Link href="/category/development-tools">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full text-base"
              asChild
            >
              <Link href="/distro">Browse Distros</Link>
            </Button>
          </div>

          {/* Feature Highlight Mockup */}
          <div className="mt-20 max-w-4xl mx-auto rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 text-center text-xs font-mono text-muted-foreground">
                bash — install nodejs
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border group">
                  <div className="flex items-center gap-3 font-mono text-sm overflow-hidden">
                    <span className="text-primary shrink-0">$</span>
                    <code className="truncate">sudo pacman -S nodejs</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded bg-blue-500/10 text-[10px] font-bold text-blue-500 uppercase">
                    Arch
                  </div>
                  <div className="px-2 py-1 rounded bg-orange-500/10 text-[10px] font-bold text-orange-500 uppercase">
                    Ubuntu
                  </div>
                  <div className="px-2 py-1 rounded bg-red-500/10 text-[10px] font-bold text-red-500 uppercase">
                    Fedora
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-2 items-center text-center max-w-[180px]">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Terminal className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-semibold">Copy & Paste</span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Zero fluff. Just the commands you need.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Popular Categories
              </h2>
              <p className="text-muted-foreground">
                Browse our curated collections of tools and utilities.
              </p>
            </div>
            <Button variant="ghost" className="group" asChild>
              <Link href="/category">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoriesWithCount.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                description={category.description || ""}
                icon={category.icon || "Package"}
                packageCount={category.packageCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Community CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-8 flex justify-center">
            <div className="flex -space-x-3 overflow-hidden p-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted border border-border"
                />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            Community Driven
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Linuxing is built by enthusiasts for the community. All commands are
            verified by contributors to ensure they work on the latest releases.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              Contribute on GitHub
            </Button>
            <Button
              variant="link"
              className="text-muted-foreground hover:text-foreground"
            >
              Learn about our verification process
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
