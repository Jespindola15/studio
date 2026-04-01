'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { VehicleFormValues, vehicleSchema } from '@/lib/validators/vehicle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, X } from 'lucide-react';
import type { Vehicle } from '@/lib/types';

interface VehicleFormProps {
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  vehicle?: Vehicle | null;
  onClose: () => void;
}

export function VehicleForm({ onSubmit, vehicle, onClose }: VehicleFormProps) {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(vehicle?.imagenPrincipalUrl || null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(vehicle?.galeriaImagenesUrls || []);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      precio: '',
      kilometraje: 0,
      combustible: 'Nafta',
      transmision: 'Manual',
      tipoVehiculo: 'Auto',
      descripcion: '',
      destacado: false,
      vendido: false,
      imagenPrincipalUrl: '',
      galeriaImagenesUrls: JSON.stringify([]),
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (vehicle) {
      form.reset({
        ...vehicle,
        precio: vehicle.precio ?? '',
        imagenPrincipalUrl: vehicle.imagenPrincipalUrl,
        galeriaImagenesUrls: JSON.stringify(vehicle.galeriaImagenesUrls || []),
      });
      setMainImagePreview(vehicle.imagenPrincipalUrl || null);
      setGalleryPreviews(vehicle.galeriaImagenesUrls || []);
    } else {
      form.reset();
      setMainImagePreview(null);
      setGalleryPreviews([]);
    }
  }, [vehicle, form]);

  const mainImageFile = form.watch('imagenPrincipalFile');
  useEffect(() => {
    if (mainImageFile && mainImageFile.length > 0) {
      const file = mainImageFile[0];
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [mainImageFile]);

  const galleryImageFiles = form.watch('galeriaImagenesFiles');
  useEffect(() => {
    if (galleryImageFiles && galleryImageFiles.length > 0) {
      const newPreviews = Array.from(galleryImageFiles).map(file => URL.createObjectURL(file as File));
      setGalleryPreviews(prev => [...prev.filter(p => p.startsWith('https://')), ...newPreviews]);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    }
  }, [galleryImageFiles]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });
  
  const handleRemoveGalleryImage = (index: number, url: string) => {
    const updatedPreviews = [...galleryPreviews];
    updatedPreviews.splice(index, 1);
    setGalleryPreviews(updatedPreviews);

    const currentUrls: string[] = JSON.parse(form.getValues('galeriaImagenesUrls') || '[]');
    const updatedUrls = currentUrls.filter(u => u !== url);
    form.setValue('galeriaImagenesUrls', JSON.stringify(updatedUrls));
  };


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-[65vh] pr-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField name="marca" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Ej: Audi" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField name="modelo" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Ej: Q5" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>

            <div className="grid grid-cols-3 gap-4">
               <FormField name="ano" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
               <FormField name="kilometraje" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Kilometraje</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
               <FormField name="precio" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Precio (U$S)</FormLabel><FormControl><Input type="number" placeholder="Dejar vacío para 'Consultar'" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                <FormField name="combustible" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Combustible</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nafta">Nafta</SelectItem><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Electrico">Eléctrico</SelectItem><SelectItem value="Hibrido">Híbrido</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField name="transmision" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Transmisión</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Manual">Manual</SelectItem><SelectItem value="Automatica">Automática</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField name="tipoVehiculo" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tipo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Camioneta">Camioneta</SelectItem><SelectItem value="SUV">SUV</SelectItem><SelectItem value="Utilitario">Utilitario</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            </div>

            <FormField name="descripcion" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea placeholder="Detalles sobre el equipamiento, estado, etc." className="resize-y min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem> )} />

            {/* Main Image Upload */}
            <FormField
              control={form.control}
              name="imagenPrincipalFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen Principal</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                        {mainImagePreview ? (
                          <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="main-image-upload" className="cursor-pointer">
                          {mainImagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                          <input type="file" id="main-image-upload" accept="image/*" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                        </label>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Gallery Images Upload */}
            <FormField
              control={form.control}
              name="galeriaImagenesFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Galería de Imágenes</FormLabel>
                   <FormControl>
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="gallery-images-upload" className="cursor-pointer">
                           <Upload className="mr-2 h-4 w-4" /> Agregar Imágenes
                          <input type="file" id="gallery-images-upload" multiple accept="image/*" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                        </label>
                      </Button>
                  </FormControl>
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {galleryPreviews.map((url, index) => (
                      <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden group">
                        <Image src={url} alt={`Preview ${index + 1}`} fill className="object-cover" />
                         {url.startsWith('https://') && (
                           <Button 
                              type="button" 
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveGalleryImage(index, url)}
                            >
                              <X className="h-4 w-4" />
                           </Button>
                         )}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flags */}
            <div className="flex space-x-8 pt-4">
              <FormField name="destacado" control={form.control} render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div><FormLabel>Vehículo Destacado</FormLabel><FormDescription>Aparecerá en la sección de destacados de la home.</FormDescription></div></FormItem> )} />
              <FormField name="vendido" control={form.control} render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div><FormLabel>Vehículo Vendido</FormLabel><FormDescription>Se marcará como no disponible en el catálogo.</FormDescription></div></FormItem> )} />
            </div>
          </div>
        </ScrollArea>
        <div className="pt-6 flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (vehicle ? 'Guardando...' : 'Creando...') : (vehicle ? 'Guardar Cambios' : 'Crear Vehículo')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
