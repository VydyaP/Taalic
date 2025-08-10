import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, User, Sparkles } from "lucide-react";

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

const getCategoryColor = (category: string, value: string) => {
  const colors = {
    raga: "bg-gradient-to-r from-raga-primary to-raga-secondary text-primary-foreground",
    tala: "bg-tala-primary text-primary-foreground",
    composer: "bg-composer-primary text-primary-foreground",
    deity: "bg-deity-primary text-primary-foreground"
  };
  return colors[category as keyof typeof colors] || "bg-secondary text-secondary-foreground";
};

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
      className={`group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm ${
        isSelectionMode ? 'cursor-pointer' : 'cursor-pointer'
      } ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={handleCardClick}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
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
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-raga-primary" />
            <Badge variant="secondary" className={getCategoryColor("raga", keerthana.raga)}>
              {keerthana.raga}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-tala-primary" />
            <Badge variant="secondary" className={getCategoryColor("tala", keerthana.tala)}>
              {keerthana.tala}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-composer-primary" />
            <Badge variant="outline" className={getCategoryColor("composer", keerthana.composer)}>
              {keerthana.composer}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-deity-primary" />
            <Badge variant="outline" className={getCategoryColor("deity", keerthana.deity)}>
              {keerthana.deity}
            </Badge>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};