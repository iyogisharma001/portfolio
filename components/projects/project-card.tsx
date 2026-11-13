"use client";

import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { ReactNode } from "react";
import { GitHubIcon } from "@/components/ui/icons";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/data";

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
  /** Slot for the endorse button, owned by the parent grid. */
  endorse: ReactNode;
};

export function ProjectCard({ project, onOpen, endorse }: ProjectCardProps) {
  return (
    <SpotlightCard className="h-full transition-transform duration-300 hover:-translate-y-1">
      <article className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-200">
            {project.category}
          </span>
          {endorse}
        </div>

        <h3 className="mt-5 text-xl font-medium tracking-tight text-white">
          {/* The stretched button makes the whole card open the detail view. */}
          <button
            type="button"
            onClick={onOpen}
            className="text-left after:absolute after:inset-0 after:rounded-2xl"
            aria-haspopup="dialog"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-400">{project.tagline}</p>

        <dl className="mt-6 grid grid-cols-3 gap-2 border-y border-white/[0.06] py-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <dd className="truncate text-base font-semibold text-white">{metric.value}</dd>
              <dt className="mt-0.5 text-[0.7rem] leading-snug text-zinc-500">{metric.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex items-center gap-4 pt-6 text-sm">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white"
            >
              <GitHubIcon className="size-4" /> Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
            >
              Live demo <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1.5 text-cyan-300/90 transition-colors group-hover/spot:text-cyan-200">
            Details <Maximize2 className="size-3.5" />
          </span>
        </div>
      </article>
    </SpotlightCard>
  );
}
