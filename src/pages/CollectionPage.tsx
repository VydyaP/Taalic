import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, CheckSquare, Square, Library, X } from "lucide-react";
import { KeerthanaCard, Keerthana } from "@/components/KeerthanaCard";
import { BulkEditForm, BulkEditChanges } from "@/components/BulkEditForm";
import { BulkActionBar } from "@/components/BulkActionBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useBackCloseable } from "@/hooks/use-back-closeable";
import { useEditGate } from "@/gate/EditGateProvider";
import { paths } from "@/routes/paths";
import { useKeerthanas, useBulkDeleteKeerthanas, useBulkEditKeerthanas } from "@/lib/keerthanas";

export type ClassificationFilter = "all" | "raga" | "tala" | "composer" | "deity";

const groupChips: { key: ClassificationFilter; label: string }[] = [
  { key: "all", label: "No grouping" },
  { key: "raga", label: "By raga" },
  { key: "tala", label: "By tala" },
  { key: "composer", label: "By composer" },
  { key: "deity", label: "By deity" },
];

const groupAccentColor: Record<string, string> = {
  raga: "bg-raga-primary",
  tala: "bg-tala-primary",
  composer: "bg-composer-primary",
  deity: "bg-deity-primary",
};

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-lg border border-border/50 p-6">
          <Skeleton className="h-6 w-2/3" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}

export default function CollectionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requireCode } = useEditGate();
  const { data: keerthanas = [], isLoading: loading, isError, error } = useKeerthanas();
  const bulkDeleteMutation = useBulkDeleteKeerthanas();
  const bulkEditMutation = useBulkEditKeerthanas();

  const [searchValue, setSearchValue] = useState("");
  const [groupBy, setGroupBy] = useState<ClassificationFilter>("all");
  const [facetFilter, setFacetFilter] = useState<{ field: ClassificationFilter; value: string } | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedKeerthanas, setSelectedKeerthanas] = useState<Set<string>>(new Set());
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);

  useBackCloseable(showBulkEditDialog, () => setShowBulkEditDialog(false));

  if (isError) {
    console.error('Error in loadKeerthanas:', error);
  }

  const normalizedSearch = searchValue.trim().toLowerCase();
  const matchesSearch = (k: Keerthana) => {
    if (!normalizedSearch) return true;
    return [k.name, k.raga, k.tala, k.composer, k.deity]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(normalizedSearch));
  };
  const matchesFacet = (k: Keerthana) => {
    if (!facetFilter) return true;
    return (k as any)[facetFilter.field] === facetFilter.value;
  };

  const filtered = keerthanas.filter((k) => matchesSearch(k) && matchesFacet(k));
  const isGrouped = groupBy !== "all" && !facetFilter;
  const groups = isGrouped
    ? filtered.reduce<Record<string, Keerthana[]>>((acc, item) => {
        const key = (item as any)[groupBy] || "Unknown";
        (acc[key] ||= []).push(item);
        return acc;
      }, {})
    : { All: filtered };

  const hasAnyResults = filtered.length > 0;
  const isFiltering = normalizedSearch.length > 0 || !!facetFilter;

  const toggleSelection = (id: string, selected: boolean) => {
    setSelectedKeerthanas((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedKeerthanas(new Set());
  };

  const handleFacetClick = (field: ClassificationFilter, value: string) => {
    setFacetFilter({ field, value });
  };

  const handleBulkDelete = () => {
    requireCode("delete", async () => {
      const ids = Array.from(selectedKeerthanas);
      try {
        await bulkDeleteMutation.mutateAsync(ids);
        setSelectedKeerthanas(new Set());
        setIsSelectionMode(false);
        toast({ title: "Success", description: `Deleted ${ids.length} keerthana${ids.length === 1 ? "" : "s"}.` });
      } catch (err) {
        console.error('Error in bulk delete:', err);
        toast({ title: "Error", description: "Failed to delete selected keerthanas. Please try again.", variant: "destructive" });
      }
    });
  };

  const handleBulkEdit = () => {
    requireCode("edit", () => setShowBulkEditDialog(true));
  };

  const handleApplyBulkEdit = async (changes: BulkEditChanges) => {
    const ids = Array.from(selectedKeerthanas);
    try {
      await bulkEditMutation.mutateAsync({ ids, changes });
      setShowBulkEditDialog(false);
      setSelectedKeerthanas(new Set());
      setIsSelectionMode(false);
      toast({ title: "Success", description: `Updated ${ids.length} keerthana${ids.length === 1 ? "" : "s"}.` });
    } catch (err) {
      console.error('Error in applyBulkEdit:', err);
      toast({ title: "Error", description: "Failed to update selected keerthanas. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-caps">{keerthanas.length} keerthanas archived</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">
            Your collection
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(paths.add())} className="shadow-elegant transition-smooth">
            <Plus className="h-4 w-4 mr-2" />
            Add Kruthi
          </Button>
          <Button variant="outline" onClick={handleToggleSelectionMode}>
            {isSelectionMode ? <Square className="h-4 w-4 mr-2" /> : <CheckSquare className="h-4 w-4 mr-2" />}
            {isSelectionMode ? "Cancel" : "Select"}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search name, raga, tala, composer, deity"
          className="h-11 pl-9"
        />
      </div>

      <div className="space-y-3">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {groupChips.map((chip) => (
            <Chip
              key={chip.key}
              active={groupBy === chip.key && !facetFilter}
              onClick={() => {
                setFacetFilter(null);
                setGroupBy(chip.key);
              }}
            >
              {chip.label}
            </Chip>
          ))}
        </div>

        {facetFilter && (
          <button
            onClick={() => setFacetFilter(null)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            {facetFilter.field}: {facetFilter.value}
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : !hasAnyResults ? (
        isFiltering ? (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-3">
            <p className="text-lg text-foreground">No keerthanas match your search</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchValue("");
                setFacetFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-4">
            <Library className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">Your collection is empty</p>
              <p className="text-muted-foreground">Add your first keerthana to get started.</p>
            </div>
            <Button className="shadow-elegant transition-smooth" onClick={() => navigate(paths.add())}>
              Add your first Keerthana
            </Button>
          </div>
        )
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="space-y-4">
              {isGrouped && (
                <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-foreground border-b border-border/30 pb-2">
                  <span className={`h-5 w-1.5 rounded-full ${groupAccentColor[groupBy] || "bg-primary"}`} aria-hidden />
                  {group} ({items.length})
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((keerthana) => (
                  <KeerthanaCard
                    key={keerthana.id}
                    keerthana={keerthana}
                    onClick={() => navigate(paths.detail(keerthana.id))}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedKeerthanas.has(keerthana.id)}
                    onSelectionChange={(selected) => toggleSelection(keerthana.id, selected)}
                    onFacetClick={handleFacetClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BulkActionBar
        count={selectedKeerthanas.size}
        onReassign={handleBulkEdit}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedKeerthanas(new Set())}
      />

      <Dialog open={showBulkEditDialog} onOpenChange={(open) => !open && setShowBulkEditDialog(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">Bulk Edit</DialogTitle>
            <DialogDescription>Update classification fields for multiple keerthanas at once</DialogDescription>
          </DialogHeader>
          <BulkEditForm
            count={selectedKeerthanas.size}
            onApply={handleApplyBulkEdit}
            onCancel={() => setShowBulkEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
