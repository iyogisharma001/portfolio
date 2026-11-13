"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getEndorsements, toggleEndorsement } from "@/actions/endorsements";
import { EndorseButton } from "@/components/projects/endorse-button";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { Portal } from "@/components/ui/portal";
import type { Project } from "@/lib/data";
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
        // Counts are a nice-to-have; the grid works without them.
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

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { counts, endorsed, pending, toggle } = useEndorsements();

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);
  const openProject = projects.find((project) => project.slug === openSlug) ?? null;
  const closeModal = useCallback(() => setOpenSlug(null), []);

  const endorseButton = (slug: string) => (
    <EndorseButton
      className="relative z-10"
      count={counts[slug] ?? 0}
      endorsed={endorsed.has(slug)}
      pending={pending === slug}
      onToggle={() => toggle(slug)}
    />
  );

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="glass mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1"
      >
        {categories.map((category) => {
          const selected = filter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(category)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors",
                selected ? "text-zinc-950" : "text-zinc-400 hover:text-white",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className="relative">{category}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectCard
                project={project}
                onOpen={() => setOpenSlug(project.slug)}
                endorse={endorseButton(project.slug)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Portal>
        <AnimatePresence>
          {openProject ? (
          <ProjectModal
            key={openProject.slug}
            project={openProject}
            onClose={closeModal}
            endorse={endorseButton(openProject.slug)}
          />
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
