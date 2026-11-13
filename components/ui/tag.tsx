import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small monospace chip for tech-stack and topic labels. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-[0.7rem] leading-none text-zinc-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
