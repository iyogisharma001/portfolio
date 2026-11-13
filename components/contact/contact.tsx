import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { profile } from "@/lib/data";

const links = [
  { label: "GitHub", value: `@${profile.githubHandle}`, href: profile.githubUrl, icon: GitHubIcon },
  { label: "LinkedIn", value: "Yogesh Sharma", href: profile.linkedinUrl, icon: LinkedInIcon },
];

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      eyebrow="Contact"
      title="Let's build something."
      description="I'm looking for software engineering internships and full-time roles. If you think I'd be a good fit — or just want to talk shop — send a message."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="space-y-3">
          <div className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-cyan-300">
              <Mail className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-500">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="block truncate text-sm text-zinc-100 hover:text-cyan-200"
              >
                {profile.email}
              </a>
            </div>
            <CopyEmail email={profile.email} />
          </div>

          {links.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-white/20"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-cyan-300">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="truncate text-sm text-zinc-100">{value}</p>
              </div>
              <ArrowUpRight className="size-4 text-zinc-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          ))}

          <div className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-cyan-300">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-xs text-zinc-500">Based in</p>
              <p className="text-sm text-zinc-100">{profile.location} · open to remote</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="gradient-border glass relative rounded-3xl border-transparent p-6 sm:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
