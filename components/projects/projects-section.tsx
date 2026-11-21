import { Projects } from "@/components/projects/projects";
import { Section } from "@/components/ui/section";
import { profile, type Project } from "@/lib/data";
import type { RepoStats } from "@/lib/github";

type Props = { projects: Project[]; repoStats: Record<string, RepoStats> };

export function ProjectsSection({ projects, repoStats }: Props) {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Things I've built and shipped."
      description={
        <>
          Every project here has public code on{" "}
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="link">
            GitHub
          </a>
          , with a README that explains the design and its limits. Repository details update live.
        </>
      }
    >
      <Projects projects={projects} repoStats={repoStats} />
    </Section>
  );
}
