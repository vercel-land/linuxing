import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="relative mb-12">
        <h1 className="text-[12rem] font-black leading-none tracking-tighter text-muted/20 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl bg-primary p-6 shadow-2xl shadow-primary/40 animate-in zoom-in duration-500">
            <Search className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>
      </div>
      
      <h2 className="text-4xl font-black tracking-tight mb-4">Command not found.</h2>
      <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed">
        The package or distribution you're looking for doesn't exist in our repository. 
        Maybe it's under a different name?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
        <Button
          size="lg"
          className="rounded-full px-8 gap-2 font-bold shadow-lg shadow-primary/20"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4" /> BACK TO SAFETY
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 gap-2 font-bold"
          asChild
        >
          <Link href="/category">
            <Map className="h-4 w-4" /> EXPLORE SITE
          </Link>
        </Button>
      </div>

      <div className="mt-20 pt-8 border-t w-full max-w-2xl">
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-6">
          Suggested categories
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Development", "Utilities", "Multimedia", "Networking", "System"].map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}-tools`}
              className="px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
