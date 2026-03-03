"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  type: "package" | "category";
}

interface SearchProps {
  results: SearchResult[];
  onSearch: (query: string) => Promise<void>;
}

export function SearchModal({ results, onSearch }: SearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    if (result.type === "package") {
      router.push(`/package/${result.slug}`);
    } else {
      router.push(`/category/${result.slug}`);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline-block">Search...</span>
        <kbd className="hidden sm:inline-block pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{
          shouldFilter: false, // Disable internal filtering since we use server-side search
        }}
      >
        <CommandInput
          placeholder="Search packages or categories..."
          onValueChange={onSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              {results.some((r) => r.type === "package") && (
                <CommandGroup heading="Packages">
                  {results
                    .filter((r) => r.type === "package")
                    .map((result) => (
                      <CommandItem
                        key={`package-${result.id}`}
                        onSelect={() => handleSelect(result)}
                      >
                        <span>{result.name}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
              {results.some((r) => r.type === "category") && (
                <CommandGroup heading="Categories">
                  {results
                    .filter((r) => r.type === "category")
                    .map((result) => (
                      <CommandItem
                        key={`category-${result.id}`}
                        onSelect={() => handleSelect(result)}
                      >
                        <span>{result.name}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
