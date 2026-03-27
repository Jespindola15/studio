
'use server';

import { z } from 'zod';

const quoteSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce una dirección de correo electrónico válida.' }),
  service: z.string().min(1, { message: 'Por favor, selecciona un servicio.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

export type FormState = {
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        service?: string[];
        message?: string[];
    }
}

export async function submitQuoteRequest(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = quoteSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    };
  }

  // In a real application, you would send this data to your backend,
  // send an email, or store it in a database.
  console.log('New Quote Request:', validatedFields.data);

  return { message: '¡Gracias! Tu solicitud ha sido enviada con éxito.' };
}
