"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "./actions";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Setting {
  key: string;
  value: string | null;
  description: string | null;
}

export function SettingsForm({ settings }: { settings: Setting[] }) {
  const [formData, setFormData] = useState<Record<string, string>>(
    settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value || "" }), {})
  );
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateSettings(formData);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8">
        {settings.map((setting) => (
          <div key={setting.key} className="space-y-2">
            <Label htmlFor={setting.key} className="text-base font-bold">
              {setting.key.replace(/_/g, " ").toUpperCase()}
            </Label>
            <Input
              id={setting.key}
              value={formData[setting.key]}
              onChange={(e) =>
                setFormData({ ...formData, [setting.key]: e.target.value })
              }
              placeholder={`Enter ${setting.key.replace(/_/g, " ")}`}
            />
            {setting.description && (
              <p className="text-xs text-muted-foreground italic">
                {setting.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} className="rounded-full px-8 gap-2 font-bold">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "SAVE SETTINGS"}
        </Button>
      </div>
    </form>
  );
}
