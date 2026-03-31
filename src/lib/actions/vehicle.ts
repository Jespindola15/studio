'use client';
import { addDoc, collection, deleteDoc, doc, updateDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import { VehicleFormValues } from '@/lib/validators/vehicle';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function parseGalleryUrls(urlsString?: string): string[] {
  if (!urlsString) return [];
  return urlsString.split('\n').map(url => url.trim()).filter(url => url.length > 0 && (url.startsWith('http://') || url.startsWith('https://')));
}

export function createVehicle(db: Firestore, vehicleData: VehicleFormValues) {
    const dataToCreate = {
        ...vehicleData,
        precio: vehicleData.precio || null,
        galeriaImagenesUrls: parseGalleryUrls(vehicleData.galeriaImagenesUrls),
        fechaCreacion: serverTimestamp(),
    };
    
    const collectionRef = collection(db, 'vehicles');
    return addDoc(collectionRef, dataToCreate)
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: dataToCreate,
              })
            );
            throw error;
        });
}

export function updateVehicle(db: Firestore, vehicleId: string, vehicleData: Partial<VehicleFormValues>) {
    const docRef = doc(db, 'vehicles', vehicleId);
    
    const dataToUpdate: { [key: string]: any } = { ...vehicleData };
    if (vehicleData.precio === '' || vehicleData.precio === 0) {
      dataToUpdate.precio = null;
    }
    if(typeof vehicleData.galeriaImagenesUrls === 'string') {
        dataToUpdate.galeriaImagenesUrls = parseGalleryUrls(vehicleData.galeriaImagenesUrls);
    }

    return updateDoc(docRef, dataToUpdate)
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
              })
            );
            throw error;
        });
}

export function deleteVehicle(db: Firestore, vehicleId: string) {
    const docRef = doc(db, 'vehicles', vehicleId);
    return deleteDoc(docRef)
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
              })
            );
            throw error;
        });
}
