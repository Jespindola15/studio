import { SectionContainer } from "./container";
import { Card } from "@/components/ui/card";
import { Rocket, User, Briefcase, PlayCircle, Globe, Sparkles } from "lucide-react";

const targetAudience = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Startups",
  },
  {
    icon: <User className="w-8 h-8" />,
    title: "Marcas Personales",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Profesionales",
  },
  {
    icon: <PlayCircle className="w-8 h-8" />,
    title: "Cursos Online",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Negocios Digitales",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Empresas",
  },
];

export default function IdealFor() {
  return (
    <SectionContainer id="ideal-for">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">¿Para quién es este servicio?</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ayudamos a una amplia gama de clientes a brillar en el mundo digital.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
        {targetAudience.map((item, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 p-6 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/50">
            <div className="text-accent mb-4">
              {item.icon}
            </div>
            <h3 className="font-bold">{item.title}</h3>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
