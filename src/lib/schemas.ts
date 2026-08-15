import { z } from "zod";

export const keerthanaSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  raga: z.string().trim().min(1, "Raga is required"),
  tala: z.string().trim().min(1, "Tala is required"),
  composer: z.string().trim().min(1, "Composer is required"),
  deity: z.string().trim().min(1, "Deity is required"),
  lyrics: z.string().optional(),
  meaning: z.string().optional(),
});

export type KeerthanaFormValues = z.infer<typeof keerthanaSchema>;
