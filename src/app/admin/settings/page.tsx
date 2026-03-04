import { db } from "@/db";
import { settings } from "@/db/schema";
import { SettingsForm } from "./settings-form";
import { Settings as SettingsIcon } from "lucide-react";

export default async function AdminSettingsPage() {
  const allSettings = await db.select().from(settings);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="h-10 w-10 text-primary" /> Site Settings
        </h1>
        <p className="text-muted-foreground">
          Configure external services, analytics, and global site metadata.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
        <SettingsForm settings={allSettings} />
      </div>
    </div>
  );
}
