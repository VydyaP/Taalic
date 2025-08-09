import { supabase } from '../supabase'

export async function uploadFile(file: File): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('keerthana-files')
      .upload(fileName, file)

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('keerthana-files')
      .getPublicUrl(fileName)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}