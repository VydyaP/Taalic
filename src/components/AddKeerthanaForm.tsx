import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFile } from "../utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClassificationCombobox } from "@/components/ClassificationCombobox";
import { Loader2, X } from "lucide-react";
import { Keerthana } from "./KeerthanaCard";
import { keerthanaSchema, KeerthanaFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { ragas, talas, composers, deities } from "@/data/classifications";

type NotationFile = { name: string; url: string; type: 'pdf' | 'image' };

interface AddKeerthanaFormProps {
  onAdd: (keerthana: Omit<Keerthana, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Keerthana;
}

const emptyValues: KeerthanaFormValues = {
  name: "",
  raga: "",
  tala: "",
  composer: "",
  deity: "",
  lyrics: "",
  meaning: "",
};

export const AddKeerthanaForm = ({ onAdd, onCancel, initialData }: AddKeerthanaFormProps) => {
  const { toast } = useToast();
  const [notationFiles, setNotationFiles] = useState<NotationFile[]>(initialData?.notationFiles || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<KeerthanaFormValues>({
    resolver: zodResolver(keerthanaSchema),
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          raga: initialData.raga || "",
          tala: initialData.tala || "",
          composer: initialData.composer || "",
          deity: initialData.deity || "",
          lyrics: initialData.lyrics || "",
          meaning: initialData.meaning || "",
        }
      : emptyValues,
  });

  // Reset when switching which keerthana is being edited (not on every re-render)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        raga: initialData.raga || "",
        tala: initialData.tala || "",
        composer: initialData.composer || "",
        deity: initialData.deity || "",
        lyrics: initialData.lyrics || "",
        meaning: initialData.meaning || "",
      });
      setNotationFiles(initialData.notationFiles || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadFile(file, setUploadProgress);
      const type: 'pdf' | 'image' = file.type.includes('pdf') ? 'pdf' : 'image';
      setNotationFiles((prev) => [...prev, { name: file.name, url, type }]);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const onSubmit = async (values: KeerthanaFormValues) => {
    setIsSubmitting(true);
    try {
      await onAdd({ ...values, notationFiles });
      if (!initialData) {
        form.reset(emptyValues);
        setNotationFiles([]);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keerthana Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter keerthana name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="raga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raga *</FormLabel>
                <FormControl>
                  <ClassificationCombobox
                    label="Raga"
                    options={ragas}
                    value={field.value}
                    onChange={field.onChange}
                    category="raga"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tala"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tala *</FormLabel>
                <FormControl>
                  <ClassificationCombobox
                    label="Tala"
                    options={talas}
                    value={field.value}
                    onChange={field.onChange}
                    category="tala"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="composer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Composer *</FormLabel>
                <FormControl>
                  <ClassificationCombobox
                    label="Composer"
                    options={composers}
                    value={field.value}
                    onChange={field.onChange}
                    category="composer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deity *</FormLabel>
                <FormControl>
                  <ClassificationCombobox
                    label="Deity"
                    options={deities}
                    value={field.value}
                    onChange={field.onChange}
                    category="deity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Notation Files (Optional)</label>
          <div className="space-y-3">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading... {uploadProgress}%
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}
            {notationFiles.length > 0 && (
              <div className="space-y-2">
                {notationFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-border rounded-md">
                    <span className="text-sm text-foreground truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setNotationFiles((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="lyrics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lyrics (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter keerthana lyrics as text" className="min-h-24" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meaning (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter meaning or translation" className="min-h-24" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 shadow-elegant transition-smooth"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Keerthana" : "Add Keerthana")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
