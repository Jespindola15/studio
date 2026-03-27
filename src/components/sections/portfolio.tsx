import Image from 'next/image';
import { SectionContainer } from './container';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

const portfolioItems = [
  {
    imageId: 'portfolio-1',
    name: 'TechCorp',
    category: 'Diseño Web Corporativo',
  },
  {
    imageId: 'portfolio-2',
    name: 'ModaZen',
    category: 'E-commerce',
  },
  {
    imageId: 'portfolio-3',
    name: 'AppLaunch',
    category: 'Landing Page',
  },
  {
    imageId: 'portfolio-4',
    name: 'Financia',
    category: 'Diseño Web Corporativo',
  },
  {
    imageId: 'portfolio-5',
    name: 'CreativeFolio',
    category: 'Portfolio',
  },
  {
    imageId: 'portfolio-6',
    name: 'Wanderlust',
    category: 'Blog',
  },
];

export default function Portfolio() {
  return (
    <SectionContainer id="portfolio">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestro Trabajo</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explorá algunos de los proyectos que hemos ayudado a lanzar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item) => {
          const image = PlaceHolderImages.find((img) => img.id === item.imageId);
          if (!image) return null;

          return (
            <a href="#" key={item.name} className="group block">
              <Card className="overflow-hidden h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 bg-card/50 backdrop-blur-sm group-hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={item.name}
                      data-ai-hint={image.imageHint}
                      width={600}
                      height={450}
                      className="object-cover w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <ArrowUpRight className="absolute top-4 right-4 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-headline mb-2">{item.name}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </SectionContainer>
  );
}
