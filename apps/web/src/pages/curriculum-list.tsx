import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Compass, Loader2, Plus, Trash2 } from "lucide-react";
import { PageHeader, Callout, ErrorState, LoadingBlock, SectionTitle, Stat } from "@/components/page";
import { LevelPill, LevelLegend } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { useCurricula, invalidateEvidence } from "@/lib/queries";
import { api } from "@/lib/api";
import { domainMeta } from "@/lib/domains";
import { cn, formatDate, formatMinutes } from "@/lib/utils";
import * as Sonner from "sonner";

export function CurriculumListPage() {
  const { data, isLoading, error, refetch } = useCurricula();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [goal, setGoal] = useState("");
  const [weeklyMinutes, setWeeklyMinutes] = useState(300);
  const [horizonWeeks, setHorizonWeeks] = useState(8);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setErrorMsg(null);
    if (!goal.trim()) {
      setErrorMsg("Describe your goal.");
      return;
    }
    setCreating(true);
    try {
      const res = await api<{ curriculum: { id: string } }>("/curricula", {
        method: "POST",
        body: JSON.stringify({
          goal: goal.trim(),
          weeklyMinutes,
          horizonWeeks,
        }),
      });
      Sonner.toast.success("Curriculum created.");
      invalidateEvidence();
      setGoal("");
      void navigate({ to: "/curriculum/$id", params: { id: res.curriculum.id } });
    } catch (cause) {
      setErrorMsg(cause instanceof Error ? cause.message : "Could not create curriculum.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm("Delete this curriculum? Progress is kept at the concept level.")) return;
    try {
      await api(`/curricula/${id}`, { method: "DELETE" });
      Sonner.toast("Curriculum deleted.");
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Delete failed.");
    }
  }

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <div>
      <PageHeader
        eyebrow="Curriculum"
        title="Your learning plans"
        description="State a goal. The planner walks prerequisites backwards and budgets the work against your week."
        actions={
          <Button asChild>
            <Link to="/curriculum/new">
              <Plus className="size-4" /> New curriculum
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <LoadingBlock rows={6} />
      ) : data?.curricula.length === 0 ? (
        <EmptyState
          eyebrow="No curricula yet"
          title="Build your first plan"
          description="Tell the planner what you want to understand — “measure theory and integration”, “representation theory”, “stochastic processes” — and it will match atlas concepts, walk their prerequisites, and lay out a weekly schedule."
          action={
            <Button asChild>
              <Link to="/curriculum/new"><Plus className="size-3.5" /> Create curriculum</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line/70">
          {data!.curricula.map((curriculum) => (
            <li key={curriculum.id} className="py-4">
              <Link
                to="/curriculum/$id"
                params={{ id: curriculum.id }}
                className="group grid grid-cols-[1fr_auto] items-start gap-4 px-1 py-2 hover:bg-ink/[0.025] rounded-[var(--radius-sm)]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-medium">{curriculum.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{curriculum.status}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{curriculum.goal}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted">
                    <span className="flex items-center gap-1"><Compass className="size-3" /> {formatMinutes(curriculum.weeklyMinutes)}/week</span>
                    <span className="flex items-center gap-1">{curriculum.total} items · {curriculum.done} done</span>
                    <span className="flex items-center gap-1">Started {formatDate(curriculum.startDate)}</span>
                    {curriculum.targetDate && (
                      <span className="flex items-center gap-1">Target {formatDate(curriculum.targetDate)}</span>
                    )}
                  </div>
                  <Progress value={curriculum.progress} className="mt-2 h-1.5" barClassName="bg-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="shrink-0 text-right font-mono text-sm">
                    <span className={cn("text-level-1", curriculum.progress > 0 && "text-level-2")}>{curriculum.progress}%</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(curriculum.id, e)} className="text-muted hover:text-danger">
                    <Trash2 className="size-4" />
                  </Button>
                  <ArrowUpRight className="size-5 text-muted group-hover:text-accent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}