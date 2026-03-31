import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Car, Check, Handshake, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


// I'll build out the full page structure here. I can extract components later.

function Section({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn("py-16 md:py-24 lg:py-32", className)} {...props}>
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </section>
  );
}

function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-car');

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center text-white">
      <div className="absolute inset-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-white drop-shadow-2xl">
          El auto de tus sueños, a tu alcance
        </h1>
        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto drop-shadow-lg">
          Explorá nuestro catálogo de vehículos seminuevos seleccionados y encontrá tu próximo auto con la confianza y respaldo que merecés.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
            <Link href="/catalogo">
              Ver Catálogo
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

const benefits = [
  {
    icon: <Car className="w-8 h-8" />,
    title: "Financiación Flexible",
    description: "Planes a tu medida para que puedas acceder a tu próximo vehículo sin complicaciones."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Vehículos Verificados",
    description: "Cada auto pasa por una rigurosa inspección de más de 150 puntos para tu tranquilidad."
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: "Atención Personalizada",
    description: "Te asesoramos en cada paso del proceso de compra para que tomes la mejor decisión."
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Experiencia en el Rubro",
    description: "Años en el mercado nos respaldan para ofrecerte calidad y confianza."
  }
];

function Benefits() {
  return (
    <Section>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center flex flex-col items-center">
            <div className="text-primary bg-primary/10 p-4 rounded-full mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const featuredVehicles = [
  { id: 1, imageId: 'featured-car-1', brand: 'Audi', model: 'Q5', year: 2022, mileage: '15.000 km', price: 'U$S 75.000', tags: ['Nuevo Ingreso', 'Destacado'] },
  { id: 2, imageId: 'featured-car-2', brand: 'Peugeot', model: '208', year: 2023, mileage: '5.000 km', price: 'U$S 28.000', tags: ['Destacado'] },
  { id: 3, imageId: 'featured-car-3', brand: 'BMW', model: 'Serie 3', year: 2021, mileage: '30.000 km', price: 'U$S 60.000', tags: [] },
  { id: 4, imageId: 'featured-car-4', brand: 'Ford', model: 'Ranger', year: 2022, mileage: '45.000 km', price: 'U$S 55.000', tags: ['Reservado'] },
];

function FeaturedVehicles() {
  return (
    <Section className="bg-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Vehículos Destacados</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Una selección de nuestros mejores vehículos disponibles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredVehicles.map((vehicle) => {
          const image = PlaceHolderImages.find(img => img.id === vehicle.imageId);
          return (
            <Card key={vehicle.id} className="overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 bg-background/50 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative">
                  {image &&
                    <Image
                      src={image.imageUrl}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      data-ai-hint={image.imageHint}
                      width={600}
                      height={400}
                      className="object-cover w-full aspect-video transition-transform duration-500 group-hover:scale-105"
                    />
                  }
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {vehicle.tags.map(tag => (
                      <Badge key={tag} variant={tag === 'Reservado' ? 'destructive' : 'secondary'}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold font-headline">{vehicle.brand} {vehicle.model}</h3>
                  <div className="text-sm text-muted-foreground flex justify-between mt-1">
                    <span>{vehicle.year}</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                  <p className="text-xl font-semibold mt-2 text-primary">{vehicle.price}</p>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/catalogo/${vehicle.id}`}>Ver Detalles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
       <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/catalogo">Ver todo el catálogo</Link>
          </Button>
       </div>
    </Section>
  )
}

function TrustSection() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Comprá con total Confianza</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            En AutoHaus, tu tranquilidad es nuestra prioridad. Ofrecemos un servicio transparente y profesional para que tu única preocupación sea disfrutar de tu nuevo auto.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Documentación Garantizada</h4>
                <p className="text-muted-foreground text-sm">Todos nuestros vehículos se entregan con la documentación al día y sin deudas.</p>
              </div>
            </li>
             <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Test Drive sin Compromiso</h4>
                <p className="text-muted-foreground text-sm">Coordiná una cita y probá el vehículo que te interesa antes de decidir.</p>
              </div>
            </li>
             <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Gestoría Propia</h4>
                <p className="text-muted-foreground text-sm">Nos encargamos de todo el proceso de transferencia para que sea rápido y sencillo.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="relative">
           <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
            {(() => {
              const image = PlaceHolderImages.find(img => img.id === 'dealership-interior');
              if (image) {
                return (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    width={600}
                    height={450}
                    className="object-cover w-full h-full rounded-lg"
                  />
                )
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <FeaturedVehicles />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
