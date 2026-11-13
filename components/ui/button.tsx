import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-zinc-950 shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_8px_30px_-8px_rgb(129_140_248/0.6)] hover:bg-zinc-100 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_10px_36px_-6px_rgb(34_211_238/0.55)]",
  secondary: "glass text-zinc-100 hover:border-white/20 hover:bg-zinc-800/70",
  ghost: "text-zinc-400 hover:bg-white/5 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm sm:text-[0.95rem]",
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
