"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Track which section is currently in the middle of the viewport. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const sectionIds = navLinks.map((link) => link.href.slice(1));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-emerald-400/70"
      />

      <div className="mx-auto max-w-5xl px-3 pt-3 sm:px-6">
        <nav
          aria-label="Primary"
          className={cn(
            "flex h-14 items-center justify-between rounded-xl border px-3 pl-3 transition-all duration-300",
            scrolled || open
              ? "border-white/[0.08] bg-zinc-950/75 shadow-lg shadow-black/30 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a
            href="#top"
            className="flex items-center gap-2.5 text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            <span className="grid size-8 place-items-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
              {profile.initials}
            </span>
            <span className="hidden min-[420px]:inline">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                      isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              download
              className={cn(buttonClasses({ variant: "secondary", size: "sm" }), "hidden sm:inline-flex")}
            >
              Resume
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl text-zinc-300 hover:bg-white/5 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="mt-2 rounded-2xl border border-white/[0.08] bg-zinc-950/90 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden"
            >
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-[0.95rem]",
                        active === link.href.slice(1)
                          ? "bg-white/[0.06] text-white"
                          : "text-zinc-300 hover:bg-white/[0.04]",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={profile.resumeUrl}
                download
                onClick={() => setOpen(false)}
                className={cn(buttonClasses({ variant: "primary" }), "mt-2 w-full")}
              >
                Download resume
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
