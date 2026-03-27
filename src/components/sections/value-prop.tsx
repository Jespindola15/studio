import { SectionContainer } from "./container";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Gem, Clock, TrendingUp, BarChart } from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Mayor Credibilidad",
    description: "Un diseño profesional genera confianza desde el primer momento.",
  },
  {
    icon: <Gem className="w-7 h-7" />,
    title: "Imagen Profesional",
    description: "Refleja la calidad de tu marca y te diferencia de la competencia.",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "Presencia Online 24/7",
    description: "Tu web trabaja para vos, atrayendo clientes incluso cuando no estás.",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Mejor Percepción de Marca",
    description: "Una experiencia de usuario superior eleva el valor percibido de tu oferta.",
  },
  {
    icon: <BarChart className="w-7 h-7" />,
    title: "Más Oportunidades de Venta",
    description: "Una web optimizada es tu principal herramienta para convertir visitas en clientes.",
  },
];

export default function ValueProp() {
  return (
    <SectionContainer id="value-prop">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Tu página web es el centro de tu universo digital</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-3xl mx-auto">
          Es el lugar donde tus clientes potenciales deciden si confiar en tu marca, el pilar fundamental para construir una presencia online sólida y rentable.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="bg-card border-border/50 p-6">
            <CardContent className="p-0 flex items-start gap-4">
              <div className="text-accent">{benefit.icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
