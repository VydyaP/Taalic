import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

export async function uploadFile(file: File): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Firebase Storage
    const fileRef = ref(storage, `keerthana-files/${fileName}`)
    await uploadBytes(fileRef, file)

    // Get public URL
    return await getDownloadURL(fileRef)
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
