import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridLoadingProps {
  viewMode: "grid" | "list";
}

export default function ProductGridLoading({ viewMode }: ProductGridLoadingProps) {
  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "space-y-4";

  return (
    <div className={gridClass}>
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-xl" />
      ))}
    </div>
  );
}