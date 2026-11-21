import { ArrowUpRight, Download, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { LocalTime, TimeAgo } from "@/components/ui/time";
import { experience, profile } from "@/lib/data";
import type { LiveStats } from "@/lib/github";

function Avatar() {
  return profile.photo ? (
    <Image
      src={profile.photo}
      alt={profile.name}
      width={64}
      height={64}
      priority
      className="size-16 rounded-full object-cover ring-1 ring-white/10"
    />
  ) : (
    <span className="grid size-16 place-items-center rounded-full bg-zinc-800 text-lg font-semibold text-zinc-200 ring-1 ring-white/10">
      {profile.initials}
    </span>
  );
}

function NowRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-3 text-sm sm:px-5">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-zinc-200">{children}</dd>
    </div>
  );
}

/** A small "right now" card built from live GitHub and LeetCode data. */
function NowCard({ stats }: { stats: LiveStats }) {
  const latestJob = experience[0];
  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <p className="text-sm font-medium text-zinc-100">Right now</p>
        {stats.fetchedAt ? (
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Live from GitHub
          </p>
        ) : null}
      </div>
      <dl className="divide-y divide-white/[0.06]">
        {stats.latest ? (
          <NowRow label="Last push">
            <a href={stats.latest.url} target="_blank" rel="noopener noreferrer" className="link">
              {stats.latest.name}
            </a>{" "}
            <span className="text-zinc-500">
              · <TimeAgo iso={stats.latest.pushedAt} />
            </span>
          </NowRow>
        ) : null}
        <NowRow label="LeetCode">
          <a href={profile.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="link">
            {stats.leetcodeSolved !== null ? `${stats.leetcodeSolved} solved` : profile.leetcodeHandle}
          </a>{" "}
          <span className="text-zinc-500">· 500+ incl. GfG</span>
        </NowRow>
        <NowRow label="Studying">B.Tech ECE, BIT Mesra &apos;28</NowRow>
        {latestJob ? (
          <NowRow label="Previously">
            {latestJob.title}, {latestJob.organization}
          </NowRow>
        ) : null}
      </dl>
    </div>
  );
}

export function Hero({ stats }: { stats: LiveStats }) {
  return (
    <section id="top" className="mx-auto max-w-5xl px-5 pt-28 pb-12 sm:px-8 sm:pt-36 sm:pb-16">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-14">
        <div className="min-w-0">
          <Reveal y={12}>
            <div className="flex items-center gap-4">
              <Avatar />
              {profile.available ? (
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-xs text-emerald-300 sm:text-sm">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-400" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  {profile.availability}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.05} y={12}>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-lg text-zinc-300 sm:text-xl">
              Software engineer building backend systems, payments and developer tools.
            </p>
          </Reveal>

          <Reveal delay={0.1} y={12}>
            <p className="mt-5 max-w-xl leading-relaxed text-zinc-400">{profile.intro}</p>
          </Reveal>

          <Reveal delay={0.15} y={12} className="mt-8 flex flex-wrap items-center gap-2.5">
            <ButtonLink href={profile.resumeUrl} download>
              <Download className="size-4" /> Resume
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">
              <Mail className="size-4" /> Get in touch
            </ButtonLink>
            <ButtonLink href="#work" variant="ghost">
              See my work <ArrowUpRight className="size-4" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.2} y={12} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {profile.location} ·{" "}
              <LocalTime timeZone={profile.timezone} label="IST" />
            </span>
            {[
              { label: "GitHub", href: profile.githubUrl, icon: GitHubIcon },
              { label: "LinkedIn", href: profile.linkedinUrl, icon: LinkedInIcon },
              { label: "LeetCode", href: profile.leetcodeUrl, icon: LeetCodeIcon },
            ].map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-100"
              >
                <Icon className="size-4" /> {label}
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.2} y={16} className="min-w-0">
          <NowCard stats={stats} />
        </Reveal>
      </div>
    </section>
  );
}
