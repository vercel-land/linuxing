import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-5xl">
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </header>

      <div className="mt-12">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl w-full" />
          <Skeleton className="h-64 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
