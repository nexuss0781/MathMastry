import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3 rounded-[var(--radius-md)] border border-dashed border-line p-8", className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h3 className="text-xl">{title}</h3>
      <p className="max-w-lg text-sm leading-relaxed text-muted">{description}</p>
      {action}
    </div>
  );
}
