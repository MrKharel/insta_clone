import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoading = () => {
  return (
    <div className="flex items-center gap-6 border-b-4 border-double pb-8 md:gap-16">
      <Skeleton className="size-20 shrink-0 rounded-full md:size-36" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
    </div>
  );
};
