import CtaActions from "./cta-actions";

export default function Cta() {
  return (
    <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="relative text-center bg-gradient-to-r from-primary to-accent p-8 md:p-16 rounded-2xl overflow-hidden">
                 <div className="absolute inset-0 bg-card/80 mix-blend-multiply"></div>
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/50 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/50 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground">
                        Tu página web puede trabajar por vos todos los días.
                    </h2>
                    <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        ¿Listo para llevar tu presencia digital al siguiente nivel? Hablemos de cómo podemos ayudarte a crecer.
                    </p>
                    <div className="mt-8">
                        <CtaActions />
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
