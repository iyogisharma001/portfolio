"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

/** Client-side providers: motion preferences and toast notifications. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "!rounded-xl !border-white/10 !bg-zinc-900/95 !backdrop-blur-xl !font-sans",
          },
        }}
      />
    </MotionConfig>
  );
}
