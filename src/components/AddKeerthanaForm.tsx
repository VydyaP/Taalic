import { uploadFile } from '../utils/storage'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Keerthana } from "./KeerthanaCard";

// Sample data - in a real app, these would come from a database
const ragas = ["Shankarabharanam", "Kalyani", "Kharaharapriya", "Mayamalavagowla", "Saveri", "Hanumatodi", "Natabhairavi"];
const talas = ["Adi", "Rupaka", "Khanda Chapu", "Misra Chapu", "Triputa", "Ata", "Eka"];
const composers = ["Tyagaraja", "Muthuswami Dikshitar", "Syama Sastri", "Purandara Dasa", "Annamacharya", "Kshetrayya"];
const deities = ["Rama", "Krishna", "Shiva", "Devi", "Ganesha", "Murugan", "Vishnu", "Lakshmi"];

interface AddKeerthanaFormProps {
  onAdd: (keerthana: Omit<Keerthana, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Keerthana;
}

export const AddKeerthanaForm = ({ onAdd, onCancel, initialData }: AddKeerthanaFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    raga: initialData?.raga || "",
    tala: initialData?.tala || "",
    composer: initialData?.composer || "",
    deity: initialData?.deity || "",
    dateTaught: initialData?.dateTaught ? new Date(initialData.dateTaught) : undefined as Date | undefined,
    lyrics: initialData?.lyrics || "",
    meaning: initialData?.meaning || "",
    notationFiles: initialData?.notationFiles || [] as { name: string; url: string; type: 'pdf' | 'image' }[]
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure the Select components only receive valid values so typing free text
  // into the corresponding Input does not conflict with Radix Select.
  const selectedRaga = ragas.includes(formData.raga) ? formData.raga : undefined;
  const selectedTala = talas.includes(formData.tala) ? formData.tala : undefined;
  const selectedComposer = composers.includes(formData.composer) ? formData.composer : undefined;
  const selectedDeity = deities.includes(formData.deity) ? formData.deity : undefined;

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        raga: initialData.raga || "",
        tala: initialData.tala || "",
        composer: initialData.composer || "",
        deity: initialData.deity || "",
        dateTaught: initialData.dateTaught ? new Date(initialData.dateTaught) : undefined,
        lyrics: initialData.lyrics || "",
        meaning: initialData.meaning || "",
        notationFiles: initialData.notationFiles || []
      });
    }
  }, [initialData?.id]); // Only run when the ID changes, not the entire object

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.raga && formData.tala && formData.composer && formData.deity) {
      setIsSubmitting(true);
      try {
        await onAdd({
          ...formData,
          dateTaught: formData.dateTaught ? formData.dateTaught.toISOString() : undefined as any,
        });
        if (!initialData) {
          setFormData({
            name: "",
            raga: "",
            tala: "",
            composer: "",
            deity: "",
            dateTaught: undefined,
            lyrics: "",
            meaning: "",
            notationFiles: []
          });
        }
      } catch (error) {
        console.error('Error in form submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
          {initialData ? (
            <>
              <Edit className="h-6 w-6 text-primary" />
              Edit Keerthana
            </>
          ) : (
            <>
              <Plus className="h-6 w-6 text-primary" />
              Add New Keerthana
            </>
          )}
        </CardTitle>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="ml-auto p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <X className="h-6 w-6 text-muted-foreground" />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Keerthana Name *</Label>
            <Input
              id="name"
              type="text"
              aria-label="Keerthana Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter keerthana name"
              required
              className="border-border focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Raga *</Label>
              <Input
                type="text"
                aria-label="Raga"
                value={formData.raga}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, raga: e.target.value }));
                }}
                placeholder="Type or select raga"
                className="mb-2 border-border focus:ring-primary"
                required
              />
              <Select value={selectedRaga} onValueChange={(value) => {
                setFormData(prev => ({ ...prev, raga: value }));
              }}>
                <SelectTrigger className="border-border focus:ring-primary">
                  <SelectValue placeholder="Select raga" />
                </SelectTrigger>
                <SelectContent>
                  {ragas.map((raga) => (
                    <SelectItem key={raga} value={raga}>{raga}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">Tala *</Label>
              <Input
                type="text"
                aria-label="Tala"
                value={formData.tala}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tala: e.target.value }));
                }}
                placeholder="Type or select tala"
                className="mb-2 border-border focus:ring-primary"
                required
              />
              <Select value={selectedTala} onValueChange={(value) => {
                setFormData(prev => ({ ...prev, tala: value }));
              }}>
                <SelectTrigger className="border-border focus:ring-primary">
                  <SelectValue placeholder="Select tala" />
                </SelectTrigger>
                <SelectContent>
                  {talas.map((tala) => (
                    <SelectItem key={tala} value={tala}>{tala}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Composer *</Label>
              <Input
                type="text"
                aria-label="Composer"
                value={formData.composer}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, composer: e.target.value }));
                }}
                placeholder="Type or select composer"
                className="mb-2 border-border focus:ring-primary"
                required
              />
              <Select value={selectedComposer} onValueChange={(value) => {
                setFormData(prev => ({ ...prev, composer: value }));
              }}>
                <SelectTrigger className="border-border focus:ring-primary">
                  <SelectValue placeholder="Select composer" />
                </SelectTrigger>
                <SelectContent>
                  {composers.map((composer) => (
                    <SelectItem key={composer} value={composer}>{composer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">Deity *</Label>
              <Input
                type="text"
                aria-label="Deity"
                value={formData.deity}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, deity: e.target.value }));
                }}
                placeholder="Type or select deity"
                className="mb-2 border-border focus:ring-primary"
                required
              />
              <Select value={selectedDeity} onValueChange={(value) => {
                setFormData(prev => ({ ...prev, deity: value }));
              }}>
                <SelectTrigger className="border-border focus:ring-primary">
                  <SelectValue placeholder="Select deity" />
                </SelectTrigger>
                <SelectContent>
                  {deities.map((deity) => (
                    <SelectItem key={deity} value={deity}>{deity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Date Taught (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border",
                    !formData.dateTaught && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateTaught ? format(formData.dateTaught, "PPP") : "Select date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateTaught}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dateTaught: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <Label className="text-foreground font-medium">Notation Files (Optional)</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(true);
                      try {
                        const url = await uploadFile(file);
                        const type = file.type.includes('pdf') ? 'pdf' : 'image';
                        setFormData(prev => ({
                          ...prev,
                          notationFiles: [...prev.notationFiles, { name: file.name, url, type }]
                        }));
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('File upload failed. Please try again.');
                      } finally {
                        setIsUploading(false);
                        // Clear the input so the same file can be selected again
                        e.target.value = '';
                      }
                    }
                  }}
                  className="border-border focus:ring-primary"
                  disabled={isUploading}
                />
                {isUploading && (
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                )}
              </div>
              {formData.notationFiles.length > 0 && (
                <div className="space-y-2">
                  {formData.notationFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-border rounded-md">
                      <span className="text-sm text-foreground">{file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            notationFiles: prev.notationFiles.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lyrics" className="text-foreground font-medium">Lyrics (Text - Optional)</Label>
            <Textarea
              id="lyrics"
              value={formData.lyrics}
              onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
              placeholder="Enter keerthana lyrics as text"
              className="border-border focus:ring-primary min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning" className="text-foreground font-medium">Meaning (Optional)</Label>
            <Textarea
              id="meaning"
              value={formData.meaning}
              onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
              placeholder="Enter meaning or translation"
              className="border-border focus:ring-primary min-h-24"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              style={{ transition: 'var(--transition-smooth)' }}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Keerthana" : "Add Keerthana")}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 border-border hover:bg-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};