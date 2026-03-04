import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-primary/20" />
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
