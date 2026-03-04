import { db } from "@/db";
import { guides, distros } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { CommandBlock } from "@/components/command-block";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGuide(slug: string) {
  return await db
    .select({
      id: guides.id,
      title: guides.title,
      slug: guides.slug,
      content: guides.content,
      distroName: distros.name,
    })
    .from(guides)
    .leftJoin(distros, eq(guides.distroId, distros.id))
    .where(eq(guides.slug, slug))
    .then((rows) => rows[0]);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | Rosetta Guides`,
    description: `Step-by-step Linux guide: ${guide.title}`,
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) notFound();

  return (
    <div className="container mx-auto min-h-screen px-4 py-12 max-w-4xl">
      <nav className="mb-12">
        <Link
          href="/guide"
          className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK TO GUIDES
        </Link>
      </nav>

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <header className="mb-16 not-prose">
          <div className="flex items-center gap-2 mb-6">
            {guide.distroName && (
              <span className="rounded-md bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {guide.distroName}
              </span>
            )}
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              5 MIN READ
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight lg:text-6xl mb-4 leading-tight">
            {guide.title}
          </h1>
          <div className="h-1.5 w-24 bg-primary rounded-full mt-8" />
        </header>

        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-8">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-6 border-b pb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4">{children}</h3>,
            p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-3 mb-6 text-muted-foreground">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-3 mb-6 text-muted-foreground">{children}</ol>,
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const lang = match ? match[1] : null;
              const content = String(children).replace(/\n$/, "");

              if (!inline && (lang === "bash" || lang === "sh" || lang === "shell")) {
                return (
                  <div className="not-prose my-8">
                    <CommandBlock command={content} />
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
          {guide.content}
        </ReactMarkdown>
      </article>

      <footer className="mt-20 pt-12 border-t">
        <div className="rounded-3xl bg-muted/50 p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Was this guide helpful?</h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Rosetta is community-driven. If you found an error or want to suggest an improvement, 
            feel free to contribute on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://github.com"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              CONTRIBUTE ON GITHUB
            </Link>
            <Link
              href="/guide"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border-2 border-border bg-transparent px-8 text-sm font-bold transition-all hover:bg-muted"
            >
              BROWSE MORE GUIDES
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
