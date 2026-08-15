import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryBadge } from "@/components/CategoryBadge";

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
  }[];
}

interface KeerthanaCardProps {
  keerthana: Keerthana;
  onClick?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

export const KeerthanaCard = ({ keerthana, onClick, isSelectionMode = false, isSelected = false, onSelectionChange }: KeerthanaCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      onSelectionChange?.(!isSelected);
    } else {
      onClick?.();
    }
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm shadow-card ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {keerthana.name}
          </CardTitle>
          {isSelectionMode && (
            <Checkbox
              checked={isSelected}
              onChange={(checked) => onSelectionChange?.(checked)}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <CategoryBadge category="raga" value={keerthana.raga} />
          <CategoryBadge category="tala" value={keerthana.tala} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CategoryBadge category="composer" value={keerthana.composer} />
          <CategoryBadge category="deity" value={keerthana.deity} />
        </div>
      </CardContent>
    </Card>
  );
};
