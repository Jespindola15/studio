
import { DocumentProcessor } from '@/components/DocumentProcessor';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden border border-black/5">
        <div className="p-8 md:p-12">
          <DocumentProcessor />
        </div>
      </div>
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>© 2026 MediaUp - hecho por Joaquin Espindola</p>
      </footer>
    </main>
  );
}
