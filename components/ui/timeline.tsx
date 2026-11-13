"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tag } from "@/components/ui/tag";
import type { TimelineEntry } from "@/lib/data";

type TimelineProps = {
  entries: TimelineEntry[];
  /** Icon rendered inside each node on the rail. */
  icon: ReactNode;
};

/**
 * Vertical timeline. The gradient rail fills as you scroll through it, and
 * each node lights up when its card is hovered or focused.
 */
export function Timeline({ entries, icon }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative pl-12 sm:pl-16">
      <div aria-hidden className="absolute top-2 bottom-2 left-[1.125rem] w-px bg-white/[0.08] sm:left-[1.375rem]" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-[1.125rem] w-px origin-top bg-gradient-to-b from-indigo-400 via-sky-400 to-cyan-300 sm:left-[1.375rem]"
      />

      <ol className="space-y-6">
      {entries.map((entry, i) => (
        <li key={`${entry.organization}-${entry.title}`} className="group/item relative">
          <span
            aria-hidden
            className="absolute top-5 -left-12 grid size-9 place-items-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-all duration-300 group-focus-within/item:border-cyan-400/60 group-focus-within/item:text-cyan-300 group-hover/item:border-cyan-400/60 group-hover/item:text-cyan-300 group-hover/item:shadow-[0_0_24px_-2px_rgb(34_211_238/0.5)] sm:-left-16 sm:size-11"
          >
            {icon}
          </span>

          <Reveal delay={i * 0.06}>
            <SpotlightCard>
              <article className="p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="text-lg font-medium text-white">{entry.title}</h3>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      <span className="text-cyan-300/90">{entry.organization}</span>
                      {entry.location ? ` · ${entry.location}` : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {entry.meta ? (
                      <span className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-indigo-200">
                        {entry.meta}
                      </span>
                    ) : null}
                    <time className="font-mono text-zinc-500">{entry.period}</time>
                  </div>
                </div>

                {entry.points.length > 0 ? (
                  <ul className="mt-5 space-y-2.5 text-[0.95rem] leading-relaxed text-zinc-400">
                    {entry.points.map((point) => (
                      <li key={point.slice(0, 32)} className="flex gap-3">
                        <span aria-hidden className="mt-[0.65em] size-1 shrink-0 rounded-full bg-cyan-400/70" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.tags?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </SpotlightCard>
          </Reveal>
        </li>
      ))}
      </ol>
    </div>
  );
}
