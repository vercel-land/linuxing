"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { createPackage } from "./actions";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  homepageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(), // We'll convert to number on submit
  commands: z.array(
    z.object({
      distroId: z.string().min(1, "Distro is required"),
      packageManager: z.string().min(1, "Manager is required"),
      installCommand: z.string().min(1, "Install command is required"),
      uninstallCommand: z.string().optional(),
      notes: z.string().optional(),
      verified: z.boolean().default(false),
    })
  ).min(1, "At least one command is required"),
  tags: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormProps {
  categories: { id: number; name: string }[];
  distros: { id: number; name: string }[];
}

export function PackageForm({ categories, distros }: PackageFormProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      homepageUrl: "",
      commands: [
        {
          distroId: "",
          packageManager: "",
          installCommand: "",
          uninstallCommand: "",
          notes: "",
          verified: false,
        },
      ],
      tags: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "commands",
    control: form.control,
  });

  async function onSubmit(data: PackageFormValues) {
    setIsPending(true);
    try {
      // Convert string IDs to numbers as expected by the action
      const submissionData = {
        ...data,
        categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
        commands: data.commands.map(cmd => ({
          ...cmd,
          distroId: parseInt(cmd.distroId),
        })),
      };
      // @ts-ignore - fixing type mismatch for categoryId/distroId conversion
      await createPackage(submissionData);
    } catch (error) {
      console.error(error);
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-lg font-bold">General Information</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Node.js" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. nodejs" {...field} />
                  </FormControl>
                  <FormDescription>URL-friendly name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What does this package do?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold">Metadata</h3>
            <FormField
              control={form.control}
              name="homepageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Homepage URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="cli, runtime, dev..." {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Distro Commands</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                distroId: "",
                packageManager: "",
                installCommand: "",
                uninstallCommand: "",
                notes: "",
                verified: false,
              })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Distro
            </Button>
          </div>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-2xl border bg-muted/20 p-8 pt-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`commands.${index}.distroId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distribution</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select distro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {distros.map((d) => (
                              <SelectItem key={d.id} value={d.id.toString()}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`commands.${index}.packageManager`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. pacman, apt, brew" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`commands.${index}.verified`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background mt-8">
                        <div className="space-y-0.5">
                          <FormLabel>Verified</FormLabel>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  <FormField
                    control={form.control}
                    name={`commands.${index}.installCommand`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Install Command</FormLabel>
                        <FormControl>
                          <Input className="font-mono text-xs" placeholder="sudo pacman -S..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`commands.${index}.uninstallCommand`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uninstall Command</FormLabel>
                        <FormControl>
                          <Input className="font-mono text-xs" placeholder="sudo pacman -R..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name={`commands.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Tips)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Recommended for managing versions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8">
          <Button variant="outline" type="button" asChild disabled={isPending}>
            <Link href="/admin/packages">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
