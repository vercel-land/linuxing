import { db } from "@/db";
import { packages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getPackages() {
  return await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      categoryName: categories.name,
      createdAt: packages.createdAt,
    })
    .from(packages)
    .leftJoin(categories, eq(packages.categoryId, categories.id));
}

export default async function AdminPackagesPage() {
  const allPackages = await getPackages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">
            Manage your command repository and their distributions.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">
            <Plus className="mr-2 h-4 w-4" /> Add Package
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-bold">{pkg.name}</TableCell>
                <TableCell className="font-mono text-xs">{pkg.slug}</TableCell>
                <TableCell>{pkg.categoryName || "Uncategorized"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {pkg.createdAt?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="View on site">
                      <Link href={`/package/${pkg.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/packages/${pkg.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
