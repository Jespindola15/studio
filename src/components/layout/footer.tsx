import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Github, Twitter, Dribbble } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Diseñando el futuro de la web, hoy.
            </p>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              <Dribbble size={20} />
              <span className="sr-only">Dribbble</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mediup Ascent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
