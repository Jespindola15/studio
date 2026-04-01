'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { VehicleFormValues, vehicleSchema } from '@/lib/validators/vehicle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Vehicle } from '@/app/administrador/vehiculos/page';

interface VehicleFormProps {
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  vehicle?: Vehicle | null;
  onClose: () => void;
}

export function VehicleForm({ onSubmit, vehicle, onClose }: VehicleFormProps) {
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
      galeriaImagenesUrls: '',
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (vehicle) {
      form.reset({
        ...vehicle,
        precio: vehicle.precio ?? '',
        galeriaImagenesUrls: vehicle.galeriaImagenesUrls?.join('\n') ?? '',
      });
    } else {
      form.reset();
    }
  }, [vehicle, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-[65vh] pr-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Audi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Q5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="kilometraje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (U$S)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Dejar vacío para 'Consultar'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="combustible"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Combustible</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Nafta">Nafta</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Electrico">Eléctrico</SelectItem>
                            <SelectItem value="Hibrido">Híbrido</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="transmision"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transmisión</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Automatica">Automática</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tipoVehiculo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de vehículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Auto">Auto</SelectItem>
                            <SelectItem value="Camioneta">Camioneta</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Utilitario">Utilitario</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles sobre el equipamiento, estado, etc."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagenPrincipalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="galeriaImagenesUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URLs de Galería de Imágenes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pegar una URL por cada línea"
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Cada URL debe estar en una nueva línea.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-8 pt-4">
              <FormField
                control={form.control}
                name="destacado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Vehículo Destacado
                      </FormLabel>
                       <FormDescription>
                        Aparecerá en la sección de destacados de la home.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="vendido"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Vehículo Vendido
                      </FormLabel>
                      <FormDescription>
                        Se marcará como no disponible en el catálogo.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
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
