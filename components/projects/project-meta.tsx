import { ArrowUpRight, Star } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { TimeAgo } from "@/components/ui/time";
import type { Project } from "@/lib/data";
import { languageColors } from "@/lib/format";
import type { RepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";

/** Address shown in the screenshot's browser bar. */
export function projectAddress(project: Project): string {
  const url = project.liveUrl ?? project.githubUrl;
  if (!url) return project.slug;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Language dot, stars and last push, straight from GitHub. */
export function RepoLine({ stats, className }: { stats?: RepoStats; className?: string }) {
  if (!stats) return null;
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500", className)}>
      {stats.language ? (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ backgroundColor: languageColors[stats.language] ?? "#71717a" }}
          />
          {stats.language}
        </span>
      ) : null}
      {stats.stars > 0 ? (
        <span className="inline-flex items-center gap-1">
          <Star className="size-3" /> {stats.stars}
        </span>
      ) : null}
      <span>
        Updated <TimeAgo iso={stats.pushedAt} />
      </span>
    </p>
  );
}

/** Live demo, code and any extra links for a project. */
export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  const links = [
    project.liveUrl ? { label: "Live demo", href: project.liveUrl, icon: "live" as const } : null,
    project.githubUrl ? { label: "Code", href: project.githubUrl, icon: "code" as const } : null,
    ...project.links.map((link) => ({ ...link, icon: "code" as const })),
  ].filter((link) => link !== null);

  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-sm", className)}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 font-medium transition-colors",
              link.icon === "live" ? "text-emerald-300 hover:text-emerald-200" : "text-zinc-300 hover:text-white",
            )}
          >
            {link.icon === "code" ? <GitHubIcon className="size-4" /> : null}
            {link.label}
            {link.icon === "live" ? <ArrowUpRight className="size-4" /> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
