import { db } from "./index";
import {
  categories,
  commands,
  distros,
  packages,
  packageTags,
  tags,
  guides,
} from "./schema";

const seedData = async () => {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(guides).execute();
  await db.delete(packageTags).execute();
  await db.delete(commands).execute();
  await db.delete(packages).execute();
  await db.delete(tags).execute();
  await db.delete(categories).execute();
  await db.delete(distros).execute();

  // Insert categories
  const categoryData = [
    {
      name: "Development Tools",
      slug: "development-tools",
      description: "Compilers, IDEs, and development utilities",
      icon: "Code",
    },
    {
      name: "System Utilities",
      slug: "system-utilities",
      description: "System monitoring, process management, and utilities",
      icon: "Terminal",
    },
    {
      name: "Text Editors",
      slug: "text-editors",
      description: "Code editors and IDEs",
      icon: "FileText",
    },
    {
      name: "Terminal Emulators",
      slug: "terminal-emulators",
      description: "Terminal emulators and shells",
      icon: "Monitor",
    },
    {
      name: "Multimedia",
      slug: "multimedia",
      description: "Media players, audio tools, and video editors",
      icon: "Music",
    },
  ];

  await db.insert(categories).values(categoryData).execute();
  const insertedCategories = await db.select().from(categories).execute();
  console.log(`Inserted ${insertedCategories.length} categories`);

  // Insert distros
  const distroData = [
    { name: "Arch Linux", slug: "arch", family: "arch" },
    { name: "Ubuntu", slug: "ubuntu", family: "debian" },
    { name: "Debian", slug: "debian", family: "debian" },
    { name: "Fedora", slug: "fedora", family: "fedora" },
    { name: "Manjaro", slug: "manjaro", family: "arch" },
  ];

  await db.insert(distros).values(distroData).execute();
  const insertedDistros = await db.select().from(distros).execute();
  console.log(`Inserted ${insertedDistros.length} distros`);

  // Insert tags
  const tagData = [
    { name: "cli" },
    { name: "gui" },
    { name: "runtime" },
    { name: "compiler" },
    { name: "tool" },
  ];

  await db.insert(tags).values(tagData).execute();
  const insertedTags = await db.select().from(tags).execute();
  console.log(`Inserted ${insertedTags.length} tags`);

  // Insert packages
  const packageData = [
    {
      name: "Node.js",
      slug: "nodejs",
      description: "JavaScript runtime built on Chrome's V8 engine",
      homepageUrl: "https://nodejs.org",
      categoryId: insertedCategories[0].id,
    },
    {
      name: "Python",
      slug: "python",
      description: "Interpreted, high-level programming language",
      homepageUrl: "https://python.org",
      categoryId: insertedCategories[0].id,
    },
    {
      name: "Go",
      slug: "go",
      description: "Statically typed, compiled programming language",
      homepageUrl: "https://go.dev",
      categoryId: insertedCategories[0].id,
    },
    {
      name: "Rust",
      slug: "rust",
      description: "Systems programming language focused on safety",
      homepageUrl: "https://rust-lang.org",
      categoryId: insertedCategories[0].id,
    },
    {
      name: "Neovim",
      slug: "neovim",
      description: "Hyperextensible Vim-based text editor",
      homepageUrl: "https://neovim.io",
      categoryId: insertedCategories[2].id,
    },
    {
      name: "Helix",
      slug: "helix",
      description: "Post-modern text editor written in Rust",
      homepageUrl: "https://helix-editor.com",
      categoryId: insertedCategories[2].id,
    },
    {
      name: "Kitty",
      slug: "kitty",
      description: "Fast, feature-rich, GPU-based terminal emulator",
      homepageUrl: "https://sw.kovidgoyal.net/kitty",
      categoryId: insertedCategories[3].id,
    },
    {
      name: "Alacritty",
      slug: "alacritty",
      description: "Cross-platform, OpenGL terminal emulator",
      homepageUrl: "https://alacritty.org",
      categoryId: insertedCategories[3].id,
    },
    {
      name: "htop",
      slug: "htop",
      description: "Interactive process viewer",
      homepageUrl: "https://htop.dev",
      categoryId: insertedCategories[1].id,
    },
    {
      name: "btop",
      slug: "btop",
      description: "Resource monitor that shows usage and stats",
      homepageUrl: "https://github.com/aristocratos/btop",
      categoryId: insertedCategories[1].id,
    },
    {
      name: "Docker",
      slug: "docker",
      description: "Platform for developing, shipping, and running applications in containers",
      homepageUrl: "https://www.docker.com",
      categoryId: insertedCategories[0].id,
    },
    {
      name: "Neofetch",
      slug: "neofetch",
      description: "Command-line system information tool",
      homepageUrl: "https://github.com/dylanaraps/neofetch",
      categoryId: insertedCategories[1].id,
    },
    {
      name: "Visual Studio Code",
      slug: "vscode",
      description: "Powerful code editor redefined and optimized for building and debugging modern web and cloud applications",
      homepageUrl: "https://code.visualstudio.com",
      categoryId: insertedCategories[2].id,
    },
    {
      name: "VLC Media Player",
      slug: "vlc",
      description: "Free and open source cross-platform multimedia player and framework",
      homepageUrl: "https://www.videolan.org/vlc/",
      categoryId: insertedCategories[4].id,
    },
  ];

  await db.insert(packages).values(packageData).execute();
  const insertedPackages = await db.select().from(packages).execute();
  console.log(`Inserted ${insertedPackages.length} packages`);

  // Helper to find distro by slug
  const findDistro = (slug: string) => {
    const distro = insertedDistros.find(
      (d: { slug: string }) => d.slug === slug,
    );
    if (!distro) throw new Error(`Distro not found: ${slug}`);
    return distro;
  };
  const findPackage = (slug: string) => {
    const pkg = insertedPackages.find((p: { slug: string }) => p.slug === slug);
    if (!pkg) throw new Error(`Package not found: ${slug}`);
    return pkg;
  };
  const findTag = (name: string) => {
    const tag = insertedTags.find((t: { name: string }) => t.name === name);
    if (!tag) throw new Error(`Tag not found: ${name}`);
    return tag;
  };

  // Insert commands
  const commandData = [
    // Node.js commands
    {
      packageId: findPackage("nodejs").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S nodejs",
      uninstallCommand: "sudo pacman -R nodejs",
      verified: true,
    },
    {
      packageId: findPackage("nodejs").id,
      distroId: findDistro("arch").id,
      packageManager: "paru",
      installCommand: "paru -S nodejs",
      uninstallCommand: "paru -R nodejs",
      verified: true,
    },
    {
      packageId: findPackage("nodejs").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install nodejs npm",
      uninstallCommand: "sudo apt remove nodejs npm",
      verified: true,
    },
    {
      packageId: findPackage("nodejs").id,
      distroId: findDistro("fedora").id,
      packageManager: "dnf",
      installCommand: "sudo dnf install nodejs npm",
      uninstallCommand: "sudo dnf remove nodejs npm",
      verified: true,
    },
    {
      packageId: findPackage("nodejs").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "nvm",
      installCommand:
        "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && nvm install --lts",
      uninstallCommand: "nvm uninstall <version>",
      notes: "Using nvm is recommended for managing multiple Node versions",
      verified: true,
    },
    // Python commands
    {
      packageId: findPackage("python").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S python python-pip",
      uninstallCommand: "sudo pacman -R python python-pip",
      verified: true,
    },
    {
      packageId: findPackage("python").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install python3 python3-pip",
      uninstallCommand: "sudo apt remove python3 python3-pip",
      verified: true,
    },
    {
      packageId: findPackage("python").id,
      distroId: findDistro("fedora").id,
      packageManager: "dnf",
      installCommand: "sudo dnf install python3 python3-pip",
      uninstallCommand: "sudo dnf remove python3 python3-pip",
      verified: true,
    },
    // Go commands
    {
      packageId: findPackage("go").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S go",
      uninstallCommand: "sudo pacman -R go",
      verified: true,
    },
    {
      packageId: findPackage("go").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install golang-go",
      uninstallCommand: "sudo apt remove golang-go",
      verified: true,
    },
    // Rust commands
    {
      packageId: findPackage("rust").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S rustup",
      uninstallCommand: "sudo pacman -R rustup",
      notes: "rustup is the recommended way to install Rust",
      verified: true,
    },
    {
      packageId: findPackage("rust").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand:
        "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      uninstallCommand: "rustup self uninstall",
      notes: "Using rustup is recommended for managing Rust",
      verified: true,
    },
    // Neovim commands
    {
      packageId: findPackage("neovim").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S neovim",
      uninstallCommand: "sudo pacman -R neovim",
      verified: true,
    },
    {
      packageId: findPackage("neovim").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install neovim",
      uninstallCommand: "sudo apt remove neovim",
      notes: "For latest version, use Neovim PPA or AppImage",
      verified: true,
    },
    {
      packageId: findPackage("neovim").id,
      distroId: findDistro("fedora").id,
      packageManager: "dnf",
      installCommand: "sudo dnf install neovim",
      uninstallCommand: "sudo dnf remove neovim",
      verified: true,
    },
    // Helix commands
    {
      packageId: findPackage("helix").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S helix",
      uninstallCommand: "sudo pacman -R helix",
      verified: true,
    },
    {
      packageId: findPackage("helix").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install helix",
      uninstallCommand: "sudo apt remove helix",
      notes: "For latest version, use the official binary",
      verified: true,
    },
    // Kitty commands
    {
      packageId: findPackage("kitty").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S kitty",
      uninstallCommand: "sudo pacman -R kitty",
      verified: true,
    },
    {
      packageId: findPackage("kitty").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install kitty",
      uninstallCommand: "sudo apt remove kitty",
      notes: "For latest version, use the official installer",
      verified: true,
    },
    // Alacritty commands
    {
      packageId: findPackage("alacritty").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S alacritty",
      uninstallCommand: "sudo pacman -R alacritty",
      verified: true,
    },
    {
      packageId: findPackage("alacritty").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install alacritty",
      uninstallCommand: "sudo apt remove alacritty",
      notes: "For latest version, build from source",
      verified: true,
    },
    // htop commands
    {
      packageId: findPackage("htop").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S htop",
      uninstallCommand: "sudo pacman -R htop",
      verified: true,
    },
    {
      packageId: findPackage("htop").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install htop",
      uninstallCommand: "sudo apt remove htop",
      verified: true,
    },
    // btop commands
    {
      packageId: findPackage("btop").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S btop",
      uninstallCommand: "sudo pacman -R btop",
      verified: true,
    },
    {
      packageId: findPackage("btop").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install btop",
      uninstallCommand: "sudo apt remove btop",
      notes: "Available in Ubuntu 22.10+",
      verified: true,
    },
    // Docker commands
    {
      packageId: findPackage("docker").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S docker",
      uninstallCommand: "sudo pacman -R docker",
      verified: true,
    },
    {
      packageId: findPackage("docker").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install docker.io",
      uninstallCommand: "sudo apt remove docker.io",
      verified: true,
    },
    // Neofetch
    {
      packageId: findPackage("neofetch").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S neofetch",
      uninstallCommand: "sudo pacman -R neofetch",
      verified: true,
    },
    {
      packageId: findPackage("neofetch").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install neofetch",
      uninstallCommand: "sudo apt remove neofetch",
      verified: true,
    },
    // VS Code
    {
      packageId: findPackage("vscode").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S code",
      uninstallCommand: "sudo pacman -R code",
      verified: true,
    },
    {
      packageId: findPackage("vscode").id,
      distroId: findDistro("fedora").id,
      packageManager: "dnf",
      installCommand: "sudo dnf install code",
      uninstallCommand: "sudo dnf remove code",
      verified: true,
    },
    // VLC
    {
      packageId: findPackage("vlc").id,
      distroId: findDistro("arch").id,
      packageManager: "pacman",
      installCommand: "sudo pacman -S vlc",
      uninstallCommand: "sudo pacman -R vlc",
      verified: true,
    },
    {
      packageId: findPackage("vlc").id,
      distroId: findDistro("ubuntu").id,
      packageManager: "apt",
      installCommand: "sudo apt install vlc",
      uninstallCommand: "sudo apt remove vlc",
      verified: true,
    },
  ];

  await db.insert(commands).values(commandData).execute();
  console.log(`Inserted ${commandData.length} commands`);

  // Insert package tags
  const packageTagData = [
    { packageId: findPackage("nodejs").id, tagId: findTag("runtime").id },
    { packageId: findPackage("python").id, tagId: findTag("runtime").id },
    { packageId: findPackage("go").id, tagId: findTag("runtime").id },
    { packageId: findPackage("rust").id, tagId: findTag("runtime").id },
    { packageId: findPackage("rust").id, tagId: findTag("compiler").id },
    { packageId: findPackage("neovim").id, tagId: findTag("cli").id },
    { packageId: findPackage("neovim").id, tagId: findTag("gui").id },
    { packageId: findPackage("helix").id, tagId: findTag("cli").id },
    { packageId: findPackage("kitty").id, tagId: findTag("cli").id },
    { packageId: findPackage("kitty").id, tagId: findTag("gui").id },
    { packageId: findPackage("alacritty").id, tagId: findTag("cli").id },
    { packageId: findPackage("alacritty").id, tagId: findTag("gui").id },
    { packageId: findPackage("htop").id, tagId: findTag("cli").id },
    { packageId: findPackage("htop").id, tagId: findTag("tool").id },
    { packageId: findPackage("btop").id, tagId: findTag("cli").id },
    { packageId: findPackage("btop").id, tagId: findTag("tool").id },
    { packageId: findPackage("docker").id, tagId: findTag("tool").id },
    { packageId: findPackage("neofetch").id, tagId: findTag("cli").id },
    { packageId: findPackage("neofetch").id, tagId: findTag("tool").id },
    { packageId: findPackage("vscode").id, tagId: findTag("gui").id },
    { packageId: findPackage("vlc").id, tagId: findTag("gui").id },
    { packageId: findPackage("vlc").id, tagId: findTag("tool").id },
  ];

  await db.insert(packageTags).values(packageTagData).execute();
  console.log(`Inserted ${packageTagData.length} package tags`);

  // Insert guides
  const guideData = [
    {
      title: "Essential Post-Install for Arch Linux",
      slug: "arch-post-install",
      distroId: findDistro("arch").id,
      content: `
# Arch Linux Post-Install Guide

Welcome to the world of Arch! Here are the first things you should do after a fresh installation.

## 1. Update the System
Always start with a full system upgrade.
\`\`\`bash
sudo pacman -Syu
\`\`\`

## 2. Install a Helper (Paru)
Arch is better with the AUR. Paru is a great helper written in Rust.
\`\`\`bash
sudo pacman -S --needed base-devel
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
\`\`\`

## 3. Essential Tools
Install some basic utilities for daily use.
\`\`\`bash
sudo pacman -S htop btop neovim kitty
\`\`\`
      `,
    },
    {
      title: "Get Started with Ubuntu for Development",
      slug: "ubuntu-dev-setup",
      distroId: findDistro("ubuntu").id,
      content: `
# Ubuntu Development Setup

Ubuntu is a solid choice for developers. Let's get your environment ready.

## 1. Update Repositories
\`\`\`bash
sudo apt update && sudo apt upgrade
\`\`\`

## 2. Install Build Essentials
This includes gcc, g++, and make.
\`\`\`bash
sudo apt install build-essential
\`\`\`

## 3. Development Runtimes
Install Node.js and Python to get started.
\`\`\`bash
sudo apt install nodejs npm python3 python3-pip
\`\`\`
      `,
    },
  ];

  await db.insert(guides).values(guideData).execute();
  console.log(`Inserted ${guideData.length} guides`);

  console.log("Seeding complete!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
