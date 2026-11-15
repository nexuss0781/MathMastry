import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { PageHeader, Callout, LoadingBlock, SectionTitle, Stat } from "@/components/page";
import { LevelPill, LevelLegend } from "@/components/level";
import { Button } from "@/components/ui/button";
import { useDomains, usePublicAtlas } from "@/lib/queries";
import { domainMeta, DOMAIN_ORDER } from "@/lib/domains";
import { cn, formatRelative } from "@/lib/utils";

interface PublicAtlasDomain {
  slug: string;
  name: string;
  description: string;
  count: number;
  sources: number;
  sample: Array<{ slug: string; term: string }>;
  gap?: boolean;
}

export function AtlasPage() {
  const { data: domainsData, isLoading } = useDomains();
  const { data: atlas } = usePublicAtlas();

  if (isLoading) {
    return (
      <div>
        <PageHeader eyebrow="The atlas" title="Twelve domains. One connected index." />
        <LoadingBlock rows={8} />
      </div>
    );
  }

  const totals = {
    concepts: atlas?.totalConcepts ?? domainsData?.totals.concepts ?? 429,
    populated: atlas?.totalDomains ?? domainsData?.totals.populatedDomains ?? 12,
    gap: domainsData?.totals.gapDomains ?? 0,
    edges: atlas?.totalEdges ?? 0,
    sources: atlas?.totalSources ?? 0,
  };

  // Use public atlas for domain display (has sample, count, sources)
  const atlasDomains = (atlas?.domains ?? []) as PublicAtlasDomain[];
  const ordered = [...atlasDomains].sort((a, b) => {
    const ai = DOMAIN_ORDER.indexOf(a.slug);
    const bi = DOMAIN_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const populated = ordered.filter((d) => !d.gap);
  const gap = ordered.filter((d) => d.gap);

  return (
    <div>
      <PageHeader
        eyebrow="The atlas"
        title="Twelve domains. One connected index."
        description="Every concept carries prerequisite and related links. Browse by domain or search the whole graph."
        actions={
          <Button variant="outline" asChild>
            <Link to="/atlas">
              <Search className="size-4" /> Browse domains
            </Link>
          </Button>
        }
      />

      <section className="mb-10">
        <SectionTitle eyebrow="Overview" title="What the atlas contains" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Concepts" value={totals.concepts} hint="sourced glossary entries" />
          <Stat label="Domains" value={totals.populated} hint="MSC2020 coverage spine" />
          <Stat label="Graph edges" value={totals.edges} hint="prerequisite & related" />
          <Stat label="Sources" value={totals.sources} hint="cited in the atlas" />
          <Stat label="Gap domains" value={totals.gap} hint="placeholders without concepts" />
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle eyebrow="Domains" title={populated.length === 0 ? "No domains yet" : undefined} />
        <div className="grid gap-4 lg:grid-cols-2">
          {populated.map((domain, index) => {
            const meta = domainMeta(domain.slug);
            const progressData = domainsData?.domains.find((d) => d.slug === domain.slug);
            const touched = progressData ? progressData.l1 + progressData.l2 + progressData.l3 : 0;
            const total = progressData?.total ?? domain.count;
            return (
              <Link
                key={domain.slug}
                to="/atlas/$domain"
                params={{ domain: domain.slug }}
                className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface transition-all hover:border-ink/30 hover:shadow-lg"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <defs>
                      <linearGradient id={`domain-bg-${domain.slug}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={meta.color} stopOpacity="0.08" />
                        <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="200" fill={`url(#domain-bg-${domain.slug})`} />
                  </svg>
                </div>
                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                      <h3 className="truncate text-base font-medium">{meta.short}</h3>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-muted">{domain.count}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{domain.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {domain.sample.slice(0, 3).map((sample) => (
                        <span key={sample.slug} className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] text-muted">
                          {sample.term}
                        </span>
                      ))}
                      {domain.sample.length > 3 && (
                        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] text-muted">
                          +{domain.sample.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted">
                      <span className="font-mono">{touched}</span>
                      <span>/</span>
                      <span>{total}</span>
                      <LevelLegend />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {gap.length > 0 && (
          <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-line p-4">
            <p className="text-sm text-muted">
              Placeholder domains without concepts: {gap.map((d) => d.name).join(", ")}.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-line pt-8">
        <SectionTitle eyebrow="How it works" title="The atlas is a prerequisite graph, not a list." />
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Callout tone="neutral" title="Prerequisites">
            Each concept declares what must be understood first. The planner walks backwards from your goal to repair the
            foundation before the roof.
          </Callout>
          <Callout tone="neutral" title="Related links">
            Concepts that illuminate each other across domains — analogies, dualities, and shared structures.
          </Callout>
          <Callout tone="neutral" title="Evidence gates">
            A concept unlocks when its prerequisites reach the required level (L1 for L2 goals, L2 for L3). Self-reports
            never unlock.
          </Callout>
        </div>
      </section>
    </div>
  );
}