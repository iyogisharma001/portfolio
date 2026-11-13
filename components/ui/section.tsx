import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  /** Two-digit index shown in the eyebrow, e.g. "01". */
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** A page section with a consistent numbered heading block. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28", className)}
    >
      <Reveal className="mb-12 max-w-2xl sm:mb-16">
        <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-widest text-cyan-300/90 uppercase">
          <span className="text-zinc-600">{index}</span>
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-cyan-400/70 to-transparent" />
          {eyebrow}
        </p>
        <h2
          id={`${id}-heading`}
          className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">{description}</p>
        ) : null}
      </Reveal>
      {children}
    </section>
  );
}
