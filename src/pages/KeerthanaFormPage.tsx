import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AddKeerthanaForm } from "@/components/AddKeerthanaForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { paths } from "@/routes/paths";
import { useKeerthanas, useAddKeerthana, useUpdateKeerthana } from "@/lib/keerthanas";
import { Keerthana } from "@/components/KeerthanaCard";

export default function KeerthanaFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: keerthanas = [], isLoading } = useKeerthanas();
  const addMutation = useAddKeerthana();
  const updateMutation = useUpdateKeerthana();

  const existing = isEditing ? keerthanas.find((k) => k.id === id) : undefined;

  useEffect(() => {
    if (isEditing && !isLoading && !existing) {
      navigate(paths.home(), { replace: true });
    }
  }, [isEditing, isLoading, existing, navigate]);

  const handleSubmit = async (data: Omit<Keerthana, 'id'>) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data });
        toast({ title: "Success", description: "Keerthana updated successfully" });
        navigate(paths.detail(id));
      } else {
        await addMutation.mutateAsync(data);
        toast({ title: "Keerthana Added", description: `${data.name} has been added to your collection.` });
        navigate(paths.home());
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update keerthana. Please try again." : "Failed to add keerthana. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(isEditing && id ? paths.detail(id) : paths.home());
  };

  if (isEditing && isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isEditing && !existing) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        to={isEditing && id ? paths.detail(id) : paths.home()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEditing ? "Back to keerthana" : "Collection"}
      </Link>

      <div>
        <p className="label-caps">{isEditing ? "Refine a song" : "Add to the archive"}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">
          {isEditing ? "Edit Keerthana" : "Add New Keerthana"}
        </h1>
      </div>

      <AddKeerthanaForm onAdd={handleSubmit} onCancel={handleCancel} initialData={existing} />
    </div>
  );
}
