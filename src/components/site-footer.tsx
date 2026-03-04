import { Github, Heart, Terminal, Twitter } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Rosetta</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A modern platform for discovering Linux commands and packages
              across all major distributions.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/distro"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Distributions
                </Link>
              </li>
              <li>
                <Link
                  href="/category"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rosetta. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 fill-primary text-primary" />{" "}
            in Public.
          </p>
        </div>
      </div>
    </footer>
  );
}
