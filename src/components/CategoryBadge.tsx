import { Badge } from "@/components/ui/badge";
import { Music, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type Category = "raga" | "tala" | "composer" | "deity";

const categoryStyles: Record<Category, string> = {
  raga: "bg-gradient-warm text-raga-foreground",
  tala: "bg-tala-primary text-tala-foreground",
  composer: "bg-composer-primary text-composer-foreground",
  deity: "bg-deity-primary text-deity-foreground",
};

function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  switch (category) {
    case "raga":
      return <Music className={cn("text-raga-primary", className)} />;
    case "tala":
      return <div className={cn("rounded-full bg-tala-primary", className)} />;
    case "composer":
      return <User className={cn("text-composer-primary", className)} />;
    case "deity":
      return <Sparkles className={cn("text-deity-primary", className)} />;
  }
}

interface CategoryBadgeProps {
  category: Category;
  value: string;
  showIcon?: boolean;
  size?: "sm" | "lg";
  className?: string;
}

export function CategoryBadge({ category, value, showIcon = true, size = "sm", className }: CategoryBadgeProps) {
  const iconSize = size === "lg" ? "h-4 w-4" : "h-4 w-4";
  const badgeSize = size === "lg" ? "text-sm px-3 py-1" : "text-xs";

  return (
    <div className="flex items-center gap-2">
      {showIcon && <CategoryIcon category={category} className={iconSize} />}
      <Badge variant="secondary" className={cn(categoryStyles[category], badgeSize, className)}>
        {value}
      </Badge>
    </div>
  );
}
