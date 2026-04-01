import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileListSchema = (message: string) => z.any()
  .refine((files) => files && files.length > 0, message)
  .refine((files) => Array.from(files as File[]).every((file) => file.size <= MAX_FILE_SIZE), `Cada archivo no debe superar 5MB.`)
  .refine((files) => Array.from(files as File[]).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Solo se aceptan formatos .jpg, .jpeg, .png y .webp.");

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
  
  imagenPrincipalUrl: z.string().url().optional().or(z.literal('')),
  galeriaImagenesUrls: z.string().optional(),

  imagenPrincipalFile: z.any().optional(),
  galeriaImagenesFiles: z.any().optional(),
}).refine(data => data.imagenPrincipalUrl || (data.imagenPrincipalFile && data.imagenPrincipalFile.length > 0), {
    message: "La imagen principal es requerida.",
    path: ["imagenPrincipalFile"],
});


export type VehicleFormValues = z.infer<typeof vehicleSchema>;
