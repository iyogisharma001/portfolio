"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  phrases: readonly string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
};

/** Types each phrase, holds, deletes it, then moves to the next. */
export function Typewriter({ phrases, typeMs = 55, deleteMs = 28, holdMs = 1800 }: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = phrases[index % phrases.length] ?? "";

  useEffect(() => {
    // Respect reduced motion: show the first phrase and stop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setLength(phrase.length), 0);
      return () => window.clearTimeout(id);
    }

    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && length === phrase.length) delay = holdMs;
    if (deleting && length === 0) delay = 350;

    const id = window.setTimeout(() => {
      if (!deleting && length === phrase.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((value) => (value + 1) % phrases.length);
      } else setLength((value) => value + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(id);
  }, [deleting, length, phrase, phrases.length, typeMs, deleteMs, holdMs]);

  return (
    <>
      {/* Screen readers get one stable phrase instead of a stream of letters. */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden className="text-gradient">
        {phrase.slice(0, length)}
      </span>
      <span
        aria-hidden
        className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] animate-blink rounded-full bg-cyan-300"
      />
    </>
  );
}
