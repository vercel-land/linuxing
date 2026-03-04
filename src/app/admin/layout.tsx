import Link from "next/link";
import { LayoutDashboard, Package, Tag, Layers, Globe, Settings, BookOpen } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Packages", href: "/admin/packages", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Distributions", href: "/admin/distros", icon: Globe },
    { name: "Tags", href: "/admin/tags", icon: Tag },
    { name: "Guides", href: "/admin/guides", icon: BookOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 border-r bg-card hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-tight">Rosetta Admin</h2>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
