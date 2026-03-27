import Image from 'next/image';
import { SectionContainer } from './container';
import HeroActions from './hero-actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const laptopImage = PlaceHolderImages.find((img) => img.id === 'hero-laptop');
  const phoneImage = PlaceHolderImages.find((img) => img.id === 'hero-phone');

  return (
    <SectionContainer
      id="home"
      className="!py-20 md:!py-28 lg:!py-32 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-accent "></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-accent"></div>
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Diseñamos páginas web que convierten visitas en clientes
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Creamos experiencias digitales modernas, rápidas y optimizadas para transmitir profesionalismo y aumentar la credibilidad de tu marca.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <HeroActions />
        </div>
      </div>

      <div className="relative mt-16 md:mt-24 animate-in fade-in zoom-in-90 duration-1000 delay-500">
        <div className="absolute -top-8 -left-8 -right-8 -bottom-8 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-2xl"></div>
        {laptopImage && (
            <div className="relative">
                 <Image
                    src={laptopImage.imageUrl}
                    alt={laptopImage.description}
                    data-ai-hint={laptopImage.imageHint}
                    width={1024}
                    height={683}
                    className="rounded-xl border border-border/20 shadow-2xl shadow-primary/10"
                    priority
                />
            </div>
        )}
        {phoneImage && (
            <div className="absolute -bottom-12 -right-4 md:-right-8 w-40 md:w-56">
                <Image
                    src={phoneImage.imageUrl}
                    alt={phoneImage.description}
                    data-ai-hint={phoneImage.imageHint}
                    width={300}
                    height={600}
                    className="rounded-xl border-4 border-background shadow-2xl shadow-primary/20"
                />
            </div>
        )}
      </div>
    </SectionContainer>
  );
}
