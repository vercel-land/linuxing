"use client";

import { CommandBlock } from "@/components/command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Command {
  id: number;
  installCommand: string;
  uninstallCommand: string | null;
  packageManager: string;
  notes: string | null;
  verified: boolean | null;
  distroName: string;
  distroSlug: string;
}

interface DistroTabsProps {
  commandsByDistro: Record<string, { distroName: string; commands: Command[] }>;
}

export function DistroTabs({ commandsByDistro }: DistroTabsProps) {
  const distroSlugs = Object.keys(commandsByDistro);
  if (distroSlugs.length === 0) return null;

  return (
    <Tabs defaultValue={distroSlugs[0]} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList className="bg-muted/50 p-1 border border-border">
          {distroSlugs.map((slug) => (
            <TabsTrigger
              key={slug}
              value={slug}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
            >
              {commandsByDistro[slug].distroName}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {Object.entries(commandsByDistro).map(([slug, { commands }]) => (
        <TabsContent key={slug} value={slug} className="mt-0 space-y-8 animate-in fade-in-50 duration-300">
          <div className="grid gap-6">
            {commands.map((cmd) => (
              <div
                key={cmd.id}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold tracking-tight">
                      {cmd.packageManager}
                    </h3>
                    {cmd.verified ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 flex gap-1 items-center font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground flex gap-1 items-center font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Community
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <CommandBlock command={cmd.installCommand} label="Install" />
                  
                  {cmd.uninstallCommand && (
                    <CommandBlock
                      command={cmd.uninstallCommand}
                      label="Uninstall"
                    />
                  )}

                  {cmd.notes && (
                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-4">
                      <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-400">
                        <span className="font-semibold mr-1">Tip:</span>
                        {cmd.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
