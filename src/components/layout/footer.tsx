import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Tu próximo vehículo, a un click de distancia.
            </p>
          </div>
          <nav className="flex gap-6">
             <Link href="/catalogo" className="text-sm text-muted-foreground hover:text-foreground">Catálogo</Link>
             <Link href="/quienes-somos" className="text-sm text-muted-foreground hover:text-foreground">Quiénes Somos</Link>
             <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground">Contacto</Link>
          </nav>
          <div className="flex items-center gap-6 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutoHaus. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
