"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { ProjectLinks, RepoLine, projectAddress } from "@/components/projects/project-meta";
import type { Project } from "@/lib/data";
import type { RepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";

type CardProps = {
  project: Project;
  stats?: RepoStats;
  onOpen: () => void;
  endorse: ReactNode;
};

function Metrics({ project }: { project: Project }) {
  if (project.metrics.length === 0) return null;
  return (
    <dl className="grid grid-cols-3 gap-4 border-y border-white/[0.06] py-4">
      {project.metrics.map((metric) => (
        <div key={metric.label} className="min-w-0">
          <dd className="truncate text-base font-semibold text-zinc-100">{metric.value}</dd>
          <dt className="mt-0.5 text-xs leading-snug text-zinc-500">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function DetailsButton({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Read more about ${project.title}`}
      className="group/details inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
    >
      Read more <ArrowRight className="size-4 transition-transform group-hover/details:translate-x-0.5" />
    </button>
  );
}

/** A large case-study row: screenshot on one side, write-up on the other. */
export function FeaturedProject({ project, stats, onOpen, endorse, flip }: CardProps & { flip?: boolean }) {
  return (
    <article className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${project.title} details`}
        className={cn(
          "group/shot block min-w-0 text-left transition-transform duration-300 hover:-translate-y-1",
          flip && "lg:order-2",
        )}
      >
        {project.image ? (
          <BrowserFrame
            src={project.image}
            alt={`${project.title} screenshot`}
            address={projectAddress(project)}
            sizes="(min-width: 1024px) 480px, 100vw"
          />
        ) : null}
      </button>

      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-emerald-400/90 uppercase">
          {project.category} · {project.role}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">{project.title}</h3>
        <p className="mt-2 leading-relaxed text-zinc-400">{project.tagline}</p>
        <RepoLine stats={stats} className="mt-3" />

        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-zinc-400">
          {project.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight.slice(0, 32)} className="flex gap-2.5">
              <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-zinc-600" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <Metrics project={project} />
        </div>

        <p className="mt-4 font-mono text-xs leading-relaxed text-zinc-500">{project.techStack.join(" · ")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ProjectLinks project={project} />
          <DetailsButton project={project} onOpen={onOpen} />
          <div className="ml-auto">{endorse}</div>
        </div>
      </div>
    </article>
  );
}

/** A compact card for smaller projects. */
export function ProjectCard({ project, stats, onOpen, endorse }: CardProps) {
  return (
    <article className="surface flex h-full flex-col overflow-hidden transition-colors hover:border-white/15">
      {project.image ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${project.title} details`}
          className="relative block aspect-[16/9] overflow-hidden border-b border-white/[0.06] bg-zinc-900"
        >
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 460px, 100vw"
            className="object-cover object-top opacity-90 transition-transform duration-500 hover:scale-[1.02]"
          />
        </button>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-emerald-400/90 uppercase">{project.category}</p>
          {endorse}
        </div>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">{project.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{project.tagline}</p>
        <RepoLine stats={stats} className="mt-3" />
        {project.image ? null : (
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-400">
            {project.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight.slice(0, 32)} className="flex gap-2.5">
                <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-zinc-600" />
                {highlight}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 font-mono text-xs leading-relaxed text-zinc-500">{project.techStack.join(" · ")}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-5">
          <ProjectLinks project={project} />
          <DetailsButton project={project} onOpen={onOpen} />
        </div>
      </div>
    </article>
  );
}
