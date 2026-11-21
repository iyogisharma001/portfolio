"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProjectLinks, RepoLine } from "@/components/projects/project-meta";
import type { Project } from "@/lib/data";
import type { RepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";

type ProjectModalProps = {
  project: Project;
  stats?: RepoStats;
  onClose: () => void;
  endorse: ReactNode;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Detail dialog for a project: screenshots, the full write-up and links.
 * Handles Escape, backdrop click, scroll lock, focus trapping and returning
 * focus to whatever opened it.
 */
export function ProjectModal({ project, stats, onClose, endorse }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const images = [project.image, ...project.gallery].filter((src): src is string => Boolean(src));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-emerald-400/90 uppercase">
              {project.category} · {project.role}
            </p>
            <h2 id="project-modal-title" className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
              {project.title}
            </h2>
            <RepoLine stats={stats} className="mt-1.5" />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain">
          {images.length > 0 ? (
            <div className="border-b border-white/[0.06] bg-zinc-900/60 p-4 sm:p-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                <Image
                  key={images[active]}
                  src={images[active] ?? images[0]!}
                  alt={`${project.title} screenshot ${active + 1}`}
                  fill
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="object-cover object-top"
                />
              </div>
              {images.length > 1 ? (
                <div className="mt-3 flex gap-2" role="group" aria-label="Screenshots">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show screenshot ${i + 1}`}
                      aria-pressed={active === i}
                      className={cn(
                        "relative aspect-[16/10] w-24 overflow-hidden rounded-md border transition-opacity",
                        active === i ? "border-emerald-400/70" : "border-white/10 opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt="" fill sizes="96px" className="object-cover object-top" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="px-5 py-6 sm:px-7">
            <p className="leading-relaxed text-zinc-300">{project.description}</p>

            {project.metrics.length > 0 ? (
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="surface p-3">
                    <dd className="truncate font-semibold text-zinc-100">{metric.value}</dd>
                    <dt className="mt-0.5 text-xs leading-snug text-zinc-500">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}

            <h3 className="mt-7 text-sm font-medium text-zinc-100">What I built</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-400">
              {project.highlights.map((highlight) => (
                <li key={highlight.slice(0, 32)} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-emerald-400/70" />
                  {highlight}
                </li>
              ))}
            </ul>

            <h3 className="mt-7 text-sm font-medium text-zinc-100">Stack</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-400">{project.techStack.join(" · ")}</p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] px-5 py-4 sm:px-7">
          <ProjectLinks project={project} />
          <div className="ml-auto">{endorse}</div>
        </footer>
      </motion.div>
    </motion.div>
  );
}
