import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { TerminalCard } from "@/components/hero/terminal-card";
import { Typewriter } from "@/components/hero/typewriter";
import { ButtonLink } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

function AvailabilityBadge() {
  if (!profile.available) return null;
  return (
    <p className="glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-xs text-zinc-300 sm:text-sm">
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-emerald-400" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      {profile.availability}
    </p>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Ambient background: dot grid plus two slow-drifting colour washes. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-[70%] animate-drift rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-10 left-1/2 h-[26rem] w-[40rem] translate-x-[5%] animate-drift rounded-full bg-cyan-500/[0.12] blur-[120px] [animation-delay:-9s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-zinc-950" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-32 pb-20 sm:px-8 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-28">
        <div className="min-w-0">
          <Reveal>
            <AvailabilityBadge />
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
              Hi, I&apos;m {profile.firstName}.
              <span className="mt-2 block min-h-[2.2em] text-[0.62em] leading-tight font-medium text-zinc-400 sm:min-h-[1.2em]">
                I build <Typewriter phrases={profile.roles} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#projects">
              Explore Projects <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">
              <Mail className="size-4" /> Get in Touch
            </ButtonLink>
            <ButtonLink href={profile.resumeUrl} variant="ghost" download>
              <Download className="size-4" /> Resume
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.32} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {profile.location}
            </span>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <GitHubIcon className="size-4" /> GitHub
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <LinkedInIcon className="size-4" /> LinkedIn
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={36} className="min-w-0">
          <TerminalCard />
        </Reveal>
      </div>
    </section>
  );
}
