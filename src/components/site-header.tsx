"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rosetta</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/category/development-tools"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Development
            </Link>
            <Link
              href="/category/system-utilities"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Utilities
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Search />
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link href="https://github.com">GitHub</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
