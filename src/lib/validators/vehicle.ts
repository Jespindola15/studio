import { z } from 'zod';

export const vehicleSchema = z.object({
  marca: z.string().min(1, { message: 'La marca es requerida.' }),
  modelo: z.string().min(1, { message: 'El modelo es requerido.' }),
  ano: z.coerce.number().int().min(1900, { message: 'El año debe ser válido.' }).max(new Date().getFullYear() + 2, { message: 'El año no puede ser tan a futuro.' }),
  precio: z.coerce.number().nonnegative({ message: 'El precio no puede ser negativo.' }).optional().or(z.literal('')),
  kilometraje: z.coerce.number().int().nonnegative({ message: 'El kilometraje no puede ser negativo.' }),
  combustible: z.enum(["Nafta", "Diesel", "Electrico", "Hibrido"]),
  transmision: z.enum(["Manual", "Automatica"]),
  tipoVehiculo: z.enum(["Auto", "Camioneta", "SUV", "Utilitario"]),
  descripcion: z.string().min(1, { message: 'La descripción es requerida.' }),
  destacado: z.boolean().default(false),
  vendido: z.boolean().default(false),
  imagenPrincipalUrl: z.string().url({ message: "Por favor, ingrese una URL válida." }).optional().or(z.literal('')),
  galeriaImagenesUrls: z.string().optional().describe("Una URL por línea"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
