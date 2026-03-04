"use client";

import { useForm } from "react-hook-form";
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
import { createGuide } from "./actions";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { CommandBlock } from "@/components/command-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const guideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  distroId: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
});

type GuideFormValues = z.infer<typeof guideSchema>;

interface GuideFormProps {
  distros: { id: number; name: string }[];
}

export function GuideForm({ distros }: GuideFormProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      slug: "",
      distroId: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const content = form.watch("content");

  async function onSubmit(data: GuideFormValues) {
    setIsPending(true);
    try {
      const submissionData = {
        ...data,
        distroId: data.distroId && data.distroId !== "none" ? parseInt(data.distroId) : null,
      };
      // @ts-ignore
      await createGuide(submissionData);
    } catch (error) {
      console.error(error);
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guide Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Essential Post-Install for Arch" {...field} />
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
                  <Input placeholder="e.g. arch-post-install" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="distroId"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Target Distribution (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a distribution" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">General (No specific distro)</SelectItem>
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

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Custom browser title" {...field} />
                </FormControl>
                <FormDescription>If empty, Title is used.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Custom meta description" {...field} />
                </FormControl>
                <FormDescription>If empty, Content snippet is used.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="space-y-4">
          <FormLabel>Guide Content (Markdown)</FormLabel>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write your guide in Markdown..."
                        className="min-h-[400px] font-mono text-sm leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[400px] rounded-md border p-8 prose prose-zinc dark:prose-invert max-w-none bg-card">
                {content ? (
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold mb-8">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-6 border-b pb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4">{children}</h3>,
                      p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>,
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const lang = match ? match[1] : null;
                        const text = String(children).replace(/\n$/, "");

                        if (!inline && (lang === "bash" || lang === "sh" || lang === "shell")) {
                          return (
                            <div className="not-prose my-8">
                              <CommandBlock command={text} />
                            </div>
                          );
                        }

                        return (
                          <code
                            className={`${className} rounded bg-muted px-1.5 py-0.5 font-mono text-sm`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">Nothing to preview yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-4 pt-8">
          <Button variant="outline" type="button" asChild disabled={isPending}>
            <Link href="/admin/guides">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Guide"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
