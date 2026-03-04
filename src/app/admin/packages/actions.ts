"use server";

import { db } from "@/db";
import { packages, commands, packageTags, tags } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  homepageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.number().int().positive().optional(),
  commands: z.array(
    z.object({
      distroId: z.number().int().positive(),
      packageManager: z.string().min(1),
      installCommand: z.string().min(1),
      uninstallCommand: z.string().optional(),
      notes: z.string().optional(),
      verified: z.boolean().default(false),
    })
  ).min(1, "At least one command is required"),
  tags: z.string().optional(), // Comma-separated tags
});

export async function createPackage(data: z.infer<typeof packageSchema>) {
  // 1. Insert package
  const [pkgResult] = await db.insert(packages).values({
    name: data.name,
    slug: data.slug,
    description: data.description,
    homepageUrl: data.homepageUrl || null,
    categoryId: data.categoryId || null,
  });

  const packageId = pkgResult.insertId;

  // 2. Insert commands
  if (data.commands.length > 0) {
    await db.insert(commands).values(
      data.commands.map((cmd) => ({
        ...cmd,
        packageId,
      }))
    );
  }

  // 3. Handle tags
  if (data.tags) {
    const tagNames = data.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    
    for (const tagName of tagNames) {
      // Find or create tag
      let tag = await db.query.tags.findFirst({
        where: (tags, { eq }) => eq(tags.name, tagName),
      });

      if (!tag) {
        const [tagResult] = await db.insert(tags).values({ name: tagName });
        const tagId = tagResult.insertId;
        await db.insert(packageTags).values({ packageId, tagId });
      } else {
        await db.insert(packageTags).values({ packageId, tagId: tag.id });
      }
    }
  }

  revalidatePath("/admin/packages");
  revalidatePath("/");
  redirect("/admin/packages");
}

export async function deletePackage(id: number) {
  // Cascading deletes should be handled by DB foreign keys, 
  // but let's be explicit if needed or just trust the schema.
  // Our schema doesn't have ON DELETE CASCADE explicitly in the TS definition, 
  // though MySQL might if pushed that way. 
  // Let's manually clean up relations to be safe.
  
  await db.delete(packageTags).where(eq(packageTags.packageId, id));
  await db.delete(commands).where(eq(commands.packageId, id));
  await db.delete(packages).where(eq(packages.id, id));

  revalidatePath("/admin/packages");
  revalidatePath("/");
}
