"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getEndorsements, toggleEndorsement } from "@/actions/endorsements";
import { EndorseButton } from "@/components/projects/endorse-button";
import { FeaturedProject, ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { Portal } from "@/components/ui/portal";
import type { Project } from "@/lib/data";
import type { RepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";

const ALL = "All";

/** Endorsement counts with optimistic toggling backed by a server action. */
function useEndorsements() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [endorsed, setEndorsed] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEndorsements()
      .then((state) => {
        if (cancelled) return;
        setCounts(state.counts);
        setEndorsed(new Set(state.endorsed));
      })
      .catch(() => {
        // Counts are a nice-to-have; the list works without them.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const apply = useCallback((slug: string, count: number, isEndorsed: boolean) => {
    setCounts((previous) => ({ ...previous, [slug]: Math.max(0, count) }));
    setEndorsed((previous) => {
      const next = new Set(previous);
      if (isEndorsed) next.add(slug);
      else next.delete(slug);
      return next;
    });
  }, []);

  async function toggle(slug: string) {
    if (pending) return;
    const wasEndorsed = endorsed.has(slug);
    const before = counts[slug] ?? 0;

    setPending(slug);
    apply(slug, before + (wasEndorsed ? -1 : 1), !wasEndorsed);

    try {
      const result = await toggleEndorsement(slug);
      if (result.ok) {
        apply(slug, result.count, result.endorsed);
        if (result.endorsed) toast.success("Thanks for the endorsement!");
      } else {
        apply(slug, before, wasEndorsed);
        toast.error(result.message);
      }
    } catch {
      apply(slug, before, wasEndorsed);
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return { counts, endorsed, pending, toggle };
}

type ProjectsProps = {
  projects: Project[];
  repoStats: Record<string, RepoStats>;
};

export function Projects({ projects, repoStats }: ProjectsProps) {
  const [filter, setFilter] = useState<string>(ALL);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { counts, endorsed, pending, toggle } = useEndorsements();

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);
  const featured = visible.filter((project) => project.featured && project.image);
  const others = visible.filter((project) => !featured.includes(project));
  const openProject = projects.find((project) => project.slug === openSlug) ?? null;
  const closeModal = useCallback(() => setOpenSlug(null), []);
  const statsFor = (project: Project) => (project.repo ? repoStats[project.repo] : undefined);

  const endorseButton = (slug: string) => (
    <EndorseButton
      count={counts[slug] ?? 0}
      endorsed={endorsed.has(slug)}
      pending={pending === slug}
      onToggle={() => toggle(slug)}
    />
  );

  return (
    <>
      <div role="group" aria-label="Filter projects by category" className="mb-12 flex flex-wrap gap-2">
        {categories.map((category) => {
          const selected = filter === category;
          const count =
            category === ALL ? projects.length : projects.filter((p) => p.category === category).length;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                selected
                  ? "border-zinc-200 bg-zinc-100 text-zinc-950"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-100",
              )}
            >
              {category} <span className={selected ? "text-zinc-500" : "text-zinc-600"}>{count}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {featured.length > 0 ? (
            <ul className="space-y-20 sm:space-y-24">
              {featured.map((project, i) => (
                <li key={project.slug}>
                  <FeaturedProject
                    project={project}
                    stats={statsFor(project)}
                    flip={i % 2 === 1}
                    onOpen={() => setOpenSlug(project.slug)}
                    endorse={endorseButton(project.slug)}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {others.length > 0 ? (
            <div className={featured.length > 0 ? "mt-24" : undefined}>
              {featured.length > 0 ? (
                <h3 className="mb-6 text-sm font-medium text-zinc-300">More projects</h3>
              ) : null}
              <ul className="grid gap-5 md:grid-cols-2">
                {others.map((project) => (
                  <li key={project.slug}>
                    <ProjectCard
                      project={project}
                      stats={statsFor(project)}
                      onOpen={() => setOpenSlug(project.slug)}
                      endorse={endorseButton(project.slug)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <Portal>
        <AnimatePresence>
          {openProject ? (
            <ProjectModal
              key={openProject.slug}
              project={openProject}
              stats={statsFor(openProject)}
              onClose={closeModal}
              endorse={endorseButton(openProject.slug)}
            />
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
