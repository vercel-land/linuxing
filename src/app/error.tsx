"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-destructive/10 p-6 mb-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      
      <h1 className="text-4xl font-black tracking-tight mb-4">Something went wrong!</h1>
      <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
        We encountered an unexpected error. Our team has been notified and we're working to fix it.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={() => reset()}
          size="lg"
          className="rounded-full px-8 gap-2 font-bold"
        >
          <RotateCcw className="h-4 w-4" /> TRY AGAIN
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="rounded-full px-8 gap-2 font-bold"
        >
          <Link href="/">
            <Home className="h-4 w-4" /> GO HOME
          </Link>
        </Button>
      </div>
      
      {error.digest && (
        <p className="mt-12 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
