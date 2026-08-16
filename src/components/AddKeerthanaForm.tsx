import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClassificationCombobox } from "@/components/ClassificationCombobox";
import { NotationFileSection, NotationFile } from "@/components/NotationFileSection";
import { Keerthana } from "./KeerthanaCard";
import { keerthanaSchema, KeerthanaFormValues } from "@/lib/schemas";
import { ragas, talas, composers, deities, notationLanguages } from "@/data/classifications";

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
  const [notationFiles, setNotationFiles] = useState<NotationFile[]>(initialData?.notationFiles || []);
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
          <p className="text-xs text-muted-foreground">
            Add whichever languages you have — one, two, or all three. You can come back later and add more,
            including a newer version of a file, without losing what's already there.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {notationLanguages.map((language) => (
              <NotationFileSection
                key={language}
                language={language}
                notationFiles={notationFiles}
                setNotationFiles={setNotationFiles}
              />
            ))}
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
            disabled={isSubmitting}
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
