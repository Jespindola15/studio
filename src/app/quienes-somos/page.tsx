
function Section({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`} {...props}>
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </section>
  );
}

export default function QuienesSomos() {
  return (
    <Section>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Quiénes Somos</h1>
        <p className="mt-4 text-lg text-muted-foreground">Próximamente...</p>
      </div>
    </Section>
  )
}
