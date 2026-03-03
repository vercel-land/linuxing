# 🐧 Linuxing

> **A modern Linux command & package discovery platform.**
> People switching to Linux shouldn't have to dig through outdated forums. 
> Search what you need → pick your distro → copy the command. Done.

Linuxing is a clean, fast, community-driven platform designed to help users find the right commands for their specific Linux distribution. Whether you're a newcomer or a power user, Linuxing provides a "copy-first" experience to get your tools installed and configured without the fluff.

---

## ✨ Features

- **Distro-aware**: Side-by-side commands for Arch, Ubuntu/Debian, Fedora, and more.
- **Copy-first UX**: One-click copy buttons for all installation and uninstallation commands.
- **Fast Search**: Keyboard-navigable (Cmd+K) global search across all packages.
- **Curated Categories**: Browse tools by Development, System, Multimedia, Networking, and more.
- **Verified Commands**: Badges for community-verified and tested commands.
- **Modern UI**: Dark-mode first, built with Tailwind CSS 4 and shadcn/ui.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (canary)](https://nextjs.org) (App Router, Server Components)
- **Runtime**: [Bun](https://bun.sh)
- **Database**: MySQL 8 (via Docker Compose)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Linting**: [Biome](https://biomejs.dev)

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed.
- [Docker](https://www.docker.com/) installed (for the database).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/linuxing.git
   cd linuxing
   ```

2. **Start the database**:
   ```bash
   docker compose up -d
   ```

3. **Install dependencies**:
   ```bash
   bun install
   ```

4. **Setup the database**:
   ```bash
   bun run db:push   # Push schema to MySQL
   bun run db:seed   # Seed initial data (categories, distros, packages)
   ```

5. **Start the development server**:
   ```bash
   bun run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🏗️ Project Structure

```text
src/
├── app/          # Next.js App Router (pages, layouts, APIs)
├── components/   # React components (UI and shared)
├── db/           # Drizzle schema, migrations, and seed scripts
├── hooks/        # Custom React hooks
└── lib/          # Shared utility functions
```

---

## 🛠️ Development Commands

- `bun run dev`: Starts the Next.js development server.
- `bun run build`: Builds the application for production.
- `bun run lint`: Runs Biome to check for linting issues.
- `bun run format`: Automatically formats code with Biome.
- `bun run db:push`: Syncs the Drizzle schema with the database.
- `bun run db:seed`: Populates the database with sample data.
- `bun run db:studio`: Opens Drizzle Studio to browse your data.

---

## 🗺️ Roadmap

The project follows a structured [Development Plan](PLAN.md). Key upcoming milestones include:
- [x] Foundation & Database Setup
- [x] Homepage & Category Cards
- [ ] Package Detail Pages & Distro Tabs
- [ ] Global Search (Cmd+K)
- [ ] Admin Dashboard for Content Management
- [ ] TUI (Terminal User Interface) Companion

---

## 🤝 Contributing

Contributions are welcome! Please check the [AGENTS.md](AGENTS.md) for architectural guidelines and the [PLAN.md](PLAN.md) for the current focus areas.

---

## 📄 License

This project is open-source and available under the MIT License.
