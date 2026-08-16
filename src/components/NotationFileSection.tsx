import { useState } from "react";
import { uploadFile } from "@/utils/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type NotationFile = { name: string; url: string; type: 'pdf' | 'image'; language?: string };

interface NotationFileSectionProps {
  language: string;
  notationFiles: NotationFile[];
  setNotationFiles: React.Dispatch<React.SetStateAction<NotationFile[]>>;
}

export function NotationFileSection({ language, notationFiles, setNotationFiles }: NotationFileSectionProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Files uploaded before language tagging existed have no `language` set —
  // they were all Telugu, so treat untagged files as Telugu here.
  const files = notationFiles.filter((f) => f.language === language || (!f.language && language === "Telugu"));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadFile(file, setProgress);
      const type: 'pdf' | 'image' = file.type.includes('pdf') ? 'pdf' : 'image';
      setNotationFiles((prev) => [...prev, { name: file.name, url, type, language }]);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: `Could not upload the ${language} file. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  const removeFile = (url: string) => {
    setNotationFiles((prev) => prev.filter((f) => f.url !== url));
  };

  return (
    <div className="space-y-2 p-3 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{language}</span>
        {files.length > 0 && (
          <span className="text-xs text-muted-foreground">{files.length} file{files.length === 1 ? "" : "s"}</span>
        )}
      </div>
      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading... {progress}%
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
      {files.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {files.map((file) => (
            <div key={file.url} className="flex items-center justify-between text-sm bg-muted/30 rounded px-2 py-1.5">
              <span className="truncate text-foreground">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(file.url)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
