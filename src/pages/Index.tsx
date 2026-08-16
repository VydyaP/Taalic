import { useState, useEffect } from "react";
import { Navigation, ClassificationFilter } from "@/components/Navigation";
import { KeerthanaCard, Keerthana } from "@/components/KeerthanaCard";
import { AddKeerthanaForm } from "@/components/AddKeerthanaForm";
import { BulkEditForm, BulkEditChanges } from "@/components/BulkEditForm";
import { PasswordModal } from "@/components/PasswordModal";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Library } from "lucide-react";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { notationLanguages } from "@/data/classifications";

function groupNotationFilesByLanguage(files: Keerthana["notationFiles"]) {
  const groups: Record<string, NonNullable<Keerthana["notationFiles"]>> = {};
  (files || []).forEach((file) => {
    // Files uploaded before language tagging existed have no `language` set — they were all Telugu.
    const key = file.language || "Telugu";
    if (!groups[key]) groups[key] = [];
    groups[key].push(file);
  });
  const orderedKeys = [
    ...notationLanguages.filter((lang) => groups[lang]),
    ...Object.keys(groups).filter((key) => !(notationLanguages as readonly string[]).includes(key)),
  ];
  return orderedKeys.map((language) => ({ language, files: groups[language] }));
}

const groupAccentColor: Record<string, string> = {
  raga: "bg-raga-primary",
  tala: "bg-tala-primary",
  composer: "bg-composer-primary",
  deity: "bg-deity-primary",
};

function mapDocToKeerthana(id: string, data: any): Keerthana {
  return {
    id,
    name: data.name,
    raga: data.raga,
    tala: data.tala,
    composer: data.composer,
    deity: data.deity,
    lyrics: data.lyrics,
    meaning: data.meaning,
    notationFiles: data.notationFiles,
  };
}

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

const Index = () => {
  const [keerthanas, setKeerthanas] = useState<Keerthana[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ClassificationFilter>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedKeerthana, setSelectedKeerthana] = useState<Keerthana | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState<"add" | "edit" | "delete">("add");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Bulk operations states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedKeerthanas, setSelectedKeerthanas] = useState<Set<string>>(new Set());
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);

  // Security code from environment variable
  const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE || "1234";

  useEffect(() => {
    async function loadKeerthanas() {
      try {
        const q = query(collection(db, "keerthanas"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setKeerthanas(snapshot.docs.map(d => mapDocToKeerthana(d.id, d.data())));
      } catch (error) {
        console.error('Error in loadKeerthanas:', error);
        toast({
          title: "Error",
          description: "Failed to load keerthanas. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    loadKeerthanas();
  }, [toast]);

  // Search + filter helpers
  const normalizedSearch = searchValue.trim().toLowerCase();
  const matchesSearch = (k: Keerthana) => {
    if (!normalizedSearch) return true;
    return [k.name, k.raga, k.tala, k.composer, k.deity]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(normalizedSearch));
  };

  const getFilteredKeerthanas = () => {
    const list = keerthanas.filter(matchesSearch);
    if (activeFilter === "all") return list;
    const groups: Record<string, Keerthana[]> = {};
    list.forEach(keerthana => {
      const key = (keerthana as any)[activeFilter] || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(keerthana);
    });
    return groups;
  };

  const handlePasswordConfirm = async (password: string) => {
    setPasswordLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === SECURITY_CODE) {
      setPasswordLoading(false);
      setShowPasswordModal(false);

      // Execute the pending action
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setPasswordLoading(false);
      toast({
        title: "Access Denied",
        description: "Incorrect security code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const requirePassword = (action: "add" | "edit" | "delete", callback: () => void) => {
    setPasswordAction(action);
    setPendingAction(() => callback);
    setShowPasswordModal(true);
  };

  // Bulk operations handlers
  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedKeerthanas(new Set());
  };

  const handleKeerthanaSelection = (keerthanaId: string, selected: boolean) => {
    const newSelected = new Set(selectedKeerthanas);
    if (selected) {
      newSelected.add(keerthanaId);
    } else {
      newSelected.delete(keerthanaId);
    }
    setSelectedKeerthanas(newSelected);
  };

  const handleBulkDelete = () => {
    requirePassword("delete", () => {
      const selectedIds = Array.from(selectedKeerthanas);
      selectedIds.forEach(id => deleteKeerthana(id));
      setSelectedKeerthanas(new Set());
      setIsSelectionMode(false);
    });
  };

  const handleBulkEdit = () => {
    requirePassword("edit", () => setShowBulkEditDialog(true));
  };

  const applyBulkEdit = async (changes: BulkEditChanges) => {
    const ids = Array.from(selectedKeerthanas);
    try {
      const batch = writeBatch(db);
      ids.forEach((id) => batch.update(doc(db, "keerthanas", id), changes));
      await batch.commit();

      setKeerthanas(prev => prev.map(k => selectedKeerthanas.has(k.id) ? { ...k, ...changes } : k));
      setShowBulkEditDialog(false);
      setSelectedKeerthanas(new Set());
      setIsSelectionMode(false);
      toast({ title: "Success", description: `Updated ${ids.length} keerthana${ids.length === 1 ? "" : "s"}.` });
    } catch (error) {
      console.error('Error in applyBulkEdit:', error);
      toast({
        title: "Error",
        description: "Failed to update selected keerthanas. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addKeerthana = async (newKeerthana: Omit<Keerthana, 'id'>) => {
    try {
      const insertData = {
        name: newKeerthana.name,
        raga: newKeerthana.raga,
        tala: newKeerthana.tala,
        composer: newKeerthana.composer,
        deity: newKeerthana.deity,
        lyrics: newKeerthana.lyrics || null,
        meaning: newKeerthana.meaning || null,
        notationFiles: newKeerthana.notationFiles && newKeerthana.notationFiles.length > 0 ? newKeerthana.notationFiles : null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "keerthanas"), insertData);
      const added = mapDocToKeerthana(docRef.id, insertData);

      setKeerthanas(prev => [added, ...prev]);
      setShowAddForm(false);
      toast({
        title: "Keerthana Added",
        description: `${added.name} has been added to your collection.`,
      });
    } catch (error) {
      console.error('Error in addKeerthana:', error);
      toast({
        title: "Error",
        description: "Failed to add keerthana. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateKeerthana = async (keerthanaId: string, updatedData: Partial<Keerthana>) => {
    try {
      const updateData = {
        name: updatedData.name,
        raga: updatedData.raga,
        tala: updatedData.tala,
        composer: updatedData.composer,
        deity: updatedData.deity,
        lyrics: updatedData.lyrics || null,
        meaning: updatedData.meaning || null,
        notationFiles: updatedData.notationFiles && updatedData.notationFiles.length > 0 ? updatedData.notationFiles : null,
      };

      await updateDoc(doc(db, "keerthanas", keerthanaId), updateData);
      const updated = mapDocToKeerthana(keerthanaId, updateData);

      setKeerthanas(prev => prev.map(k => k.id === keerthanaId ? updated : k));
      setSelectedKeerthana(updated);
      setIsEditing(false);
      toast({ title: "Success", description: "Keerthana updated successfully" });
    } catch (error) {
      console.error('Error in updateKeerthana:', error);
      toast({
        title: "Error",
        description: "Failed to update keerthana. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteKeerthana = async (keerthanaId: string) => {
    try {
      await deleteDoc(doc(db, "keerthanas", keerthanaId));
    } catch (error) {
      console.error('Error in deleteKeerthana:', error);
      toast({ title: "Error", description: "Failed to delete keerthana" });
      return;
    }

    setKeerthanas(prev => prev.filter(k => k.id !== keerthanaId));
    setSelectedKeerthana(null);
    setIsEditing(false);
    toast({ title: "Success", description: "Keerthana deleted successfully" });
  };

  const filteredData = getFilteredKeerthanas();
  const isGrouped = activeFilter !== "all";
  const hasAnyResults = isGrouped
    ? Object.keys(filteredData as Record<string, Keerthana[]>).length > 0
    : (filteredData as Keerthana[]).length > 0;
  const isFiltering = normalizedSearch.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddNew={() => requirePassword("add", () => setShowAddForm(true))}
        totalCount={keerthanas.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedKeerthanas.size}
        onToggleSelectionMode={handleToggleSelectionMode}
        onBulkDelete={handleBulkDelete}
        onBulkEdit={handleBulkEdit}
      />

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <CardGridSkeleton />
        ) : !hasAnyResults ? (
          isFiltering ? (
            <div className="flex flex-col items-center justify-center text-center py-24 space-y-3">
              <p className="text-lg text-foreground">No keerthanas match your search</p>
              <Button variant="outline" onClick={() => setSearchValue("")}>Clear search</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 space-y-4">
              <Library className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-foreground">Your collection is empty</p>
                <p className="text-muted-foreground">Add your first keerthana to get started.</p>
              </div>
              <Button
                className="shadow-elegant transition-smooth"
                onClick={() => requirePassword("add", () => setShowAddForm(true))}
              >
                Add your first Keerthana
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-8">
            {isGrouped ? (
              // Grouped view
              Object.entries(filteredData as { [key: string]: Keerthana[] }).map(([group, items]) => (
                <div key={group} className="space-y-4">
                  <h2 className="flex items-center gap-3 text-2xl font-display font-semibold text-foreground border-b border-border/30 pb-2">
                    <span className={`h-5 w-1.5 rounded-full ${groupAccentColor[activeFilter] || "bg-primary"}`} aria-hidden />
                    {group} ({items.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((keerthana) => (
                      <KeerthanaCard
                        key={keerthana.id}
                        keerthana={keerthana}
                        onClick={() => setSelectedKeerthana(keerthana)}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedKeerthanas.has(keerthana.id)}
                        onSelectionChange={(selected) => handleKeerthanaSelection(keerthana.id, selected)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // All view
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredData as Keerthana[]).map((keerthana) => (
                  <KeerthanaCard
                    key={keerthana.id}
                    keerthana={keerthana}
                    onClick={() => setSelectedKeerthana(keerthana)}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedKeerthanas.has(keerthana.id)}
                    onSelectionChange={(selected) => handleKeerthanaSelection(keerthana.id, selected)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Keerthana Dialog */}
      <Dialog open={showAddForm} onOpenChange={(open) => !open && setShowAddForm(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Add New Keerthana
            </DialogTitle>
            <DialogDescription>Add a keerthana to your collection</DialogDescription>
          </DialogHeader>
          <AddKeerthanaForm
            onAdd={addKeerthana}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={showBulkEditDialog} onOpenChange={(open) => !open && setShowBulkEditDialog(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Bulk Edit
            </DialogTitle>
            <DialogDescription>Update classification fields for multiple keerthanas at once</DialogDescription>
          </DialogHeader>
          <BulkEditForm
            count={selectedKeerthanas.size}
            onApply={applyBulkEdit}
            onCancel={() => setShowBulkEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Keerthana Detail Dialog */}
      <Dialog open={!!selectedKeerthana && !isEditing} onOpenChange={() => {
        setSelectedKeerthana(null);
        setIsEditing(false);
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogTitle className="font-display text-2xl font-bold text-foreground">
            {selectedKeerthana?.name}
          </DialogTitle>
          <DialogDescription>
            Keerthana details and information
          </DialogDescription>
          {selectedKeerthana && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category="raga" value={selectedKeerthana.raga} size="lg" showIcon={false} />
                  <CategoryBadge category="tala" value={selectedKeerthana.tala} size="lg" showIcon={false} />
                  <CategoryBadge category="composer" value={selectedKeerthana.composer} size="lg" showIcon={false} />
                  <CategoryBadge category="deity" value={selectedKeerthana.deity} size="lg" showIcon={false} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      requirePassword("edit", () => setIsEditing(true))
                    }}
                    className="flex items-center gap-2"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => requirePassword("delete", () => deleteKeerthana(selectedKeerthana.id))}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {(selectedKeerthana.lyrics || selectedKeerthana.notationFiles?.length) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Notation & Lyrics</h3>

                  {selectedKeerthana.notationFiles?.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-medium text-foreground">Notation Files</h4>
                      {groupNotationFilesByLanguage(selectedKeerthana.notationFiles).map(({ language, files }) => (
                        <div key={language} className="space-y-3">
                          <h5 className="text-sm font-semibold text-muted-foreground">{language}</h5>
                          <div className="space-y-4">
                            {files.map((file, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-3 p-2 border border-border rounded-lg bg-muted/20">
                                  <span className="text-sm font-medium text-foreground">{file.name}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(file.url, '_blank')}
                                    className="ml-auto"
                                  >
                                    Open in New Tab
                                  </Button>
                                </div>
                                <div className="border border-border rounded-lg overflow-hidden">
                                  {file.type === 'pdf' ? (
                                    <iframe
                                      src={file.url}
                                      className="w-full h-96"
                                      title={file.name}
                                    />
                                  ) : (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="w-full max-h-96 object-contain"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedKeerthana.lyrics && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-foreground">Lyrics</h4>
                      {/* Gallery/preview for notation files */}
                      {selectedKeerthana.notationFiles?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-2">
                          {selectedKeerthana.notationFiles.map((file, idx) => (
                            <div key={idx} className="flex flex-col items-center w-32">
                              {file.type === 'pdf' ? (
                                <div className="w-full h-32 border rounded bg-muted flex items-center justify-center overflow-hidden">
                                  <iframe
                                    src={file.url}
                                    className="w-full h-full"
                                    title={file.name}
                                  />
                                </div>
                              ) : (
                                <button
                                  className="w-full h-32 border rounded bg-muted flex items-center justify-center overflow-hidden"
                                  onClick={() => window.open(file.url, '_blank')}
                                  title="Click to enlarge"
                                >
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="object-contain max-h-32 max-w-full"
                                  />
                                </button>
                              )}
                              <span className="text-xs mt-1 truncate w-full text-center">
                                {file.name} ({file.language || "Telugu"})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Lyrics text */}
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                        {selectedKeerthana.lyrics}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedKeerthana.meaning && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Meaning</h3>
                  <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {selectedKeerthana.meaning}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Keerthana Dialog */}
      <Dialog open={isEditing && !!selectedKeerthana} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Edit Keerthana
            </DialogTitle>
            <DialogDescription>Update keerthana details</DialogDescription>
          </DialogHeader>
          {selectedKeerthana && (
            <AddKeerthanaForm
              onAdd={async (updatedData) => {
                await updateKeerthana(selectedKeerthana.id, updatedData);
              }}
              onCancel={() => setIsEditing(false)}
              initialData={selectedKeerthana}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirm}
        title={
          passwordAction === "add" ? "Add New Keerthana" :
          passwordAction === "edit" ? "Edit Keerthana" :
          "Delete Keerthana"
        }
        description={
          passwordAction === "add" ? "Enter security code to add a new keerthana to your collection." :
          passwordAction === "edit" ? "Enter security code to edit keerthana details." :
          "Enter security code to permanently delete this keerthana. This action cannot be undone."
        }
        action={passwordAction}
        isLoading={passwordLoading}
      />
    </div>
  );
};

export default Index;
