"use client";

import type { HTMLAttributes, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A glass card with a gradient border and a soft glow that follows the
 * pointer. The pointer position is written to CSS variables, so moving the
 * mouse never triggers a React re-render.
 */
export function SpotlightCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "group/spot glass gradient-border relative overflow-hidden rounded-2xl border-transparent transition-colors duration-300",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(99 102 241 / 0.14), rgb(34 211 238 / 0.05) 40%, transparent 70%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
