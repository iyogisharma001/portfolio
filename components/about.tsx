import { Blocks, Braces, Database, Server, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { profile, skillCategories, stats, type Skill, type SkillCategory } from "@/lib/data";

const categoryMeta: Record<SkillCategory, { icon: LucideIcon; blurb: string }> = {
  Languages: { icon: Braces, blurb: "What I write in" },
  "Backend & Web": { icon: Server, blurb: "What I build with" },
  "Databases & Tools": { icon: Database, blurb: "What I ship with" },
  "Core Fundamentals": { icon: Blocks, blurb: "What it all rests on" },
};

export function About({ skills }: { skills: Skill[] }) {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title="Engineer by training, problem-solver by habit."
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <Reveal className="space-y-5 text-base leading-relaxed text-zinc-400 sm:text-[1.05rem]">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5">
                <dd className="text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-sm text-zinc-500">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <h3 className="mt-16 mb-6 font-mono text-xs tracking-widest text-zinc-500 uppercase">
        Skills matrix
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {skillCategories.map((category, i) => {
          const { icon: Icon, blurb } = categoryMeta[category];
          const items = skills.filter((skill) => skill.category === category);
          if (items.length === 0) return null;

          return (
            <Reveal key={category} delay={i * 0.06}>
              <SpotlightCard className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 text-cyan-300 ring-1 ring-white/10">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-white">{category}</h4>
                      <p className="text-xs text-zinc-500">{blurb}</p>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <li
                        key={skill.name}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-indigo-400/40 hover:text-white"
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
