import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-zinc-100 text-zinc-950 hover:bg-white",
  secondary: "border border-white/10 bg-white/[0.03] text-zinc-100 hover:border-white/20 hover:bg-white/[0.06]",
  ghost: "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

type StyleProps = { variant?: Variant; size?: Size };

export function buttonClasses({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return <button className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}

/** An anchor styled as a button. External links open safely in a new tab. */
export function ButtonLink({
  variant,
  size,
  className,
  external,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps & { external?: boolean }) {
  return (
    <a
      className={cn(buttonClasses({ variant, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
