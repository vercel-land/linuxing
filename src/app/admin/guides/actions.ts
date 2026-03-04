"use server";

import { db } from "@/db";
import { guides } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";

const guideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  distroId: z.number().int().positive().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function createGuide(data: z.infer<typeof guideSchema>) {
  await db.insert(guides).values({
    title: data.title,
    slug: data.slug,
    distroId: data.distroId,
    content: data.content,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guide");
  redirect("/admin/guides");
}

export async function updateGuide(id: number, data: z.infer<typeof guideSchema>) {
  await db
    .update(guides)
    .set({
      title: data.title,
      slug: data.slug,
      distroId: data.distroId,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    })
    .where(eq(guides.id, id));

  revalidatePath("/admin/guides");
  revalidatePath("/guide");
  revalidatePath(`/guide/${data.slug}`);
  redirect("/admin/guides");
}

export async function deleteGuide(id: number) {
  await db.delete(guides).where(eq(guides.id, id));
  revalidatePath("/admin/guides");
  revalidatePath("/guide");
}
