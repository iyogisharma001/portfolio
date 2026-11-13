"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { experience, profile, projects, skillCategories, skills } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tone = "default" | "muted" | "accent" | "success" | "error";
type Line = { id: number; kind: "command" | "output"; text: string; tone?: Tone };
type Output = { text: string; tone?: Tone };

const toneClass: Record<Tone, string> = {
  default: "text-zinc-300",
  muted: "text-zinc-500",
  accent: "text-cyan-300",
  success: "text-emerald-300",
  error: "text-rose-300",
};

const SUGGESTIONS = ["whoami", "skills", "projects", "experience", "contact"];

function run(command: string): Output[] | "clear" {
  switch (command) {
    case "help":
      return [
        { text: "Available commands:", tone: "muted" },
        { text: "  whoami       who is this?" },
        { text: "  skills       languages and tools" },
        { text: "  projects     things I've built" },
        { text: "  experience   where I've worked" },
        { text: "  contact      how to reach me" },
        { text: "  resume       download my resume" },
        { text: "  clear        clear the terminal" },
      ];
    case "whoami":
      return [
        { text: profile.name, tone: "accent" },
        { text: "Pre-final year ECE undergrad @ BIT Mesra (2028)" },
        { text: "Backend APIs in Node.js + TypeScript · ML from first principles" },
        { text: `● ${profile.availability}`, tone: "success" },
      ];
    case "skills":
      return skillCategories.map((category) => ({
        text: `${category.padEnd(18)} ${skills
          .filter((skill) => skill.category === category)
          .map((skill) => skill.name)
          .join(", ")}`,
      }));
    case "projects":
      return projects.flatMap((project) => [
        { text: project.title, tone: "accent" as const },
        { text: `  ${project.techStack.join(" · ")}`, tone: "muted" as const },
      ]);
    case "experience":
      return experience.map((job) => ({
        text: `${job.period.padEnd(20)} ${job.title} @ ${job.organization}`,
      }));
    case "contact":
      return [
        { text: `email     ${profile.email}` },
        { text: `github    github.com/${profile.githubHandle}` },
        { text: "Or scroll down — the contact form goes straight to my inbox.", tone: "muted" },
      ];
    case "resume":
      window.open(profile.resumeUrl, "_blank", "noopener");
      return [{ text: "Opening resume…", tone: "success" }];
    case "sudo hire-me":
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return [{ text: "Permission granted. Taking you to the contact form…", tone: "success" }];
    case "clear":
      return "clear";
    default:
      return [
        { text: `command not found: ${command}`, tone: "error" },
        { text: "Type 'help' to see what's available.", tone: "muted" },
      ];
  }
}

/** A small working terminal: type a command or tap a suggestion. */
export function TerminalCard() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [intro, setIntro] = useState("");
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function execute(raw: string) {
    const command = raw.trim().toLowerCase();
    if (!command) return;

    const result = run(command);
    if (result === "clear") {
      setLines([]);
      return;
    }
    setLines((previous) => [
      ...previous.slice(-60),
      { id: nextId.current++, kind: "command", text: command },
      ...result.map((output) => ({ id: nextId.current++, kind: "output" as const, ...output })),
    ]);
  }

  // Type `whoami` once on load so the card never starts empty.
  useEffect(() => {
    const command = "whoami";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    for (let i = 1; i <= command.length; i++) {
      timers.push(window.setTimeout(() => setIntro(command.slice(0, i)), reduced ? 0 : 500 + i * 90));
    }
    timers.push(
      window.setTimeout(
        () => {
          setIntro("");
          execute(command);
        },
        reduced ? 0 : 500 + command.length * 90 + 350,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    execute(input);
    setInput("");
  }

  return (
    <div className="gradient-border glass relative rounded-2xl border-transparent shadow-2xl shadow-indigo-950/40">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="size-3 rounded-full bg-rose-400/80" />
        <span className="size-3 rounded-full bg-amber-300/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-zinc-500">yogesh@portfolio: ~</span>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="h-72 cursor-text overflow-y-auto px-4 py-4 font-mono text-[0.78rem] leading-relaxed sm:h-80 sm:text-[0.82rem]"
      >
        <div aria-live="polite">
          {lines.map((line) =>
            line.kind === "command" ? (
              <p key={line.id} className="mt-3 text-zinc-100 first:mt-0">
                <span className="mr-2 text-emerald-400">❯</span>
                {line.text}
              </p>
            ) : (
              <p
                key={line.id}
                className={cn("break-words whitespace-pre-wrap", toneClass[line.tone ?? "default"])}
              >
                {line.text}
              </p>
            ),
          )}
        </div>

        <form onSubmit={handleSubmit} className={cn("flex items-center", lines.length > 0 && "mt-3")}>
          <span className="mr-2 text-emerald-400">❯</span>
          {intro ? (
            <span className="text-zinc-100">
              {intro}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-zinc-300" />
            </span>
          ) : (
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Terminal command"
              placeholder="type 'help'"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={40}
              className="w-full min-w-0 bg-transparent text-zinc-100 caret-cyan-300 outline-none placeholder:text-zinc-600"
            />
          )}
        </form>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] px-4 py-3">
        {SUGGESTIONS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
