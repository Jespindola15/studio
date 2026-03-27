'use client';

import { useDialog } from '@/context/dialog-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaActions() {
  const { setIsOpen } = useDialog();

  return (
    <Button size="lg" onClick={() => setIsOpen(true)}>
      Solicitar Presupuesto
      <ArrowRight className="ml-2" />
    </Button>
  );
}
