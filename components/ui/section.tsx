import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A page section with a consistent heading block. */
export function Section({ id, eyebrow, title, description, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24", className)}
    >
      <Reveal className="mb-10 max-w-2xl sm:mb-12">
        <p className="mb-3 font-mono text-xs tracking-wider text-emerald-400/90 uppercase">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-zinc-400">{description}</p> : null}
      </Reveal>
      {children}
    </section>
  );
}
