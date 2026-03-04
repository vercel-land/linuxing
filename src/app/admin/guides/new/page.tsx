import { db } from "@/db";
import { distros } from "@/db/schema";
import { GuideForm } from "../guide-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

async function getDistros() {
  return await db.select({ id: distros.id, name: distros.name }).from(distros);
}

export default async function NewGuidePage() {
  const allDistros = await getDistros();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <nav>
        <Link
          href="/admin/guides"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          BACK TO GUIDES
        </Link>
      </nav>

      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Create New Guide</h1>
        <p className="text-muted-foreground">
          Write a new step-by-step Linux guide using Markdown.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
        <GuideForm distros={allDistros} />
      </div>
    </div>
  );
}
