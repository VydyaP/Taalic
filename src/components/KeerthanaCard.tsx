import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryBadge, Category } from "@/components/CategoryBadge";

export interface Keerthana {
  id: string;
  name: string;
  raga: string;
  tala: string;
  composer: string;
  deity: string;
  lyrics?: string;
  meaning?: string;
  notationFiles?: {
    name: string;
    url: string;
    type: 'pdf' | 'image';
    language?: string;
  }[];
}

interface KeerthanaCardProps {
  keerthana: Keerthana;
  onClick?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  /** When provided, tapping a raga/tala/deity badge filters by that value instead of opening the card. */
  onFacetClick?: (field: Category, value: string) => void;
}

export const KeerthanaCard = ({
  keerthana,
  onClick,
  isSelectionMode = false,
  isSelected = false,
  onSelectionChange,
  onFacetClick,
}: KeerthanaCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      onSelectionChange?.(!isSelected);
    } else {
      onClick?.();
    }
  };

  const facetHandler = (field: Category) =>
    onFacetClick && !isSelectionMode ? () => onFacetClick(field, keerthana[field]) : undefined;

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card shadow-card ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="label-caps truncate">{keerthana.composer}</p>
            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-1">
              {keerthana.name}
            </h3>
          </div>
          {isSelectionMode && (
            <Checkbox
              checked={isSelected}
              onChange={(checked) => onSelectionChange?.(checked)}
              className="mt-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category="raga" value={keerthana.raga} onClick={facetHandler("raga")} />
          <CategoryBadge category="tala" value={keerthana.tala} onClick={facetHandler("tala")} />
          <CategoryBadge category="deity" value={keerthana.deity} onClick={facetHandler("deity")} />
        </div>
      </CardContent>
    </Card>
  );
};
