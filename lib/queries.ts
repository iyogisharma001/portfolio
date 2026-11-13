import { cacheLife, cacheTag } from "next/cache";
import {
  projects as fallbackProjects,
  skills as fallbackSkills,
  type Metric,
  type Project,
  type ProjectCategory,
  type Skill,
  type SkillCategory,
} from "@/lib/data";
import { hasDatabase, prisma } from "@/lib/prisma";

function toMetrics(value: unknown): Metric[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const { label, value: metricValue } = item as Record<string, unknown>;
    return typeof label === "string" && typeof metricValue === "string"
      ? [{ label, value: metricValue }]
      : [];
  });
}

/**
 * Projects from PostgreSQL, cached for an hour. Falls back to the typed static
 * content when no database is configured or it can't be reached.
 */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  if (!hasDatabase) return fallbackProjects;

  try {
    const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) return fallbackProjects;

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      category: row.category as ProjectCategory,
      role: row.role,
      techStack: row.techStack,
      highlights: row.highlights,
      metrics: toMetrics(row.metrics),
      githubUrl: row.githubUrl,
      liveUrl: row.liveUrl,
      featured: row.featured,
      order: row.order,
    }));
  } catch (error) {
    console.warn("[queries] Falling back to static projects:", errorMessage(error));
    return fallbackProjects;
  }
}

/** Skills from PostgreSQL, with the same caching and fallback as projects. */
export async function getSkills(): Promise<Skill[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("skills");

  if (!hasDatabase) return fallbackSkills;

  try {
    const rows = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    if (rows.length === 0) return fallbackSkills;

    return rows.map((row) => ({
      name: row.name,
      category: row.category as SkillCategory,
      order: row.order,
    }));
  } catch (error) {
    console.warn("[queries] Falling back to static skills:", errorMessage(error));
    return fallbackSkills;
  }
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.split("\n").filter(Boolean).at(-1) ?? message;
}
