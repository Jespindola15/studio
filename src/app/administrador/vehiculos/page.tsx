'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useStorage } from '@/firebase';
import { collection, orderBy, query, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createVehicle, deleteVehicle, updateVehicle } from '@/lib/actions/vehicle';
import { VehicleForm, VehicleFormValues } from '@/components/admin/VehicleForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Vehicle } from '@/lib/types';

export default function VehiculosPage() {
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const vehiclesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'vehicles'), orderBy('fechaCreacion', 'desc'));
  }, [db]);

  const { data: vehicles, isLoading } = useCollection<Omit<Vehicle, 'id'>>(vehiclesQuery);

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle(db, storage, vehicleToDelete);
      toast({
        title: 'Vehículo eliminado',
        description: `El vehículo ${vehicleToDelete.marca} ${vehicleToDelete.modelo} ha sido eliminado.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el vehículo. Por favor, intente de nuevo.',
      });
      console.error(error);
    } finally {
      setIsAlertOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleFormSubmit = async (values: VehicleFormValues) => {
    try {
      if (selectedVehicle) {
        await updateVehicle(db, storage, selectedVehicle, values);
        toast({
          title: 'Vehículo actualizado',
          description: `El vehículo ${values.marca} ${values.modelo} ha sido actualizado.`,
        });
      } else {
        await createVehicle(db, storage, values);
        toast({
          title: 'Vehículo creado',
          description: `El vehículo ${values.marca} ${values.modelo} ha sido creado.`,
        });
      }
      setIsDialogOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No se pudo guardar el vehículo. Por favor, intente de nuevo.',
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehículos</h1>
        <Button onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4" /> Crear Vehículo</Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando vehículos...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && vehicles?.length === 0 && (
               <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            )}
            {vehicles?.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  <div>{vehicle.marca} {vehicle.modelo}</div>
                  <div className="text-sm text-muted-foreground">{vehicle.kilometraje.toLocaleString()} km</div>
                </TableCell>
                <TableCell>{vehicle.ano}</TableCell>
                <TableCell>{vehicle.precio ? `U$S ${vehicle.precio.toLocaleString()}`: 'Consultar'}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 items-start">
                    {vehicle.vendido && <Badge variant="destructive">Vendido</Badge>}
                    {vehicle.destacado && <Badge variant="secondary">Destacado</Badge>}
                    {!vehicle.vendido && !vehicle.destacado && <Badge variant="outline">Disponible</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteRequest(vehicle)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedVehicle ? 'Editar Vehículo' : 'Crear Vehículo'}</DialogTitle>
            <DialogDescription>
              {selectedVehicle ? 'Modificá los detalles del vehículo.' : 'Completá el formulario para agregar un nuevo vehículo.'}
            </DialogDescription>
          </DialogHeader>
          <VehicleForm
            onSubmit={handleFormSubmit}
            vehicle={selectedVehicle}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo
              <span className="font-bold"> {vehicleToDelete?.marca} {vehicleToDelete?.modelo}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
