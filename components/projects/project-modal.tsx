"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/data";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  endorse: ReactNode;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Deep-dive dialog for a project. Handles Escape, backdrop click, scroll
 * lock, focus trapping and restoring focus to whatever opened it.
 */
export function ProjectModal({ project, onClose, endorse }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
      transition={{ duration: 0.2 }}
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="gradient-border relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl bg-zinc-900 shadow-2xl shadow-black/60 sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-6 sm:p-8 sm:pb-6">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-widest text-cyan-300/90 uppercase">
              {project.category} · {project.role}
            </p>
            <h2
              id="project-modal-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-white"
            >
              {project.title}
            </h2>
            <p className="mt-1.5 text-zinc-400">{project.tagline}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-6 sm:p-8 sm:pt-6">
          <dl className="grid grid-cols-3 gap-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 sm:p-4">
                <dd className="truncate text-lg font-semibold text-white">{metric.value}</dd>
                <dt className="mt-0.5 text-xs leading-snug text-zinc-500">{metric.label}</dt>
              </div>
            ))}
          </dl>

          <div className="prose prose-sm prose-invert mt-6 max-w-none prose-p:text-zinc-400 prose-li:text-zinc-400 prose-li:marker:text-cyan-400/70 prose-h3:font-mono prose-h3:text-xs prose-h3:font-normal prose-h3:tracking-widest prose-h3:text-zinc-500 prose-h3:uppercase sm:prose-base">
            <h3>Overview</h3>
            <p>{project.description}</p>
            <h3>What I built</h3>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight.slice(0, 32)}>{highlight}</li>
              ))}
            </ul>
            <h3>Tech stack</h3>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] p-4 sm:px-8">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              <GitHubIcon className="size-4" /> View code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              Live demo <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          <div className="ml-auto">{endorse}</div>
        </footer>
      </motion.div>
    </motion.div>
  );
}
