"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function updateSettings(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    await db
      .update(settings)
      .set({ value })
      .where(eq(settings.key, key));
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
