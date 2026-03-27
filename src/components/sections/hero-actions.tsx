'use client';

import { useDialog } from '@/context/dialog-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroActions() {
  const { setIsOpen } = useDialog();
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Button
        size="lg"
        onClick={() => setIsOpen(true)}
        className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
      >
        Solicitar Presupuesto
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href="#portfolio">Ver Portfolio</Link>
      </Button>
    </div>
  );
}
