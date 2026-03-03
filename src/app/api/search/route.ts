import { like, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, packages } from "@/db/schema";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const packagesResults = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
    })
    .from(packages)
    .where(like(packages.name, `%${query}%`))
    .limit(5);

  const categoriesResults = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(like(categories.name, `%${query}%`))
    .limit(5);

  const results = [
    ...packagesResults.map((p) => ({ ...p, type: "package" as const })),
    ...categoriesResults.map((c) => ({ ...c, type: "category" as const })),
  ];

  return NextResponse.json(results);
}
