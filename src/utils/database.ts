import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { Keerthana } from '@/components/KeerthanaCard'

export async function fetchKeerthanas(): Promise<Keerthana[]> {
  const q = query(collection(db, 'keerthanas'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Keerthana));
}
