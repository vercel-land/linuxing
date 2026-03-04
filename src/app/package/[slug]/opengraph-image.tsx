import { ImageResponse } from "next/og";
import { db } from "@/db";
import { packages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const alt = "Rosetta - Linux Commands";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const pkg = await db.query.packages.findFirst({
    where: (packages, { eq }) => eq(packages.slug, params.slug),
    with: {
      category: true,
    },
  });

  if (!pkg) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "#09090b",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Rosetta
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #09090b, #18181b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <div
            style={{
              background: "#3b82f6",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              marginRight: "16px",
            }}
          />
          <div style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", color: "#3b82f6" }}>
            Rosetta / {pkg.category?.name || "Linux Package"}
          </div>
        </div>
        <div style={{ fontSize: "100px", fontWeight: "900", marginBottom: "20px", lineHeight: "1" }}>
          {pkg.name}
        </div>
        <div style={{ fontSize: "32px", color: "#a1a1aa", maxWidth: "800px", lineHeight: "1.4" }}>
          {pkg.description || "Discover installation commands for your favorite Linux distribution."}
        </div>
        <div style={{ marginTop: "auto", fontSize: "20px", color: "#71717a" }}>
          rosetta.linux
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
