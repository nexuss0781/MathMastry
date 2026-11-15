import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Lock, Search } from "lucide-react";
import { PageHeader, LoadingBlock, SectionTitle } from "@/components/page";
import { ConceptRow } from "@/components/concept-row";
import { LevelLegend, LevelPill, StatusPill } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConcepts, useSearch } from "@/lib/queries";
import { domainMeta, DOMAIN_ORDER } from "@/lib/domains";
import { cn, formatRelative } from "@/lib/utils";

export function DomainRoute() {
  const { domain } = useParams({ from: "/atlas/$domain" });
  const { data } = useConcepts();
  const concepts = (data?.items ?? []).filter((c) => c.domainSlug === domain);
  const meta = domainMeta(domain);

  if (!concepts.length && data) {
    return <div className="text-center py-12"><p className="text-muted">No concepts in this domain.</p></div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow={`Domain · ${concepts.length} concepts`}
        title={meta.short}
        description={meta.blurb}
        actions={
          <Link to="/atlas" className="text-sm text-accent hover:underline">
            All domains <ArrowRight className="size-3.5 inline" />
          </Link>
        }
      />

      <div className="mb-6 flex gap-3">
        <div className="flex-1" />
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            placeholder="Filter concepts…"
            className="pl-9"
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value) url.searchParams.set("q", e.target.value);
              else url.searchParams.delete("q");
              window.history.replaceState({}, "", url);
            }}
          />
        </div>
      </div>

      {concepts.length > 0 ? (
        <ul className="divide-y divide-line/70">
          {concepts.map((concept) => (
            <li key={concept.slug} className="border-b border-line/70 last:border-b-0">
              <Link
                to="/concepts/$slug"
                params={{ slug: concept.slug }}
                className="group grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-1 py-3.5 transition-colors hover:bg-ink/[0.025] sm:grid-cols-[minmax(0,1fr)_150px_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
                    <span className="font-medium leading-snug">{concept.term}</span>
                    <LevelPill level={concept.level} />
                    {concept.status === "locked" && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                        <Lock className="size-2.5" /> prereqs
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted">{concept.oneLiner}</p>
                  {concept.missingPrerequisites.length > 0 ? (
                    <p className="mt-1 line-clamp-1 text-[10px] text-muted">
                      Needs {concept.missingPrerequisites.map((entry) => entry.term).join(", ")} at L1
                    </p>
                  ) : null}
                </div>

                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-[11px] text-muted">{meta.short}</p>
                  <p className="mt-0.5 text-[10px] text-muted/80">
                    {concept.enrichmentStatus === "seed" ? "seed entry" : concept.enrichmentStatus}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-self-end">
                  {concept.nextReviewAt ? (
                    <span className="hidden items-center gap-1 font-mono text-[10px] text-muted md:flex">
                      <BookOpen className="size-3" />
                      {formatRelative(concept.nextReviewAt)}
                    </span>
                  ) : null}
                  {concept.status !== "active" ? <StatusPill status={concept.status} className="hidden sm:inline-flex" /> : null}
                  <ArrowUpRight className="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : data ? null : (
        <LoadingBlock rows={8} />
      )}
    </div>
  );
}

export function DomainPage() {
  return <DomainRoute />;
}