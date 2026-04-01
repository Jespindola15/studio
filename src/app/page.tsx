import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Car, Check, Handshake, ShieldCheck, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Section } from '@/components/layout/Section';
import FeaturedVehicles from '@/components/layout/FeaturedVehicles';

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
