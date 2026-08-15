import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClassificationCombobox } from "@/components/ClassificationCombobox";
import { ragas, talas, composers, deities } from "@/data/classifications";

export interface BulkEditChanges {
  raga?: string;
  tala?: string;
  composer?: string;
  deity?: string;
}

interface BulkEditFormProps {
  count: number;
  onApply: (changes: BulkEditChanges) => Promise<void>;
  onCancel: () => void;
}

export const BulkEditForm = ({ count, onApply, onCancel }: BulkEditFormProps) => {
  const [raga, setRaga] = useState("");
  const [tala, setTala] = useState("");
  const [composer, setComposer] = useState("");
  const [deity, setDeity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changes: BulkEditChanges = {
    ...(raga && { raga }),
    ...(tala && { tala }),
    ...(composer && { composer }),
    ...(deity && { deity }),
  };
  const hasChanges = Object.keys(changes).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    setIsSubmitting(true);
    try {
      await onApply(changes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Set a new value for any field below to apply it to all {count} selected keerthana{count === 1 ? "" : "s"}.
        Leave a field as "No change" to keep it as-is.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Raga</label>
          <ClassificationCombobox
            label="Raga"
            options={ragas}
            value={raga}
            onChange={setRaga}
            category="raga"
            placeholder="No change"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tala</label>
          <ClassificationCombobox
            label="Tala"
            options={talas}
            value={tala}
            onChange={setTala}
            category="tala"
            placeholder="No change"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Composer</label>
          <ClassificationCombobox
            label="Composer"
            options={composers}
            value={composer}
            onChange={setComposer}
            category="composer"
            placeholder="No change"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Deity</label>
          <ClassificationCombobox
            label="Deity"
            options={deities}
            value={deity}
            onChange={setDeity}
            category="deity"
            placeholder="No change"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          type="submit"
          className="flex-1 shadow-elegant transition-smooth"
          disabled={!hasChanges || isSubmitting}
        >
          {isSubmitting ? "Applying..." : `Apply to ${count} Keerthana${count === 1 ? "" : "s"}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
