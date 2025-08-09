import { useState, useEffect } from "react";
import { Navigation, ClassificationFilter } from "@/components/Navigation";
import { KeerthanaCard, Keerthana } from "@/components/KeerthanaCard";
import { AddKeerthanaForm } from "@/components/AddKeerthanaForm";
import { sampleKeerthanas } from "@/data/sampleKeerthanas";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Triangle, Trash2, Edit } from "lucide-react";
import { useRef } from "react";
import { supabase } from "@/supabase";

function mapDbToKeerthana(k) {
  return {
    id: k.id,
    name: k.name,
    raga: k.raga,
    tala: k.tala,
    composer: k.composer,
    deity: k.deity,
    dateTaught: k.date_taught,
    lyrics: k.lyrics,
    meaning: k.meaning,
    notationFiles: k.notation_files,
  };
}

const Index = () => {
  const [keerthanas, setKeerthanas] = useState<Keerthana[]>([]);
  const [activeFilter, setActiveFilter] = useState<ClassificationFilter>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedKeerthana, setSelectedKeerthana] = useState<Keerthana | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("raga");
  const searchInputRef = useRef(null);

  useEffect(() => {
    async function loadKeerthanas() {
      const { data, error } = await supabase
        .from("keerthanas")
        .select("id, name, raga, tala, composer, deity, date_taught, lyrics, meaning, notation_files")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Error", description: "Failed to load keerthanas" });
      } else if (data) {
        setKeerthanas(data.map(mapDbToKeerthana));
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

  const addKeerthana = async (newKeerthana: Omit<Keerthana, 'id'>) => {
    const { data, error } = await supabase
      .from("keerthanas")
      .insert([
        {
          name: newKeerthana.name,
          raga: newKeerthana.raga,
          tala: newKeerthana.tala,
          composer: newKeerthana.composer,
          deity: newKeerthana.deity,
          date_taught: newKeerthana.dateTaught,
          lyrics: newKeerthana.lyrics,
          meaning: newKeerthana.meaning,
          notation_files: newKeerthana.notationFiles,
        }
      ])
      .select("id, name, raga, tala, composer, deity, date_taught, lyrics, meaning, notation_files")
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to add keerthana" });
      throw error;
    }

    setKeerthanas(prev => [mapDbToKeerthana(data), ...prev]);
    setShowAddForm(false);
    toast({
      title: "Keerthana Added",
      description: `${data.name} has been added to your collection.`,
    });
  };

  const updateKeerthana = async (keerthanaId: string, updatedData: Partial<Keerthana>) => {
    const { data, error } = await supabase
      .from("keerthanas")
      .update({
        name: updatedData.name,
        raga: updatedData.raga,
        tala: updatedData.tala,
        composer: updatedData.composer,
        deity: updatedData.deity,
        date_taught: updatedData.dateTaught,
        lyrics: updatedData.lyrics,
        meaning: updatedData.meaning,
        notation_files: updatedData.notationFiles,
      })
      .eq("id", keerthanaId)
      .select("id, name, raga, tala, composer, deity, date_taught, lyrics, meaning, notation_files")
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to update keerthana" });
      return;
    }

    setKeerthanas(prev => prev.map(k => k.id === keerthanaId ? mapDbToKeerthana(data) : k));
    setSelectedKeerthana(mapDbToKeerthana(data));
    setIsEditing(false);
    toast({ title: "Success", description: "Keerthana updated successfully" });
  };

  const deleteKeerthana = async (keerthanaId: string) => {
    const { error } = await supabase
      .from("keerthanas")
      .delete()
      .eq("id", keerthanaId);

    if (error) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation and Search UI - Hide when adding */}
      {!showAddForm && (
        <div className="flex items-center justify-between">
          <Navigation
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onAddNew={() => setShowAddForm(true)}
            totalCount={keerthanas.length}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />
        </div>
      )}
      
      <main className="max-w-7xl mx-auto p-6">
        {showAddForm ? (
          <AddKeerthanaForm
            onAdd={addKeerthana}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <div className="space-y-8">
            {isGrouped ? (
              // Grouped view
              Object.entries(filteredData as { [key: string]: Keerthana[] }).map(([group, items]) => (
                <div key={group} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border/30 pb-2">
                    {group} ({items.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((keerthana) => (
                      <KeerthanaCard
                        key={keerthana.id}
                        keerthana={keerthana}
                        onClick={() => setSelectedKeerthana(keerthana)}
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
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Keerthana Detail Dialog */}
      <Dialog open={!!selectedKeerthana && !isEditing} onOpenChange={() => {
        setSelectedKeerthana(null);
        setIsEditing(false);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {selectedKeerthana?.name}
          </DialogTitle>
          <DialogDescription>
            Keerthana details and information
          </DialogDescription>
          {selectedKeerthana && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-raga-primary text-primary-foreground text-sm font-medium">
                    {selectedKeerthana.raga}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-tala-primary text-primary-foreground text-sm font-medium">
                    {selectedKeerthana.tala}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-composer-primary text-primary-foreground text-sm font-medium">
                    {selectedKeerthana.composer}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-deity-primary text-primary-foreground text-sm font-medium">
                    {selectedKeerthana.deity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true)
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
                    onClick={() => deleteKeerthana(selectedKeerthana.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Learned on {new Date(selectedKeerthana.dateTaught).toLocaleDateString()}
              </div>
              
              {(selectedKeerthana.lyrics || selectedKeerthana.notationFiles?.length) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Notation & Lyrics</h3>
                  
                  {selectedKeerthana.notationFiles?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-foreground">Notation Files</h4>
                      <div className="space-y-4">
                        {selectedKeerthana.notationFiles.map((file, index) => (
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
                              <span className="text-xs mt-1 truncate w-full text-center">{file.name}</span>
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
      {isEditing && selectedKeerthana && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Keerthana
          </DialogTitle>
          <DialogDescription>
            Update keerthana details
          </DialogDescription>
          <AddKeerthanaForm
            onAdd={async (updatedData) => {
              await updateKeerthana(selectedKeerthana.id, updatedData);
            }}
            onCancel={() => setIsEditing(false)}
            initialData={selectedKeerthana}
          />
        </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
