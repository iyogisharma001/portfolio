import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked.">
      <ol className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {experience.map((job, i) => (
          <li key={`${job.organization}-${job.title}`}>
            <Reveal delay={i * 0.05} y={12}>
              <article className="grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <div className="text-sm text-zinc-500">
                  <p className="font-mono text-xs">{job.period}</p>
                  <p className="mt-1">
                    {[job.meta, job.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-100">
                    {job.title} <span className="text-zinc-500">at</span> {job.organization}
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-zinc-400">
                    {job.points.map((point) => (
                      <li key={point.slice(0, 32)} className="flex gap-2.5">
                        <span aria-hidden className="mt-[0.65em] size-1 shrink-0 rounded-full bg-zinc-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {job.tags?.length ? (
                    <p className="mt-4 font-mono text-xs text-zinc-500">{job.tags.join(" · ")}</p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
