"use client"; // Error boundaries must be Client Components

import { RotateCw } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-widest text-rose-300 uppercase">Runtime error</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
        Something went wrong.
      </h1>
      <p className="mt-3 text-zinc-400">
        This part of the page failed to load. You can try again, or head back to the top.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => retry()}>
          <RotateCw className="size-4" /> Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
