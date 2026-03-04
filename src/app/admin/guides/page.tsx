import { db } from "@/db";
import { guides, distros } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink, BookOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getGuides() {
  return await db
    .select({
      id: guides.id,
      title: guides.title,
      slug: guides.slug,
      distroName: distros.name,
      createdAt: guides.createdAt,
    })
    .from(guides)
    .leftJoin(distros, eq(guides.distroId, distros.id));
}

export default async function AdminGuidesPage() {
  const allGuides = await getGuides();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" /> Guides
          </h1>
          <p className="text-muted-foreground">
            Create and manage step-by-step Markdown guides.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/guides/new">
            <Plus className="mr-2 h-4 w-4" /> Add Guide
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Distro</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allGuides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell className="font-bold">{guide.title}</TableCell>
                <TableCell className="font-mono text-xs">{guide.slug}</TableCell>
                <TableCell>
                  {guide.distroName ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                      {guide.distroName}
                    </span>
                  ) : (
                    "General"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {guide.createdAt?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="View on site">
                      <Link href={`/guide/${guide.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/guides/${guide.id}`}>
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
