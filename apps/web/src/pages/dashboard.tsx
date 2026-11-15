import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Compass,
  Flame,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { PageHeader, Callout, ErrorState, LoadingBlock, SectionTitle, Stat } from "@/components/page";
import { LevelLegend, LevelPill } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMe, useNextCurriculum, useQueue, useSummary } from "@/lib/queries";
import { domainMeta } from "@/lib/domains";
import { cn, formatDate, formatRelative } from "@/lib/utils";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function ActivityBars({ data }: { data: Array<{ day: string; xp: number }> }) {
  const days = [...data].reverse().slice(-30);
  const max = Math.max(30, ...days.map((day) => day.xp));
  return (
    <div className="flex h-20 items-end gap-[3px]">
      {days.map((day) => (
        <div
          key={day.day}
          title={`${formatDate(day.day)} — ${day.xp} XP`}
          className={cn("min-w-0 flex-1 rounded-t-[2px]", day.xp > 0 ? "bg-accent/70" : "bg-ink/[0.06]")}
          style={{ height: `${Math.max(4, (day.xp / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { data: me } = useMe();
  const { data: summary, isLoading, error, refetch } = useSummary();
  const { data: queue } = useQueue();
  const { data: next } = useNextCurriculum();

  const firstName = (me?.profile?.displayName ?? me?.user?.name ?? "learner").split(/\s+/)[0] ?? "learner";
  const due = queue?.due ?? [];
  const newConcepts = queue?.newConcepts ?? [];
  const total = summary?.totalConcepts ?? 429;
  const levels = summary?.levels ?? { l0: total, l1: 0, l2: 0, l3: 0 };
  const last30Xp = (summary?.recentActivity ?? []).reduce((sum, day) => sum + day.xp, 0);
  const last30Reviews = (summary?.recentActivity ?? []).reduce((sum, day) => sum + day.reviews, 0);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  if (error) {
    return (
      <div>
        <PageHeader eyebrow={todayLabel} title="Your workspace" />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={`${todayLabel} · ${summary?.streak.current ?? 0}-day streak`}
        title={
          <>
            {greeting()}, <span className="italic">{firstName}.</span>
          </>
        }
        description={
          summary && summary.touched > 0
            ? `${summary.touched} concepts carry earned evidence. ${due.length} delayed recalls are waiting; the rest of the atlas is optional.`
            : "Start with one concept. An explain assessment is enough to earn L1 — browsing is not."
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/atlas">
                <Search className="size-4" />
                Atlas
              </Link>
            </Button>
            <Button asChild>
              <Link to="/review">
                <RotateCcw className="size-4" />
                Review {due.length > 0 ? `(${due.length})` : ""}
              </Link>
            </Button>
          </>
        }
      />

      {me?.profile && !me.profile.onboardedAt ? (
        <Callout tone="accent" className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              <strong>Finish setting up your workspace.</strong> Timezone and weekly budget drive review days and
              curriculum planning.
            </span>
            <Button size="sm" asChild>
              <Link to="/welcome">
                Finish setup <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </Callout>
      ) : null}

      {isLoading || !summary ? (
        <LoadingBlock rows={4} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-5 sm:p-6">
                <div>
                  <p className="eyebrow">Review load</p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-5xl leading-none">{due.length}</span>
                    <span className="text-xs text-muted">delayed recalls due</span>
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {due.length > 0
                      ? "These levels were earned before. Recall is what keeps them."
                      : "The queue is clear. New concepts stay optional until you choose one."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant={due.length > 0 ? "primary" : "outline"}>
                    <Link to="/review">
                      {due.length > 0 ? "Start recall" : "Open queue"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {due.length > 0 ? (
                <ul>
                  {due.slice(0, 4).map((item) => (
                    <li key={item.slug} className="border-b border-line/60 last:border-b-0">
                      <Link
                        to="/concepts/$slug"
                        params={{ slug: item.slug }}
                        className="group flex items-center gap-3 px-5 py-3 hover:bg-ink/[0.025] sm:px-6"
                      >
                        <LevelPill level={item.level} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.term}</span>
                          <span className="block truncate text-[11px] text-muted">{domainMeta(item.domainSlug).short}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted">
                          {item.daysOverdue > 0 ? `${item.daysOverdue}d overdue` : "due now"}
                        </span>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : newConcepts.length > 0 ? (
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-medium">Unlocked and untouched</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {newConcepts.slice(0, 5).map((concept) => (
                      <Link
                        key={concept.slug}
                        to="/concepts/$slug"
                        params={{ slug: concept.slug }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs transition-colors hover:border-ink/30 hover:bg-ink/5"
                      >
                        {concept.term}
                        <ArrowUpRight className="size-3 text-muted" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-sm text-muted">No unlocked new concepts. Every entry has been touched.</div>
              )}
            </section>

            <section>
              <SectionTitle
                eyebrow="Plan"
                title={next?.curriculum ? next.curriculum.title : "No active curriculum"}
                action={
                  next?.curriculum ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/curriculum/$id" params={{ id: next.curriculum.id }}>
                        Open plan <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/curriculum">Create one <ArrowRight className="size-3.5" /></Link>
                    </Button>
                  )
                }
              />
              {next?.curriculum ? (
                <div className="rounded-[var(--radius-md)] border border-line bg-surface">
                  <div className="flex items-center gap-3 border-b border-line px-5 py-3">
                    <Progress value={next.curriculum.progress} className="flex-1" />
                    <span className="font-mono text-[10px] text-muted">{next.curriculum.progress}%</span>
                  </div>
                  {next.items.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-muted">All planned items are done. Mark the plan complete or set a new goal.</p>
                  ) : (
                    <ul>
                      {next.items.slice(0, 4).map((item) => (
                        <li key={item.id} className="border-b border-line/60 last:border-b-0">
                          <Link
                            to="/concepts/$slug"
                            params={{ slug: item.slug }}
                            className="group flex items-center gap-3 px-5 py-3 hover:bg-ink/[0.025]"
                          >
                            <span className="w-10 shrink-0 font-mono text-[10px] text-muted">W{item.week}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm">{item.term}</span>
                              <span className="block text-[10px] text-muted">
                                target L{item.targetLevel} · {item.estimatedMinutes} min
                              </span>
                            </span>
                            <LevelPill level={item.currentLevel} />
                            <ArrowUpRight className="size-3.5 text-muted" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="rounded-[var(--radius-md)] border border-dashed border-line p-5">
                  <p className="text-sm leading-relaxed text-muted">
                    State a mathematical goal — “measure theory and integration”, “representation theory”, “stochastic
                    processes” — and the planner walks backwards through prerequisites against your weekly budget.
                  </p>
                  <Button size="sm" className="mt-3" asChild>
                    <Link to="/curriculum">
                      <Compass className="size-3.5" /> Build a curriculum
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            <section>
              <SectionTitle
                eyebrow="Domains"
                title="Where the evidence sits"
                action={
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/atlas">
                      Full atlas <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                }
              />
              <div className="grid gap-x-8 sm:grid-cols-2">
                {summary.domains.map((domain) => {
                  const meta = domainMeta(domain.slug);
                  return (
                    <Link
                      key={domain.slug}
                      to="/atlas/$domain"
                      params={{ domain: domain.slug }}
                      className="group border-t border-line py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span className="truncate text-[13px]">{meta.short}</span>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] text-muted">
                          {domain.l1 + domain.l2 + domain.l3}/{domain.total}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress
                          value={domain.total === 0 ? 0 : ((domain.l2 + domain.l3) / domain.total) * 100}
                          className="h-1 flex-1 bg-ink/[0.06]"
                          barClassName="bg-ink/50"
                        />
                        <span className="w-20 shrink-0 text-right font-mono text-[9px] text-muted">
                          L1 {domain.l1} · L2 {domain.l2}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[var(--radius-lg)] border border-line bg-ink p-5 text-paper">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">Streak</p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-5xl leading-none">{summary.streak.current}</span>
                    <span className="text-xs text-paper/55">days with evidence</span>
                  </p>
                </div>
                <Flame className={cn("size-6", summary.streak.current > 0 ? "text-accent" : "text-paper/25")} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-paper/12 pt-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper/40">Longest</p>
                  <p className="mt-0.5 text-lg">{summary.streak.longest}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper/40">Last evidence</p>
                  <p className="mt-0.5 text-sm">{summary.streak.lastEvidenceDay ? formatRelative(summary.streak.lastEvidenceDay) : "not yet"}</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-paper/45">
                One grace day per week protects the streak. Grace never changes a mastery level.
              </p>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Mastery distribution</p>
                  <p className="mt-1 text-2xl">{summary.touched} <span className="text-sm text-muted">of {total} touched</span></p>
                </div>
                <Layers className="size-5 text-muted" />
              </div>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-ink/[0.06]">
                <span className="bg-ink/25" style={{ width: `${(levels.l0 / total) * 100}%` }} title={`L0 ${levels.l0}`} />
                <span className="bg-level-1" style={{ width: `${(levels.l1 / total) * 100}%` }} title={`L1 ${levels.l1}`} />
                <span className="bg-level-2" style={{ width: `${(levels.l2 / total) * 100}%` }} title={`L2 ${levels.l2}`} />
                <span className="bg-level-3" style={{ width: `${(levels.l3 / total) * 100}%` }} title={`L3 ${levels.l3}`} />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { key: "l0", label: "L0", value: levels.l0, className: "text-muted" },
                  { key: "l1", label: "L1", value: levels.l1, className: "text-level-1" },
                  { key: "l2", label: "L2", value: levels.l2, className: "text-level-2" },
                  { key: "l3", label: "L3", value: levels.l3, className: "text-level-3" },
                ].map((entry) => (
                  <div key={entry.key}>
                    <p className={cn("font-mono text-[9px] uppercase tracking-wider", entry.className)}>{entry.label}</p>
                    <p className="mt-0.5 text-base">{entry.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="text-[10px] text-muted">{summary.retained} retained</span>
                <LevelLegend />
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Last 30 days</p>
                <Link to="/progress" className="text-[10px] text-accent hover:underline">
                  Full record
                </Link>
              </div>
              <div className="mt-3 flex items-baseline gap-4">
                <Stat label="XP" value={last30Xp.toLocaleString()} className="[&_p:last-child]:hidden" />
                <Stat label="Reviews" value={last30Reviews} className="[&_p:last-child]:hidden" />
                <Stat label="Due" value={summary.due} className="[&_p:last-child]:hidden" />
              </div>
              <div className="mt-4">
                <ActivityBars data={summary.recentActivity} />
              </div>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-muted">
                <CalendarClock className="size-3" />
                XP comes only from recorded reviews, recall, and notes.
              </p>
            </section>

            {summary.touched === 0 ? (
              <section className="rounded-[var(--radius-lg)] border border-dashed border-accent/40 bg-accent/[0.04] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  <p className="text-sm font-medium">First evidence</p>
                </div>
                <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
                  <li className="flex gap-2">
                    <span className="font-mono text-accent">01</span>
                    Pick a concept you think you know.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-mono text-accent">02</span>
                    Write an explain answer without looking.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-mono text-accent">03</span>
                    Read the rubric gaps, then revise.
                  </li>
                </ol>
                <Button size="sm" className="mt-4" asChild>
                  <Link to="/atlas">
                    Find a concept <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </section>
            ) : (
              <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  <p className="text-sm font-medium">Next best move</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {due.length > 0
                    ? "Clear the recall queue first. New material is cheaper to learn after retention is protected."
                    : summary.retained < summary.touched
                      ? "Some levels are still fresh. A delayed recall after seven days turns fresh evidence into retained mastery."
                      : "Retention is holding. Extend the frontier with one adjacent concept or a curriculum goal."}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/review">Recall</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/tutor">Tutor</Link>
                  </Button>
                </div>
              </section>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
