'use client';

import { useDialog } from '@/context/dialog-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaActions() {
  const { setIsOpen } = useDialog();

  return (
    <Button
      size="lg"
      onClick={() => setIsOpen(true)}
      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg shadow-black/20 hover:scale-105 transition-all"
    >
      Quiero mi web
      <ArrowRight className="ml-2" />
    </Button>
  );
}
