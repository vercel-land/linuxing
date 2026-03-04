# Rosetta — Build-in-Public Plan

> A modern Linux command & package discovery platform.
> People switching to Linux shouldn't have to dig through outdated forums.
> Search what you need → pick your distro → copy the command. Done.

---

## The Idea

A clean, fast, community-driven website (+ future TUI) where users can:

- **Search** for a task (e.g. "install Node.js", "screenshot tool", "clipboard manager")
- **Pick their distro** (Arch, Ubuntu/Debian, Fedora, etc.)
- **Copy one-liner commands** for the right package manager (pacman/paru, apt, dnf, flatpak, brew, snap, mise, nvm, etc.)
- **Browse** curated categories (Development, System, Multimedia, Networking, etc.)
- **Contribute** their own entries (later sessions)

### What Makes It Different

- **Distro-aware**: every entry shows commands per distro/package manager side-by-side
- **Copy-first UX**: giant copy buttons, minimal prose, zero fluff
- **Modern stack**: fast, dark-mode-first, keyboard-navigable (Cmd+K search)
- **TUI companion** (later): `npx rosetta search node` from your terminal

---

## Tech Stack

- **Framework**: Next.js 16 (canary) — App Router, Server Components, Server Actions
- **Runtime**: Bun
- **UI**: Tailwind CSS 4 + shadcn/ui (already installed)
- **Database**: MySQL 8 via Docker Compose
- **ORM**: Drizzle ORM (lightweight, type-safe, great with Bun)
- **Search**: Full-text search via MySQL FULLTEXT indexes (simple, no extra infra)
- **Linting**: Biome (already configured)
- **TUI** (future): Ink (React for CLI) or Bubbletea (Go)

---

## Database Schema (Core)

```
categories
├── id (PK)
├── name (e.g. "Development Tools")
├── slug (e.g. "development-tools")
├── description
├── icon (lucide icon name)
└── created_at

distros
├── id (PK)
├── name (e.g. "Arch Linux")
├── slug (e.g. "arch")
├── icon_url
├── family (e.g. "arch", "debian", "fedora")
└── created_at

packages
├── id (PK)
├── name (e.g. "Node.js")
├── slug (e.g. "nodejs")
├── description
├── homepage_url
├── category_id (FK → categories)
├── created_at
└── updated_at

commands
├── id (PK)
├── package_id (FK → packages)
├── distro_id (FK → distros)
├── package_manager (e.g. "pacman", "paru", "apt", "dnf", "flatpak", "brew", "mise")
├── install_command (e.g. "sudo pacman -S nodejs")
├── uninstall_command
├── notes (optional tips)
├── verified (boolean)
├── created_at
└── updated_at

tags
├── id (PK)
└── name (e.g. "runtime", "cli", "gui", "tui")

package_tags (junction)
├── package_id (FK)
└── tag_id (FK)
```

---

## Session-by-Session Breakdown

Each session is designed to be **≤ 1 hour** and produce a shippable increment.

---

### Session 1 — Foundation & Database

**Goal**: Docker Compose + MySQL + Drizzle ORM + seed data

- [x] Create `docker-compose.yml` with MySQL 8 service
- [x] Install Drizzle ORM + drizzle-kit + mysql2 driver (`bun add drizzle-orm mysql2` + `bun add -d drizzle-kit`)
- [x] Create `drizzle.config.ts` pointing to the Docker MySQL instance
- [x] Create `src/db/schema.ts` — define all tables (categories, distros, packages, commands, tags, package_tags)
- [x] Create `.env.local` with `DATABASE_URL=mysql://rosetta:rosetta@localhost:3306/rosetta`
- [x] Run `drizzle-kit push` to apply schema
- [x] Create `src/db/seed.ts` — seed ~5 categories, ~5 distros, ~10 packages, ~30 commands
- [x] Add bun scripts: `"db:push"`, `"db:seed"`, `"db:studio"`

**Deliverable**: Database running, seeded, browsable via Drizzle Studio.

---

### Session 2 — Data Layer & Homepage

**Goal**: DB connection singleton + homepage with categories grid

- [x] Create `src/db/index.ts` — Drizzle client singleton (using `mysql2` pool)
- [x] Create `src/app/page.tsx` — hero section ("Find the right command for your distro") + categories grid
- [x] Create `src/components/category-card.tsx` — card with icon, name, package count
- [x] Fetch categories + package counts in Server Component (direct DB query, no API needed)
- [x] Style with shadcn Card component + Tailwind
- [x] Dark mode by default (set in layout)

**Deliverable**: Homepage showing category cards with real data.

---

### Session 3 — Category Page & Package Listing

**Goal**: `/category/[slug]` page showing packages in that category

- [x] Create `src/app/category/[slug]/page.tsx` — list packages for the category
- [x] Create `src/components/package-card.tsx` — shows name, description, supported distro icons
- [x] Add breadcrumbs (Home → Category name)
- [x] Add `generateStaticParams` for static generation of category pages
- [x] Handle not-found case with `notFound()`

**Deliverable**: Clicking a category shows its packages.

---

### Session 4 — Package Detail Page (The Core Page)

**Goal**: `/package/[slug]` — the money page with copy-paste commands

- [x] Create `src/app/package/[slug]/page.tsx`
- [x] Fetch package + all commands grouped by distro
- [x] Create `src/components/command-block.tsx` — styled code block with one-click copy button
- [x] Create `src/components/distro-tabs.tsx` — tabs to switch between distros (show commands for selected distro)
- [x] Show install + uninstall commands, notes, verified badge
- [x] Add metadata (title, description, og:image) for SEO

**Deliverable**: Full package page with distro-tabbed commands and copy buttons.

---

### Session 5 — Global Search (Cmd+K)

**Goal**: Command palette search across all packages

- [x] Add MySQL FULLTEXT index on `packages.name` and `packages.description`
- [x] Create `src/app/api/search/route.ts` — Route Handler that queries packages
- [x] Create `src/components/search-modal.tsx` — use `cmdk` for Cmd+K modal
- [x] Wire up search → API → results list
- [x] Keyboard navigation: arrow keys to browse, Enter to go to package page
- [x] Add the search trigger button in the site header/nav

**Deliverable**: Press Cmd+K anywhere → search packages → jump to result.

---

### Session 6 — Navigation & Layout Polish

**Goal**: Site header, footer, responsive layout, metadata

- [x] Create `src/components/site-header.tsx` — logo, nav links, search trigger, theme toggle
- [x] Create `src/components/site-footer.tsx` — links, credits, GitHub link
- [x] Update `src/app/layout.tsx` — add header/footer, setup ThemeProvider (next-themes)
- [x] Add proper metadata in layout: title template, description, og defaults
- [x] Make everything responsive (mobile hamburger menu if needed)
- [x] Add loading.tsx skeletons for category and package pages

**Deliverable**: Polished, navigable site with proper metadata.

---

### Session 7 — "Browse by Distro" Page

**Goal**: `/distro/[slug]` — see all available packages for a specific distro

- [x] Create `src/app/distro/[slug]/page.tsx` — show all packages that have commands for this distro
- [x] Create `src/app/distro/page.tsx` — grid of all supported distros
- [x] Show package count per distro
- [x] Reuse package-card component

**Deliverable**: Users can browse from the distro angle too.

---

### Session 8 — Tags & Filtering

**Goal**: Tag-based browsing and filtering

- [x] Create `src/app/tag/[slug]/page.tsx` — packages filtered by tag
- [x] Add tag pills on package cards and package detail page
- [x] Add filter sidebar/bar on category pages (filter by tag, distro support)
- [x] Make filters work with URL search params (shareable filtered views)

**Deliverable**: Filterable package listings with tag navigation.

---

### Session 9 — "Quick Start" Guides

**Goal**: Short, focused guides like "First 10 things after installing Arch"

- [x] Create `guides` table (id, title, slug, distro_id, content as markdown, created_at)
- [x] Create `src/app/guide/[slug]/page.tsx` — render markdown guide with embedded command blocks
- [x] Create `src/app/guide/page.tsx` — list all guides
- [x] Seed 2-3 starter guides
- [x] Reuse command-block component inside guides

**Deliverable**: Curated quick-start guides with inline copy-paste commands.

---

### Session 10 — Admin: CRUD for Packages & Commands

**Goal**: Simple admin interface to manage content (no auth yet, dev-only)

- [x] Create `src/app/admin/layout.tsx` — sidebar nav (Packages, Categories, Distros, Commands)
- [x] Create `src/app/admin/packages/page.tsx` — list all packages with edit/delete
- [x] Create `src/app/admin/packages/new/page.tsx` — form to add a package + commands
- [x] Use Server Actions for create/update/delete mutations
- [x] Use react-hook-form + zod for form validation (already installed)
- [x] Revalidate paths after mutations

**Deliverable**: Admin can CRUD packages and commands from the UI.

---

### Session 11 — Admin: Remaining CRUD + Seed Expansion

**Goal**: Complete admin panel + more seed data

- [x] Add CRUD pages for categories, distros, and tags
- [x] Expand seed data: ~30 packages, ~100+ commands covering real-world tools
- [x] Focus on: dev tools (node, python, go, rust, docker), system utils (htop, btop, neofetch), editors (neovim, helix), terminals (kitty, alacritty, wezterm, ghostty)

**Deliverable**: Fully manageable content with a rich dataset.

---

### Session 12 — Performance, SEO & Analytics

**Goal**: Make it production-ready

- [x] Add `sitemap.ts` (dynamic, from DB)
- [x] Add `robots.ts`
- [x] Add `opengraph-image.tsx` for dynamic OG images (package name + distro logos)
- [x] Optimize images (distro logos as SVGs in `/public`)
- [x] Add proper `<head>` metadata per page (title, description, canonical)
- [x] Lighthouse audit and fix any issues

**Deliverable**: SEO-ready, performant site.

---

### Session 13 — Compare Mode

**Goal**: Side-by-side comparison of equivalent packages

- [x] Create `src/app/compare/page.tsx` — select 2 packages to compare
- [x] Show feature comparison: distro support, package managers, install size, etc.
- [x] Add "Compare" button on package cards
- [x] URL-based: `/compare?a=nodejs&b=deno`

**Deliverable**: Users can compare alternatives (e.g. nvm vs mise vs fnm).

---

### Session 14 — TUI Companion (MVP)

**Goal**: CLI tool that queries the Rosetta API

- [x] Create `packages/cli/` workspace
- [x] `rosetta search <query>` — search packages, show results in a nice list
- [x] Keyboard navigation to select a package
- [x] Link directly to our web platform

**Deliverable**: Working CLI that queries the Rosetta platform.

---

### Session 15 — Visual Polish & Microinteractions

**Goal**: Make the UI feel premium, smooth, and delightful to use

- [x] Unify spacing, border radius, and typography scales across all pages
- [x] Add subtle gradients, glows, and textured backgrounds to key sections
- [x] Introduce tasteful hover and focus states
- [x] Add microinteractions: card lifts, icon motion, and active states
- [x] Review dark-mode contrast and accessibility

**Deliverable**: Visually cohesive, “wow”-level UI that still feels fast and unobtrusive.

---

### Future Sessions (Ideas Backlog)

- **User accounts**: sign up, bookmark packages, submit new entries
- **Voting/ratings**: community ranks accuracy of commands
- **Comments**: "This worked on Manjaro but not EndeavourOS"
- **Equivalent finder**: "I used X on Windows, what's the Linux equivalent?"
- **Distro detector**: TUI auto-detects your distro and filters commands
- **API**: Public REST API for integrations
- **i18n**: Multi-language support
- **RSS feed**: New packages/guides feed
- **GitHub integration**: Link to package repos, show stars

---

## Quick Start (Dev)

```bash
# Start the database
docker compose up -d

# Install dependencies
bun install

# Push schema to DB
bun run db:push

# Seed the database
bun run db:seed

# Start dev server
bun run dev
```

---

## Project Structure (Target)

```
src/
├── app/
│   ├── layout.tsx              # Root layout (header, footer, theme)
│   ├── page.tsx                # Homepage (hero + categories)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx        # Packages in category
│   ├── package/
│   │   └── [slug]/
│   │       └── page.tsx        # Package detail (commands)
│   ├── distro/
│   │   ├── page.tsx            # All distros
│   │   └── [slug]/
│   │       └── page.tsx        # Packages for distro
│   ├── tag/
│   │   └── [slug]/
│   │       └── page.tsx        # Packages by tag
│   ├── guide/
│   │   ├── page.tsx            # All guides
│   │   └── [slug]/
│   │       └── page.tsx        # Guide detail
│   ├── compare/
│   │   └── page.tsx            # Compare packages
│   ├── admin/
│   │   ├── layout.tsx          # Admin sidebar
│   │   └── packages/
│   │       ├── page.tsx        # List packages
│   │       └── new/
│   │           └── page.tsx    # Add package form
│   └── api/
│       └── search/
│           └── route.ts        # Search API
├── db/
│   ├── index.ts                # Drizzle client
│   ├── schema.ts               # Table definitions
│   └── seed.ts                 # Seed script
├── components/
│   ├── ui/                     # shadcn components (already here)
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── search-command.tsx
│   ├── category-card.tsx
│   ├── package-card.tsx
│   ├── command-block.tsx
│   └── distro-tabs.tsx
├── hooks/
│   └── use-mobile.ts
└── lib/
    └── utils.ts
```