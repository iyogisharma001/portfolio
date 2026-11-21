import Image from "next/image";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  src: string;
  alt: string;
  /** Address shown in the bar, e.g. "shopsphere.vercel.app". */
  address: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A screenshot inside minimal browser chrome, cropped to the top of the page. */
export function BrowserFrame({ src, alt, address, sizes, priority, className }: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40", className)}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-zinc-900 px-3 py-2">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="min-w-0 flex-1 truncate rounded bg-white/[0.04] px-2 py-0.5 text-center font-mono text-[0.7rem] text-zinc-500">
          {address}
        </span>
      </div>
      <div className="relative aspect-[16/10] bg-zinc-900">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}
