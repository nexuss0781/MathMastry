import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-8", className)} aria-hidden="true">
      <rect width="40" height="40" rx="7" fill="var(--accent)" />
      <circle cx="20" cy="20" r="10.5" fill="none" stroke="var(--accent-ink)" strokeWidth="1.4" opacity="0.9" />
      <path d="M20 6.5v27M6.5 20h27" stroke="var(--accent-ink)" strokeWidth="0.9" opacity="0.45" />
      <path d="M9 31 20 9l11 22" fill="none" stroke="var(--accent-ink)" strokeWidth="1.2" opacity="0.8" />
      <circle cx="20" cy="20" r="1.7" fill="var(--accent-ink)" />
    </svg>
  );
}

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <BrandMark />
      {compact ? null : (
        <span className="font-display text-[1.35rem] leading-none tracking-[-0.03em]">
          Math<span className="italic">Mastery</span>
        </span>
      )}
    </Link>
  );
}
