import { SectionContainer } from "./container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Building2, RefreshCw, ThumbsUp } from "lucide-react";

const services = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Diseño de Landing Pages",
    description: "Páginas de alta conversión enfocadas en generar consultas o ventas directas.",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Diseño Web Corporativo",
    description: "Sitios profesionales y escalables para empresas o marcas personales consolidadas.",
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Rediseño de Sitios Web",
    description: "Modernización visual y funcional de páginas existentes para mejorar su impacto.",
  },
  {
    icon: <ThumbsUp className="w-8 h-8" />,
    title: "Diseño para Redes Sociales",
    description: "Creación de una identidad visual coherente para Instagram y otras plataformas.",
  },
];

export default function Services() {
  return (
    <SectionContainer id="services" className="bg-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Experiencias digitales diseñadas para destacar</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Desde una landing page hasta un sitio corporativo completo, tenemos la solución para vos.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="bg-background/50 backdrop-blur-sm text-center p-6 flex flex-col items-center border border-border/50 hover:border-primary/50 transition-all duration-300 hover:bg-background hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
            <div className="mb-4 text-primary bg-primary/10 p-4 rounded-full">
              {service.icon}
            </div>
            <CardHeader className="p-0">
              <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
            </CardHeader>
            <CardDescription className="mt-2 text-base text-muted-foreground flex-grow">
              {service.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
