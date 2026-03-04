import { db } from "@/db";
import { packages, categories, distros, tags, guides } from "@/db/schema";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rosetta.linux";

  const [allPackages, allCategories, allDistros, allTags, allGuides] = await Promise.all([
    db.select({ slug: packages.slug, updatedAt: packages.updatedAt }).from(packages),
    db.select({ slug: categories.slug }).from(categories),
    db.select({ slug: distros.slug }).from(distros),
    db.select({ name: tags.name }).from(tags),
    db.select({ slug: guides.slug, createdAt: guides.createdAt }).from(guides),
  ]);

  const packageUrls = allPackages.map((p) => ({
    url: `${baseUrl}/package/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
  }));

  const categoryUrls = allCategories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const distroUrls = allDistros.map((d) => ({
    url: `${baseUrl}/distro/${d.slug}`,
    lastModified: new Date(),
  }));

  const tagUrls = allTags.map((t) => ({
    url: `${baseUrl}/tag/${t.name}`,
    lastModified: new Date(),
  }));

  const guideUrls = allGuides.map((g) => ({
    url: `${baseUrl}/guide/${g.slug}`,
    lastModified: g.createdAt || new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/distro`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...packageUrls,
    ...categoryUrls,
    ...distroUrls,
    ...tagUrls,
    ...guideUrls,
  ];
}
