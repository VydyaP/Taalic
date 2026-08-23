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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import { Keerthana } from "@/components/KeerthanaCard";
import { BulkEditChanges } from "@/components/BulkEditForm";

export const KEERTHANAS_QUERY_KEY = ["keerthanas"] as const;

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

export async function fetchKeerthanas(): Promise<Keerthana[]> {
  const q = query(collection(db, "keerthanas"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDocToKeerthana(d.id, d.data()));
}

export function useKeerthanas() {
  return useQuery({ queryKey: KEERTHANAS_QUERY_KEY, queryFn: fetchKeerthanas });
}

async function addKeerthana(newKeerthana: Omit<Keerthana, "id">): Promise<void> {
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
  await addDoc(collection(db, "keerthanas"), insertData);
}

async function updateKeerthana({ id, data }: { id: string; data: Partial<Keerthana> }): Promise<void> {
  const updateData = {
    name: data.name,
    raga: data.raga,
    tala: data.tala,
    composer: data.composer,
    deity: data.deity,
    lyrics: data.lyrics || null,
    meaning: data.meaning || null,
    notationFiles: data.notationFiles && data.notationFiles.length > 0 ? data.notationFiles : null,
  };
  await updateDoc(doc(db, "keerthanas", id), updateData);
}

async function deleteKeerthana(id: string): Promise<void> {
  await deleteDoc(doc(db, "keerthanas", id));
}

async function bulkDeleteKeerthanas(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, "keerthanas", id)));
  await batch.commit();
}

async function bulkEditKeerthanas({ ids, changes }: { ids: string[]; changes: BulkEditChanges }): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.update(doc(db, "keerthanas", id), { ...changes }));
  await batch.commit();
}

function useInvalidateKeerthanas() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: KEERTHANAS_QUERY_KEY });
}

export function useAddKeerthana() {
  const invalidate = useInvalidateKeerthanas();
  return useMutation({ mutationFn: addKeerthana, onSuccess: invalidate });
}

export function useUpdateKeerthana() {
  const invalidate = useInvalidateKeerthanas();
  return useMutation({ mutationFn: updateKeerthana, onSuccess: invalidate });
}

export function useDeleteKeerthana() {
  const invalidate = useInvalidateKeerthanas();
  return useMutation({ mutationFn: deleteKeerthana, onSuccess: invalidate });
}

export function useBulkDeleteKeerthanas() {
  const invalidate = useInvalidateKeerthanas();
  return useMutation({ mutationFn: bulkDeleteKeerthanas, onSuccess: invalidate });
}

export function useBulkEditKeerthanas() {
  const invalidate = useInvalidateKeerthanas();
  return useMutation({ mutationFn: bulkEditKeerthanas, onSuccess: invalidate });
}
