import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import {
  achievements,
  athletics,
  education,
  profile,
  skillCategories,
  type Achievement,
  type Skill,
} from "@/lib/data";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-medium text-zinc-100">{title}</h3>
      {children}
    </div>
  );
}

function AchievementList({ items }: { items: Achievement[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.title}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-200 transition-colors hover:text-white"
            >
              {item.title} <ArrowUpRight className="size-3.5 text-zinc-500" />
            </a>
          ) : (
            <p className="text-zinc-200">{item.title}</p>
          )}
          <p className="mt-0.5 text-sm text-zinc-500">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}

export function About({ skills }: { skills: Skill[] }) {
  return (
    <Section id="about" eyebrow="About" title="A bit more about me.">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal y={12} className="space-y-5 leading-relaxed text-zinc-400">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal delay={0.05} y={12}>
          <h3 className="mb-4 text-sm font-medium text-zinc-100">What I work with</h3>
          <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {skillCategories.map((category) => {
              const items = skills.filter((skill) => skill.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="grid gap-1 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
                  <dt className="text-sm text-zinc-500">{category}</dt>
                  <dd className="text-sm leading-relaxed text-zinc-300">
                    {items.map((skill) => skill.name).join(", ")}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>

      <Reveal delay={0.05} y={12} className="mt-16 grid gap-10 border-t border-white/[0.06] pt-12 sm:grid-cols-2 lg:grid-cols-3">
        <Column title="Education">
          <ul className="space-y-4">
            {education.map((entry) => (
              <li key={entry.organization}>
                <p className="text-zinc-200">{entry.organization}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {entry.title}
                  {entry.meta ? ` · ${entry.meta}` : ""} · {entry.period}
                </p>
              </li>
            ))}
          </ul>
        </Column>
        <Column title="Achievements">
          <AchievementList items={achievements} />
        </Column>
        <Column title="Off the keyboard">
          <AchievementList items={athletics} />
        </Column>
      </Reveal>
    </Section>
  );
}
