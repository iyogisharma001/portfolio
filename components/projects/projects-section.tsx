import { Projects } from "@/components/projects/projects";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Project } from "@/lib/data";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Things I've built."
      description="Filter by area, open a card for the full breakdown, and leave an endorsement if something's useful."
    >
      <Reveal>
        <Projects projects={projects} />
      </Reveal>
    </Section>
  );
}
