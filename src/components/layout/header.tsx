'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useDialog } from '@/context/dialog-context';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '#services', label: 'Servicios' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Proceso' },
  { href: '#about', label: 'Nosotros' },
];

export default function Header() {
  const { setIsOpen } = useDialog();
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="#home">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => setIsOpen(true)}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            Solicitar Presupuesto
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="#home" onClick={() => setSheetOpen(false)}>
                    <Logo />
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 text-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                   <Button onClick={() => { setIsOpen(true); setSheetOpen(false);}} className="w-full">
                    Solicitar Presupuesto
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
