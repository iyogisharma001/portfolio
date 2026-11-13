import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { navLinks, profile } from "@/lib/data";

const socials = [
  { label: "GitHub", href: profile.githubUrl, icon: GitHubIcon },
  { label: "LinkedIn", href: profile.linkedinUrl, icon: LinkedInIcon },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">{profile.name}</p>
          <p className="mt-1 text-sm text-zinc-500">
            Built with Next.js, TypeScript, Tailwind CSS, Prisma and PostgreSQL.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="grid size-10 place-items-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              >
                <Icon className="size-[1.05rem]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
