import { SectionContainer } from "./container";
import { Lightbulb, Rocket } from "lucide-react";

export default function About() {
  return (
    <SectionContainer id="about" className="bg-card">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 absolute -inset-8 blur-3xl" />
          <div className="relative p-8 bg-background/50 backdrop-blur-lg rounded-2xl border border-border hover:border-primary/30 transition-colors">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Sobre Mediup</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Mediup es una agencia digital enfocada en crear páginas web modernas, minimalistas y efectivas.
              </p>
              <p className="text-muted-foreground">
                Nuestro objetivo es ayudar a marcas a mejorar su presencia online con diseños profesionales que transmitan confianza y calidad. Creemos en el poder de un diseño limpio para comunicar ideas complejas de forma sencilla.
              </p>
          </div>
        </div>
        <div className="space-y-8">
            <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Lightbulb className="size-6"/>
                </div>
                <div>
                    <h3 className="text-xl font-bold font-headline">Nuestra Filosofía</h3>
                    <p className="text-muted-foreground mt-1">
                        Combinamos diseño estético con funcionalidad impecable. Cada proyecto es una oportunidad para crear algo único y memorable que genere resultados.
                    </p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-shrink-0 size-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Rocket className="size-6"/>
                </div>
                <div>
                    <h3 className="text-xl font-bold font-headline">Nuestra Misión</h3>
                    <p className="text-muted-foreground mt-1">
                        Impulsar el crecimiento de nuestros clientes a través de experiencias digitales superiores que cautiven a su audiencia y fortalezcan su marca.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </SectionContainer>
  );
}
