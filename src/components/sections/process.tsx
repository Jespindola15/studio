import { SectionContainer } from "./container";
import { Lightbulb, Palette, Wand2, Rocket } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Nos contás tu idea",
    description: "Analizamos tus objetivos y necesidades para definir el alcance del proyecto.",
    icon: Lightbulb,
  },
  {
    step: 2,
    title: "Creamos el diseño visual",
    description: "Diseñamos una interfaz moderna y atractiva centrada en la experiencia de usuario.",
    icon: Palette,
  },
  {
    step: 3,
    title: "Realizamos ajustes",
    description: "Iteramos sobre el diseño en base a tu feedback hasta alcanzar el resultado perfecto.",
    icon: Wand2,
  },
  {
    step: 4,
    title: "Publicamos tu página",
    description: "Lanzamos tu sitio web, optimizado para rendimiento y visibilidad en buscadores.",
    icon: Rocket,
  },
];

export default function Process() {
  return (
    <SectionContainer id="process">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestro Proceso Simplificado</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Un camino claro y colaborativo desde la idea hasta el lanzamiento.
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-border hidden md:block" aria-hidden="true"></div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {processSteps.map((step, index) => (
            <div
              key={step.step}
              className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse md:text-right'}`}
            >
              <div className="hidden md:flex flex-col items-center">
                  <div className="w-px h-10 bg-transparent"></div>
                  <div className="flex-shrink-0 z-10 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
              </div>

              <div className="md:hidden flex-shrink-0 z-10 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>

              <div className="flex-grow pt-2">
                <div className="flex items-center gap-3 md:justify-start  ${index % 2 !== 0 && 'md:flex-row-reverse'}">
                    <step.icon className="size-6 text-primary md:hidden" />
                    <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
