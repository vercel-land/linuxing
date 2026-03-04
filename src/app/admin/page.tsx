import { db } from "@/db";
import { packages, categories, distros, tags } from "@/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Layers, Globe, Tag, ArrowUpRight } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [packageCount] = await db.select({ value: count() }).from(packages);
  const [categoryCount] = await db.select({ value: count() }).from(categories);
  const [distroCount] = await db.select({ value: count() }).from(distros);
  const [tagCount] = await db.select({ value: count() }).from(tags);

  return [
    { name: "Total Packages", value: packageCount.value, icon: Package, href: "/admin/packages", color: "text-blue-500" },
    { name: "Categories", value: categoryCount.value, icon: Layers, href: "/admin/categories", color: "text-purple-500" },
    { name: "Distributions", value: distroCount.value, icon: Globe, href: "/admin/distros", color: "text-green-500" },
    { name: "Tags", value: tagCount.value, icon: Tag, href: "/admin/tags", color: "text-orange-500" },
  ];
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Rosetta content repository.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-2 border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
          <p className="text-sm text-muted-foreground mb-6">Need to add a new command quickly?</p>
          <Link
            href="/admin/packages/new"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            ADD NEW PACKAGE
          </Link>
        </Card>
        
        <Card className="rounded-3xl border-2 border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground mb-6">Learn how to manage the content effectively.</p>
          <Link
            href="/guide"
            className="inline-flex h-10 items-center justify-center rounded-full border-2 border-border bg-transparent px-6 text-xs font-bold transition-all hover:bg-muted"
          >
            VIEW GUIDES
          </Link>
        </Card>
      </div>
    </div>
  );
}
