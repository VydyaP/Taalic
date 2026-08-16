import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage'
import { storage } from '../firebase'

export async function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const fileRef = ref(storage, `keerthana-files/${fileName}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(fileRef, file)
    task.on(
      'state_changed',
      (snapshot) => {
        onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      },
      (error) => {
        console.error('Error uploading file:', error)
        reject(error)
      },
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref))
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

export async function getStorageUsage(): Promise<{ bytes: number; fileCount: number }> {
  const folderRef = ref(storage, 'keerthana-files')
  const result = await listAll(folderRef)
  const metadatas = await Promise.all(result.items.map((item) => getMetadata(item)))
  const bytes = metadatas.reduce((sum, m) => sum + (m.size || 0), 0)
  return { bytes, fileCount: metadatas.length }
}
