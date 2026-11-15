import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Loader2, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { PageHeader, SectionTitle, Callout, LoadingBlock, ErrorState } from "@/components/page";
import { LevelPill, LevelLegend } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCurriculum, invalidateEvidence } from "@/lib/queries";
import { api } from "@/lib/api";
import { domainMeta } from "@/lib/domains";
import { cn, formatDate, formatMinutes, formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

export function CurriculumDetailPage() {
  const { id } = useParams({ from: "/curriculum/$id" });
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useCurriculum(id);
  const [updating, setUpdating] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "active" | "paused" | "done">("draft");

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (isLoading || !data) return <LoadingBlock rows={8} />;

  const curriculum = data.curriculum;
  const items = curriculum.weeks.flatMap((week) => week.items);

  async function handleStatusChange(newStatus: "draft" | "active" | "paused" | "done") {
    setUpdating(newStatus);
    try {
      await api(`/curricula/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      Sonner.toast(`Curriculum marked ${newStatus}.`);
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Update failed.");
    } finally {
      setUpdating(null);
    }
  }

  async function handleItemStatus(itemId: string, newStatus: "pending" | "done" | "skipped") {
    setUpdating(itemId);
    try {
      await api(`/curricula/${id}/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      Sonner.toast(newStatus === "done" ? "Item marked done." : `Item ${newStatus}.`);
      invalidateEvidence();
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Update failed.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={`Curriculum · ${curriculum.status}`}
        title={curriculum.title}
        description={curriculum.goal}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("active")} disabled={updating === "active" || curriculum.status === "active"}>
              {updating === "active" ? <Loader2 className="size-3.5 animate-spin" /> : "Activate"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("paused")} disabled={updating === "paused" || curriculum.status === "paused"}>
              {updating === "paused" ? <Loader2 className="size-3.5 animate-spin" /> : "Pause"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("done")} disabled={updating === "done" || curriculum.status === "done"}>
              {updating === "done" ? <Loader2 className="size-3.5 animate-spin" /> : "Complete"}
            </Button>
            <Link to="/curriculum" className="text-sm text-accent hover:underline">All curricula</Link>
          </div>
        }
      />

      <section className="mb-8">
        <SectionTitle eyebrow="Progress" title={`${curriculum.progress}% complete`} />
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Total items</p>
            <p className="mt-1 text-3xl">{curriculum.total}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Done</p>
            <p className="mt-1 text-3xl text-success">{curriculum.done}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Weeks</p>
            <p className="mt-1 text-3xl">{curriculum.weeks.length}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Weekly budget</p>
            <p className="mt-1 text-3xl">{formatMinutes(curriculum.weeklyMinutes)}</p>
          </div>
        </div>
        <Progress value={curriculum.progress} className="mt-4 h-2" barClassName="bg-accent" />
        <div className="mt-2 flex justify-between text-[10px] text-muted">
          <span>Started {formatDate(curriculum.startDate)}</span>
          {curriculum.targetDate && <span>Target {formatDate(curriculum.targetDate)}</span>}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle
          eyebrow="Goal concepts"
          title="Concepts targeted at L2 or L3"
        />
        {curriculum.goalConcepts.length === 0 ? (
          <Callout tone="neutral" className="text-sm">No goal concepts (L2/L3) in this plan.</Callout>
        ) : (
          <ul className="space-y-2">
            {curriculum.goalConcepts.map((item) => (
              <li key={item.id} className="rounded-[var(--radius-sm)] border border-line p-3">
                <Link to="/concepts/$slug" params={{ slug: item.slug }} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: domainMeta(item.domainSlug).color }} />
                    <div>
                      <span className="font-medium">{item.term}</span>
                      <span className="ml-2 font-mono text-[10px] text-muted">target L{item.targetLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <LevelPill level={item.currentLevel} />
                    <span className="font-mono text-[10px] text-muted">W{item.week}</span>
                    <ArrowUpRight className="size-3.5 text-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionTitle eyebrow="Weekly plan" title="Items by week" />
        {curriculum.weeks.map((week) => {
          const weekItems = week.items;
          const weekDone = weekItems.filter((i) => i.status === "done").length;
          const weekProgress = weekItems.length === 0 ? 0 : Math.round((weekDone / weekItems.length) * 100);
          return (
            <details key={week.week} className="mb-4 rounded-[var(--radius-md)] border border-line bg-surface">
              <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Week {week.week}</span>
                  <Progress value={weekProgress} className="h-1.5 w-32" barClassName="bg-accent" />
                  <span className="shrink-0 font-mono text-sm">{weekProgress}%</span>
                </div>
                <span className="font-mono text-[10px] text-muted">{weekItems.length} items · {formatMinutes(weekItems.reduce((sum, i) => sum + i.estimatedMinutes, 0))}</span>
              </summary>
              <div className="divide-y divide-line/60">
                {weekItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <Link to="/concepts/$slug" params={{ slug: item.slug }} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: domainMeta(item.domainSlug).color }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{item.term}</span>
                            <LevelPill level={item.targetLevel} showName className="shrink-0" />
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{item.oneLiner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden text-right sm:block">
                          <p className="font-mono text-[10px] text-muted">{formatMinutes(item.estimatedMinutes)}</p>
                          <p className="font-mono text-[9px] text-muted">pos {item.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <LevelPill level={item.currentLevel} />
                          <select
                            value={item.status}
                            onChange={(e) => handleItemStatus(item.id, e.target.value as "pending" | "done" | "skipped")}
                            disabled={updating === item.id}
                            className="rounded-[var(--radius-sm)] border border-line bg-paper px-2 py-1 text-xs text-ink"
                          >
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                            <option value="skipped">Skipped</option>
                          </select>
                          <ArrowUpRight className="size-3.5 text-muted" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}