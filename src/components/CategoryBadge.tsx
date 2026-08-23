import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Category = "raga" | "tala" | "composer" | "deity";

interface CategoryBadgeProps {
  category: Category;
  value: string;
  size?: "sm" | "lg";
  className?: string;
  /** When provided, the badge becomes clickable (e.g. tap to filter by this value). */
  onClick?: () => void;
}

export function CategoryBadge({ value, size = "sm", className, onClick }: CategoryBadgeProps) {
  const badgeSize = size === "lg" ? "text-sm px-3 py-1" : "text-xs";

  const badge = (
    <Badge
      variant="secondary"
      className={cn(
        badgeSize,
        onClick && "cursor-pointer hover:bg-accent transition-smooth",
        className
      )}
    >
      {value}
    </Badge>
  );

  if (!onClick) return badge;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex"
      aria-label={`Filter by ${value}`}
    >
      {badge}
    </button>
  );
}
