import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Loader2, RotateCcw, Star } from "lucide-react";
import { PageHeader, Callout, LoadingBlock, ErrorState, SectionTitle } from "@/components/page";
import { LevelPill, RetentionPill, StatusPill } from "@/components/level";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/input";
import { useQueue, invalidateEvidence } from "@/lib/queries";
import { api } from "@/lib/api";
import { domainMeta } from "@/lib/domains";
import { cn, formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

export function ReviewPage() {
  const { data, isLoading, error, refetch } = useQueue();
  const navigate = useNavigate();
  const [recalling, setRecalling] = useState<string | null>(null);
  const [recallGrade, setRecallGrade] = useState<"yes" | "partial" | "no">("yes");
  const [assessing, setAssessing] = useState<string | null>(null);
  const [assessKind, setAssessKind] = useState<"explain" | "apply" | "connect">("explain");
  const [assessAnswer, setAssessAnswer] = useState("");

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  const due = data?.due ?? [];
  const newConcepts = data?.newConcepts ?? [];

  async function handleRecall(slug: string, event: FormEvent) {
    event.preventDefault();
    setRecalling(slug);
    try {
      await api("/recall", {
        method: "POST",
        body: JSON.stringify({ conceptSlug: slug, grade: recallGrade, idempotencyKey: `recall-${Date.now()}` }),
      });
      Sonner.toast("Recall recorded.");
      invalidateEvidence();
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Recall failed.");
    } finally {
      setRecalling(null);
    }
  }

  async function handleAssess(slug: string, event: FormEvent) {
    event.preventDefault();
    if (!assessAnswer.trim()) return;
    setAssessing(slug);
    try {
      await api("/assessments", {
        method: "POST",
        body: JSON.stringify({
          conceptSlug: slug,
          kind: assessKind,
          answer: assessAnswer.trim(),
          idempotencyKey: `assess-${Date.now()}`,
        }),
      });
      Sonner.toast("Assessment recorded.");
      invalidateEvidence();
      setAssessAnswer("");
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Assessment failed.");
    } finally {
      setAssessing(null);
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader eyebrow="Review queue" title="Delayed recalls and new concepts" />
        <LoadingBlock rows={8} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Review queue"
        title={due.length > 0 ? `${due.length} recalls due` : "Queue clear"}
        description={
          due.length > 0
            ? "These levels were earned before. Recall is what keeps them. New concepts stay optional until you choose one."
            : "No delayed recalls waiting. The queue is clear — new material is optional."
        }
        actions={
          <Button variant="outline" asChild>
            <Link to="/progress">
              <Star className="size-4" /> Progress
            </Link>
          </Button>
        }
      />

      {due.length > 0 ? (
        <section className="mb-10">
          <SectionTitle eyebrow="Due now" title={`${due.length} delayed recalls`} />
          <div className="space-y-3">
            {due.map((item) => (
              <div key={item.slug} className="rounded-[var(--radius-lg)] border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: domainMeta(item.domainSlug).color }} />
                    <div>
                      <Link
                        to="/concepts/$slug"
                        params={{ slug: item.slug }}
                        className="font-medium hover:text-accent"
                      >
                        {item.term}
                      </Link>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <span className="font-mono">{domainMeta(item.domainSlug).short}</span>
                        <LevelPill level={item.level} />
                        <RetentionPill retention={item.retention} />
                        <span className="font-mono">
                          {item.daysOverdue > 0 ? `${item.daysOverdue}d overdue` : "due now"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted" />
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-muted">
                    Show recall prompt
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.prompt}</p>
                </details>

                <form onSubmit={(e) => handleRecall(item.slug, e)} className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(["yes", "partial", "no"] as const).map((grade) => (
                      <Button
                        key={grade}
                        type="submit"
                        variant={recallGrade === grade ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setRecallGrade(grade)}
                        disabled={recalling === item.slug}
                      >
                        {recalling === item.slug ? <Loader2 className="size-3.5 animate-spin" /> : grade.charAt(0).toUpperCase() + grade.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted">
                    yes = full recall · partial = gist only · no = couldn't retrieve
                  </p>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <Callout tone="success" title="Recall queue clear">
          No delayed recalls are waiting. Retention is holding. You can explore new concepts or start a curriculum.
        </Callout>
      )}

      {newConcepts.length > 0 && (
        <section className="mb-10">
          <SectionTitle eyebrow="Unlocked" title={`${newConcepts.length} concepts available`} action={
            <Link to="/atlas" className="text-sm text-accent hover:underline">Browse all <ArrowRight className="size-3.5 inline" /></Link>
          } />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {newConcepts.slice(0, 12).map((concept) => (
              <Link
                key={concept.slug}
                to="/concepts/$slug"
                params={{ slug: concept.slug }}
                className="group rounded-[var(--radius-md)] border border-line bg-surface p-4 transition-colors hover:border-ink/30 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: domainMeta(concept.domainSlug).color }} />
                  <span className="font-medium truncate">{concept.term}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{concept.oneLiner}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted">{domainMeta(concept.domainSlug).short}</span>
                  <ArrowUpRight className="size-3.5 text-muted group-hover:text-accent" />
                </div>
              </Link>
            ))}
            {newConcepts.length > 12 && (
              <Link
                to="/atlas"
                className="col-span-full rounded-[var(--radius-md)] border border-dashed border-line p-4 text-center text-sm text-accent hover:bg-ink/5"
              >
                +{newConcepts.length - 12} more in the atlas
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="border-t border-line pt-8">
        <SectionTitle eyebrow="Quick assessment" title="Earn a new level" />
        <Callout tone="neutral" className="text-sm">
          Pick any available concept. Write an explain, apply, or connect answer without looking. The grader uses a
          published rubric; fixture mode is deterministic and discloses itself.
        </Callout>
        <form onSubmit={(e) => handleAssess("manual", e)} className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {(["explain", "apply", "connect"] as const).map((kind) => (
              <Button type="button" variant={assessKind === kind ? "primary" : "outline"} size="sm" onClick={() => setAssessKind(kind)}>
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </Button>
            ))}
          </div>
          <Textarea
            value={assessAnswer}
            onChange={(e) => setAssessAnswer(e.target.value)}
            placeholder="Paste or type your answer here, then choose a concept on the next screen…"
            rows={6}
            disabled={!!assessing}
          />
          <Button type="button" className="w-full" onClick={() => void navigate({ to: "/atlas" })} disabled={!!assessing}>
            {assessing ? <Loader2 className="size-3.5 animate-spin" /> : "Choose a concept in the atlas"}
          </Button>
        </form>
      </section>
    </div>
  );
}