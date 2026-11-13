"use client";

import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type EndorseButtonProps = {
  count: number;
  endorsed: boolean;
  pending?: boolean;
  onToggle: () => void;
  className?: string;
};

export function EndorseButton({ count, endorsed, pending, onToggle, className }: EndorseButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      disabled={pending}
      aria-pressed={endorsed}
      aria-label={endorsed ? "Remove your endorsement" : "Endorse this project"}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm tabular-nums transition-all active:scale-95 disabled:opacity-70",
        endorsed
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white",
        className,
      )}
    >
      <ThumbsUp className={cn("size-3.5 transition-transform", endorsed && "-rotate-12 fill-current")} />
      {count}
    </button>
  );
}
