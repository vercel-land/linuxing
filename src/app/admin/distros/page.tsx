import { db } from "@/db";
import { distros } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminDistrosPage() {
  const allDistros = await db.select().from(distros);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" /> Distributions
          </h1>
          <p className="text-muted-foreground">Manage supported Linux distributions.</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" /> Add Distro
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Family</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allDistros.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center p-1">
                    {d.iconUrl ? (
                      <img src={d.iconUrl} alt={d.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold">{d.name[0]}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{d.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{d.slug}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {d.family}
                  </span>
                </TableCell>
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
