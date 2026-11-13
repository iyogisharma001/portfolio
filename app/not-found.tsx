import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-gradient font-mono text-7xl font-semibold">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 text-zinc-400">The link may be broken, or the page may have moved.</p>
      <ButtonLink href="/" className="mt-8">
        <ArrowLeft className="size-4" /> Back to home
      </ButtonLink>
    </div>
  );
}
