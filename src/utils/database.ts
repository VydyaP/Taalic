import { supabase } from '../supabase'
import { Keerthana } from '@/components/KeerthanaCard'

export async function fetchKeerthanas(): Promise<Keerthana[]> {
  const { data, error } = await supabase
    .from('keerthanas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert DB fields to frontend fields
  return (data || []).map((k: any) => ({
    id: k.id,
    name: k.name,
    raga: k.raga,
    tala: k.tala,
    composer: k.composer,
    deity: k.deity,
    dateTaught: k.date_taught, // <-- convert snake_case to camelCase
    lyrics: k.lyrics,
    meaning: k.meaning,
    notationFiles: k.notation_files // <-- convert snake_case to camelCase
  }));
}