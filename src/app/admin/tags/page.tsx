import { db } from "@/db";
import { tags } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminTagsPage() {
  const allTags = await db.select().from(tags);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" /> Tags
          </h1>
          <p className="text-muted-foreground">Manage package classification tags.</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" /> Add Tag
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTags.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground text-xs">{t.id}</TableCell>
                <TableCell className="font-bold">#{t.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" disabled>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" disabled>
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
