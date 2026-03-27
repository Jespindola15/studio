'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDialog } from '@/context/dialog-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitQuoteRequest, type FormState } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const QuoteFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(1, 'Message is required'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Enviar Solicitud
    </Button>
  );
}

export function QuoteRequestDialog() {
  const { isOpen, setIsOpen } = useDialog();
  const { toast } = useToast();
  const [state, formAction] = useFormState<FormState, FormData>(submitQuoteRequest, { message: '', errors: {} });
  const { reset } = useForm();

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: 'Éxito',
        description: state.message,
      });
      setIsOpen(false);
      reset();
    } else if (state.message && state.errors) {
        // Optionally show a general error toast
    }
  }, [state, toast, setIsOpen, reset]);
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Solicitar Presupuesto</DialogTitle>
          <DialogDescription>
            Contanos sobre tu proyecto. Nos pondremos en contacto a la brevedad.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Tu nombre" />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" />
              {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service">Servicio de interés</Label>
              <Select name="service">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná un servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landing-page">Diseño de Landing Pages</SelectItem>
                  <SelectItem value="corporate-web">Diseño Web Corporativo</SelectItem>
                  <SelectItem value="redesign">Rediseño de páginas existentes</SelectItem>
                  <SelectItem value="social-media">Diseño visual para redes</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
               {state.errors?.service && <p className="text-sm text-destructive">{state.errors.service[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" name="message" placeholder="Contanos más sobre tu idea..." />
               {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
