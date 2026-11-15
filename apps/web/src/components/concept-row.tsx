import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarClock, Lock } from "lucide-react";
import { LevelPill, StatusPill } from "@/components/level";
import { domainMeta } from "@/lib/domains";
import { cn, formatRelative } from "@/lib/utils";
import type { ConceptCardView } from "@/lib/types";

export function ConceptRow({
  concept,
  showDomain = true,
  className,
}: {
  concept: ConceptCardView;
  showDomain?: boolean;
  className?: string;
}) {
  const meta = domainMeta(concept.domainSlug);
  return (
    <Link
      to="/concepts/$slug"
      params={{ slug: concept.slug }}
      className={cn(
        "group grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 border-b border-line/70 px-1 py-3.5 transition-colors last:border-b-0 hover:bg-ink/[0.025] sm:grid-cols-[minmax(0,1fr)_150px_auto]",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden="true"
          />
          <span className="font-medium leading-snug">{concept.term}</span>
          <LevelPill level={concept.level} />
          {concept.status === "locked" ? (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted">
              <Lock className="size-2.5" />
              prereqs
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted">{concept.oneLiner}</p>
        {concept.missingPrerequisites.length > 0 ? (
          <p className="mt-1 line-clamp-1 text-[10px] text-muted">
            Needs {concept.missingPrerequisites.map((entry) => entry.term).join(", ")} at L1
          </p>
        ) : null}
      </div>

      {showDomain ? (
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-[11px] text-muted">{meta.short}</p>
          <p className="mt-0.5 text-[10px] text-muted/80">{concept.enrichmentStatus === "seed" ? "seed entry" : concept.enrichmentStatus}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-2 justify-self-end">
        {concept.nextReviewAt ? (
          <span className="hidden items-center gap-1 font-mono text-[10px] text-muted md:flex">
            <CalendarClock className="size-3" />
            {formatRelative(concept.nextReviewAt)}
          </span>
        ) : null}
        {concept.status !== "active" ? <StatusPill status={concept.status} className="hidden sm:inline-flex" /> : null}
        <ArrowUpRight className="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
    </Link>
  );
}
