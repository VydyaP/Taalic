import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEditGate } from "@/gate/EditGateProvider";
import { paths } from "@/routes/paths";
import { notationLanguages } from "@/data/classifications";
import { useKeerthanas, useDeleteKeerthana } from "@/lib/keerthanas";
import { Keerthana } from "@/components/KeerthanaCard";

function filesByLanguage(files: Keerthana["notationFiles"]) {
  const map: Record<string, NonNullable<Keerthana["notationFiles"]>> = {};
  (files || []).forEach((file) => {
    // Files uploaded before language tagging existed have no `language` set — they were all Telugu.
    const key = file.language || "Telugu";
    (map[key] ||= []).push(file);
  });
  return map;
}

const fields: { key: "raga" | "tala" | "composer" | "deity"; label: string }[] = [
  { key: "raga", label: "Raga" },
  { key: "tala", label: "Tala" },
  { key: "composer", label: "Composer" },
  { key: "deity", label: "Deity" },
];

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requireCode } = useEditGate();
  const { data: keerthanas = [], isLoading } = useKeerthanas();
  const deleteMutation = useDeleteKeerthana();

  const keerthana = keerthanas.find((k) => k.id === id);

  useEffect(() => {
    if (!isLoading && !keerthana) {
      navigate(paths.home(), { replace: true });
    }
  }, [isLoading, keerthana, navigate]);

  const handleDelete = () => {
    requireCode("delete", async () => {
      if (!id) return;
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Success", description: "Keerthana deleted successfully" });
        navigate(paths.home());
      } catch (error) {
        console.error('Error in deleteKeerthana:', error);
        toast({ title: "Error", description: "Failed to delete keerthana", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!keerthana) return null;

  const notationByLanguage = filesByLanguage(keerthana.notationFiles);

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to={paths.home()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
      >
        <ArrowLeft className="h-4 w-4" />
        Collection
      </Link>

      <div className="bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
        <div>
          <p className="label-caps">{keerthana.composer}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mt-2">
            {keerthana.name}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <p className="label-caps">{label}</p>
              <p className="text-foreground font-medium mt-1">{keerthana[key]}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => requireCode("edit", () => navigate(paths.edit(keerthana.id)))}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 space-y-2">
          <h2 className="font-display text-xl font-bold text-foreground">Lyrics</h2>
          {keerthana.lyrics ? (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{keerthana.lyrics}</p>
          ) : (
            <p className="text-muted-foreground">Not added yet.</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 space-y-2">
          <h2 className="font-display text-xl font-bold text-foreground">Meaning</h2>
          {keerthana.meaning ? (
            <p className="text-muted-foreground leading-relaxed">{keerthana.meaning}</p>
          ) : (
            <p className="text-muted-foreground">Not added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">Notation</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {notationLanguages.map((language) => {
            const files = notationByLanguage[language] || [];
            return (
              <div key={language} className="bg-card border border-border rounded-2xl shadow-card p-4 space-y-3">
                <div>
                  <p className="font-medium text-foreground">{language}</p>
                  <p className="label-caps">{files.length} file{files.length === 1 ? "" : "s"}</p>
                </div>
                {files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => window.open(file.url, '_blank')}
                        className="w-full flex items-center gap-2 text-left text-sm p-2 rounded-lg border border-border hover:border-primary transition-smooth"
                      >
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-lg py-6 text-center">
                    <p className="text-sm text-muted-foreground">No notation yet</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
