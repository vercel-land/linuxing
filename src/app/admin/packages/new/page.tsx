import { db } from "@/db";
import { categories, distros } from "@/db/schema";
import { PackageForm } from "../package-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

async function getData() {
  const allCategories = await db.select({ id: categories.id, name: categories.name }).from(categories);
  const allDistros = await db.select({ id: distros.id, name: distros.name }).from(distros);
  return { allCategories, allDistros };
}

export default async function NewPackagePage() {
  const { allCategories, allDistros } = await getData();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <nav>
        <Link
          href="/admin/packages"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          BACK TO PACKAGES
        </Link>
      </nav>

      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Add New Package</h1>
        <p className="text-muted-foreground">
          Define a new package and its installation commands for different distributions.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
        <PackageForm categories={allCategories} distros={allDistros} />
      </div>
    </div>
  );
}
