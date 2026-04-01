'use client';
import { collection, deleteDoc, doc, updateDoc, Firestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { Storage } from 'firebase/storage';
import { VehicleFormValues } from '@/lib/validators/vehicle';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { uploadImage, deleteImage } from './storage';
import type { Vehicle } from '@/lib/types';

async function handleImageUploads(storage: Storage, vehicleId: string, values: VehicleFormValues, existingVehicle?: Vehicle | null) {
    let imagenPrincipalUrl = existingVehicle?.imagenPrincipalUrl || '';
    
    // Upload new main image if provided
    if (values.imagenPrincipalFile && values.imagenPrincipalFile.length > 0) {
        if (imagenPrincipalUrl) {
            await deleteImage(storage, imagenPrincipalUrl);
        }
        imagenPrincipalUrl = await uploadImage(storage, values.imagenPrincipalFile[0], `vehicles/${vehicleId}`);
    }

    // Handle gallery images
    let galeriaImagenesUrls = existingVehicle?.galeriaImagenesUrls || [];
    
    // Delete images that were removed in the form
    const keptUrls = JSON.parse(values.galeriaImagenesUrls || '[]');
    const urlsToDelete = galeriaImagenesUrls.filter(url => !keptUrls.includes(url));
    for (const url of urlsToDelete) {
        await deleteImage(storage, url);
    }
    galeriaImagenesUrls = keptUrls;

    // Upload new gallery images if provided
    if (values.galeriaImagenesFiles && values.galeriaImagenesFiles.length > 0) {
        for (const file of Array.from(values.galeriaImagenesFiles as FileList)) {
            const newUrl = await uploadImage(storage, file, `vehicles/${vehicleId}`);
            galeriaImagenesUrls.push(newUrl);
        }
    }

    return { imagenPrincipalUrl, galeriaImagenesUrls };
}


export async function createVehicle(db: Firestore, storage: Storage, vehicleData: VehicleFormValues) {
    const newVehicleRef = doc(collection(db, 'vehicles'));
    const vehicleId = newVehicleRef.id;

    const { imagenPrincipalUrl, galeriaImagenesUrls } = await handleImageUploads(storage, vehicleId, vehicleData);

    const dataToCreate = {
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        ano: vehicleData.ano,
        kilometraje: vehicleData.kilometraje,
        precio: vehicleData.precio === '' || vehicleData.precio === 0 ? null : vehicleData.precio,
        combustible: vehicleData.combustible,
        transmision: vehicleData.transmision,
        tipoVehiculo: vehicleData.tipoVehiculo,
        descripcion: vehicleData.descripcion,
        destacado: vehicleData.destacado,
        vendido: vehicleData.vendido,
        imagenPrincipalUrl,
        galeriaImagenesUrls,
        fechaCreacion: serverTimestamp(),
    };
    
    return setDoc(newVehicleRef, dataToCreate)
        .catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: newVehicleRef.path,
                operation: 'create',
                requestResourceData: dataToCreate,
              })
            );
            throw error;
        });
}

export async function updateVehicle(db: Firestore, storage: Storage, existingVehicle: Vehicle, vehicleData: VehicleFormValues) {
    const docRef = doc(db, 'vehicles', existingVehicle.id);
    
    const { imagenPrincipalUrl, galeriaImagenesUrls } = await handleImageUploads(storage, existingVehicle.id, vehicleData, existingVehicle);
    
    const dataToUpdate = {
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        ano: vehicleData.ano,
        kilometraje: vehicleData.kilometraje,
        precio: vehicleData.precio === '' || vehicleData.precio === 0 ? null : vehicleData.precio,
        combustible: vehicleData.combustible,
        transmision: vehicleData.transmision,
        tipoVehiculo: vehicleData.tipoVehiculo,
        descripcion: vehicleData.descripcion,
        destacado: vehicleData.destacado,
        vendido: vehicleData.vendido,
        imagenPrincipalUrl,
        galeriaImagenesUrls,
    };

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

export async function deleteVehicle(db: Firestore, storage: Storage, vehicle: Vehicle) {
    const docRef = doc(db, 'vehicles', vehicle.id);

    // Delete all images from storage first
    if (vehicle.imagenPrincipalUrl) {
        await deleteImage(storage, vehicle.imagenPrincipalUrl);
    }
    if (vehicle.galeriaImagenesUrls) {
        for (const url of vehicle.galeriaImagenesUrls) {
            await deleteImage(storage, url);
        }
    }

    // Then delete the firestore document
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
