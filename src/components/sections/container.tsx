import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionContainer({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-16 md:py-24 lg:py-32", className)}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
