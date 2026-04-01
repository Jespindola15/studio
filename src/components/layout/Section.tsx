import { cn } from "@/lib/utils";

export function Section({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn("py-16 md:py-24 lg:py-32", className)} {...props}>
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
