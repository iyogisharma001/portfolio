import { ArrowUpRight, GraduationCap, Trophy } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Timeline } from "@/components/ui/timeline";
import { achievements, education } from "@/lib/data";

export function Education() {
  return (
    <Section
      id="education"
      index="04"
      eyebrow="Education & Achievements"
      title="The path so far."
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <Timeline
          entries={education}
          icon={<GraduationCap className="size-4 sm:size-[1.1rem]" />}
        />

        <div>
          <h3 className="mb-6 font-mono text-xs tracking-widest text-zinc-500 uppercase">
            Achievements
          </h3>
          <ul className="space-y-4">
            {achievements.map((achievement, i) => (
              <li key={achievement.title}>
                <Reveal delay={i * 0.08}>
                  <SpotlightCard>
                    <div className="flex gap-4 p-5 sm:p-6">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-300 ring-1 ring-white/10">
                        <Trophy className="size-5" />
                      </span>
                      <div>
                        <h4 className="font-medium text-white">{achievement.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                          {achievement.detail}
                        </p>
                        {achievement.links?.length ? (
                          <ul className="mt-3 flex flex-wrap gap-4">
                            {achievement.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200"
                                >
                                  {link.label} <ArrowUpRight className="size-3.5" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
