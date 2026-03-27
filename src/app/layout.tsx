import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DialogProvider } from '@/context/dialog-context';

export const metadata: Metadata = {
  title: 'Mediup Ascent',
  description:
    'Diseñamos páginas web que convierten visitas en clientes. Creamos experiencias digitales modernas, rápidas y optimizadas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <DialogProvider>
          {children}
          <Toaster />
        </DialogProvider>
      </body>
    </html>
  );
}
