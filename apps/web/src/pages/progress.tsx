import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Flame, FileText, Layers, Loader2, RotateCcw, TrendingUp, Zap } from "lucide-react";
import { PageHeader, LoadingBlock, ErrorState, SectionTitle, Stat, Callout } from "@/components/page";
import { Heatmap } from "@/components/heatmap";
import { LevelPill, LevelLegend, RetentionPill } from "@/components/level";
import { Progress } from "@/components/ui/progress";
import { useSummary, useHeatmap, useReviews } from "@/lib/queries";
import { domainMeta } from "@/lib/domains";
import { cn, formatDate, formatRelative } from "@/lib/utils";

export function ProgressPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch } = useSummary();
  const { data: heatmap, isLoading: heatmapLoading } = useHeatmap(53);
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const [weeks, setWeeks] = useState(53);

  if (summaryError) return <ErrorState error={summaryError} onRetry={() => void refetch()} />;

  if (summaryLoading || !summary) {
    return (
      <div>
        <PageHeader eyebrow="Progress" title="Your mastery record" />
        <LoadingBlock rows={10} />
      </div>
    );
  }

  const totals = summary.levels;
  const totalConcepts = summary.totalConcepts;
  const touched = summary.touched;
  const retained = summary.retained;
  const streak = summary.streak;
  const recentActivity = summary.recentActivity ?? [];
  const last30Xp = recentActivity.reduce((sum, day) => sum + day.xp, 0);
  const last30Reviews = recentActivity.reduce((sum, day) => sum + day.reviews, 0);
  const last30Minutes = recentActivity.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Progress"
        title="Your mastery record"
        description="Evidence, retention, and activity — nothing inferred from page views."
      />

      <section className="mb-8">
        <SectionTitle eyebrow="Overview" title="Mastery distribution" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Total concepts" value={totalConcepts} hint={touched > 0 ? `${touched} touched` : "none touched"} />
          <Stat label="Retained" value={retained} hint={touched > 0 ? `${Math.round((retained / touched) * 100)}% of touched` : "—"} />
          <Stat label="Streak" value={streak.current} hint={streak.longest > 0 ? `best ${streak.longest}` : "—"} className="sm:col-span-2" />
          <Stat label="30-day XP" value={last30Xp.toLocaleString()} hint={`${last30Reviews} reviews · ${last30Minutes}m`} />
        </div>

        <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-ink/[0.06]">
          <span className="bg-ink/25" style={{ width: `${(totals.l0 / totalConcepts) * 100}%` }} title={`L0 ${totals.l0}`} />
          <span className="bg-level-1" style={{ width: `${(totals.l1 / totalConcepts) * 100}%` }} title={`L1 ${totals.l1}`} />
          <span className="bg-level-2" style={{ width: `${(totals.l2 / totalConcepts) * 100}%` }} title={`L2 ${totals.l2}`} />
          <span className="bg-level-3" style={{ width: `${(totals.l3 / totalConcepts) * 100}%` }} title={`L3 ${totals.l3}`} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <LevelLegend />
          <span className="font-mono text-[10px] text-muted">{touched} of {totalConcepts} concepts carry evidence</span>
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle eyebrow="Retention" title="Levels that survived the delay" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Fresh</p>
                <p className="mt-2 font-display text-5xl">{touched - retained}</p>
              </div>
              <Flame className="size-8 text-warning" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">Earned but not yet validated by a delayed recall after seven days.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Retained</p>
                <p className="mt-2 font-display text-5xl text-success">{retained}</p>
              </div>
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">Passed a recall at least seven days after the level-up. Two consecutive failures drop the level.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Streak</p>
                <p className="mt-2 font-display text-5xl text-accent">{streak.current}</p>
              </div>
              <Flame className="size-8 text-accent" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {streak.lastEvidenceDay ? `Last evidence: ${formatRelative(streak.lastEvidenceDay)}` : "No evidence yet."}
              One grace day per week protects the streak without faking evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle
          eyebrow="Activity"
          title="GitHub-style heatmap"
          action={
            <select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="rounded-[var(--radius-sm)] border border-line bg-paper px-2 py-1 text-xs">
              <option value={12}>12 weeks</option>
              <option value={26}>26 weeks</option>
              <option value={53}>52 weeks</option>
            </select>
          }
        />
        {heatmapLoading ? (
          <LoadingBlock rows={4} />
        ) : heatmap ? (
          <Heatmap data={heatmap} />
        ) : (
          <Callout tone="neutral" className="text-sm">No activity recorded yet.</Callout>
        )}
      </section>

      <section className="mb-8">
        <SectionTitle eyebrow="Domains" title="Where the evidence sits" />
        <div className="space-y-3">
          {summary.domains.map((domain) => {
            const meta = domainMeta(domain.slug);
            const done = domain.l1 + domain.l2 + domain.l3;
            return (
              <Link
                key={domain.slug}
                to="/atlas/$domain"
                params={{ domain: domain.slug }}
                className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface p-3 transition-colors hover:border-ink/30"
              >
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{meta.short}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted">{done}/{domain.total}</span>
                  </div>
                  <Progress
                    value={domain.total === 0 ? 0 : ((domain.l2 + domain.l3) / domain.total) * 100}
                    className="mt-1 h-1.5"
                    barClassName="bg-ink/50"
                  />
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted">
                    <LevelPill level={1} />
                    <span className="font-mono">{domain.l1}</span>
                    <LevelPill level={2} />
                    <span className="font-mono">{domain.l2}</span>
                    <LevelPill level={3} />
                    <span className="font-mono">{domain.l3}</span>
                  </div>
                </div>
                <RotateCcw className="size-5 shrink-0 text-muted group-hover:text-accent" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle eyebrow="Recent reviews" title="Last 25 graded items" action={
          <Link to="/review" className="text-sm text-accent hover:underline">Review queue <RotateCcw className="size-3.5 inline" /></Link>
        } />
        {reviewsLoading ? (
          <LoadingBlock rows={5} />
        ) : reviews?.reviews.length === 0 ? (
          <Callout tone="neutral" className="text-sm">No reviews yet. Submit an assessment to start your record.</Callout>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-line overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] border-b border-line bg-ink/[0.02] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
              <span className="w-24">Date</span>
              <span>Concept</span>
              <span className="w-28 text-center">Kind</span>
              <span className="w-20 text-center">Score</span>
              <span className="w-20 text-center">Result</span>
            </div>
            {reviews!.reviews.map((review) => (
              <div key={review.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] border-b border-line/60 last:border-b-0 px-4 py-2">
                <span className="font-mono text-[10px] text-muted w-24">{formatRelative(review.createdAt)}</span>
                <span className="truncate text-sm">{review.conceptTerm}</span>
                <span className="w-28 text-center font-mono text-[10px] text-muted">{review.kind}</span>
                <span className="w-20 text-center font-mono text-sm">{review.score}/{review.maxScore}</span>
                <span className={cn("w-20 text-center font-mono text-[10px]", review.passed ? "text-success" : "text-danger")}>
                  {review.passed ? "pass" : "fail"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle eyebrow="Export" title="Your data, your format" />
        <div className="grid gap-3 sm:grid-cols-3">
          <button className="rounded-[var(--radius-md)] border border-line bg-surface p-4 text-left hover:border-ink/30">
            <FileText className="size-5 text-accent" />
            <h4 className="mt-2 font-medium">JSON</h4>
            <p className="mt-1 text-sm text-muted">Complete record with all concepts, states, reviews, notes, and curriculum items.</p>
          </button>
          <button className="rounded-[var(--radius-md)] border border-line bg-surface p-4 text-left hover:border-ink/30">
            <FileText className="size-5 text-accent" />
            <h4 className="mt-2 font-medium">Markdown</h4>
            <p className="mt-1 text-sm text-muted">Human-readable summary with mastery table, streak, and recent activity.</p>
          </button>
          <button className="rounded-[var(--radius-md)] border border-line bg-surface p-4 text-left hover:border-ink/30">
            <FileText className="size-5 text-accent" />
            <h4 className="mt-2 font-medium">Anki (TSV)</h4>
            <p className="mt-1 text-sm text-muted">Import into Anki: concept, level, retention, next review, and prompt.</p>
          </button>
        </div>
      </section>
    </div>
  );
}