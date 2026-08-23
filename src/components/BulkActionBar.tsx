import { Tags, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  count: number;
  onReassign: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({ count, onReassign, onDelete, onClear }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl px-4 py-3 shadow-elegant">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        <span className="mr-auto text-sm font-medium text-foreground">{count} selected</span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <Button variant="secondary" size="sm" onClick={onReassign}>
          <Tags className="h-4 w-4 mr-1" />
          Reassign
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
