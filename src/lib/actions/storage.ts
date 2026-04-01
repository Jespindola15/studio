'use client';
import { ref, uploadBytes, getDownloadURL, deleteObject, Storage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(storage: Storage, file: File, folder: string): Promise<string> {
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = `${folder}/${fileName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

export async function deleteImage(storage: Storage, imageUrl: string): Promise<void> {
  // Can't delete from a public URL. Must convert gs:// or https:// URL to a ref.
  // This is safer and more robust.
  if (!imageUrl.includes('firebasestorage.googleapis.com')) {
    console.warn('Attempted to delete a non-firebase storage image, skipping:', imageUrl);
    return;
  }
  
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      // It's okay if the object doesn't exist, maybe it was already deleted.
      console.log('Image not found for deletion, it might have been already removed.');
    } else {
      console.error("Error deleting image from storage:", error);
      // Decide if you want to throw the error or not. For now, we'll just log it.
    }
  }
}
