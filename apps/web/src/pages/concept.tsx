import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Copy,
  Edit,
  FileText,
  HelpCircle,
  Loader2,
  MessageSquare,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader, SectionTitle, Callout, ErrorState, LoadingBlock, InlineLoader } from "@/components/page";
import { Markdown } from "@/components/markdown";
import { LevelPill, RetentionPill, StatusPill, LevelLegend } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConcept, invalidateEvidence, invalidateNotes } from "@/lib/queries";
import { api, idempotencyKey } from "@/lib/api";
import { domainMeta } from "@/lib/domains";
import { cn, formatDate, formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

function PromptBox({ label, prompt, onCopy }: { label: string; prompt: string; onCopy: () => void }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-line bg-ink/[0.02] p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</span>
        <Button variant="ghost" size="icon" onClick={onCopy} className="text-[10px]" title="Copy prompt">
          <Copy className="size-3.5" />
        </Button>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{prompt}</p>
    </div>
  );
}

export function ConceptPage() {
  const { slug } = useParams({ from: "/concepts/$slug" });
  const { data: concept, isLoading, error, refetch } = useConcept(slug);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"assess" | "recall" | "claim" | "notes" | "tutor">("assess");
  const [assessing, setAssessing] = useState(false);
  const [recalling, setRecalling] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [sendingTutor, setSendingTutor] = useState(false);
  const [assessKind, setAssessKind] = useState<"explain" | "apply" | "connect">("explain");
  const [assessAnswer, setAssessAnswer] = useState("");
  const [recallGrade, setRecallGrade] = useState<"yes" | "partial" | "no">("yes");
  const [claimLevel, setClaimLevel] = useState<0 | 1>(1);
  const [claimNote, setClaimNote] = useState("");
  const [noteKind, setNoteKind] = useState<"note" | "idea" | "question">("note");
  const [noteBody, setNoteBody] = useState("");
  const [tutorMessage, setTutorMessage] = useState("");
  const [tutorThreadId, setTutorThreadId] = useState<string | null>(null);
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [tutorError, setTutorError] = useState<string | null>(null);

  if (error) {
    return (
      <div>
        <PageHeader eyebrow="Concept" title="Not found" />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (isLoading || !concept) {
    return (
      <div>
        <PageHeader eyebrow="Concept" title="Loading…" />
        <LoadingBlock rows={10} />
      </div>
    );
  }

  const meta = domainMeta(concept.domainSlug);
  const prompts = concept.prompts ?? { explain: "", apply: "", connect: "" };

  async function handleAssess(event: FormEvent) {
    event.preventDefault();
    if (!assessAnswer.trim()) return;
    setAssessing(true);
    setTutorError(null);
    try {
      const res = await api<import("@/lib/types").AssessmentResult>("/assessments", {
        method: "POST",
        body: JSON.stringify({
          conceptSlug: slug,
          kind: assessKind,
          answer: assessAnswer.trim(),
          idempotencyKey: idempotencyKey("assess"),
        }),
      });
      if (res.transition?.levelUp) Sonner.toast.success(`Level up! ${res.state?.level ?? 1}`);
      else if (res.transition?.levelDown) Sonner.toast.error(`Level down to ${res.state?.level ?? 0}`);
      else Sonner.toast("Assessment recorded.");
      invalidateEvidence(slug);
      setAssessAnswer("");
      await refetch();
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Assessment failed.");
    } finally {
      setAssessing(false);
    }
  }

  async function handleRecall(event: FormEvent) {
    event.preventDefault();
    setRecalling(true);
    try {
      await api("/recall", {
        method: "POST",
        body: JSON.stringify({
          conceptSlug: slug,
          grade: recallGrade,
          idempotencyKey: idempotencyKey("recall"),
        }),
      });
      Sonner.toast("Recall recorded.");
      invalidateEvidence(slug);
      await refetch();
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Recall failed.");
    } finally {
      setRecalling(false);
    }
  }

  async function handleClaim(event: FormEvent) {
    event.preventDefault();
    if (!claimNote.trim()) return;
    setClaiming(true);
    try {
      await api(`/concepts/${slug}/claim`, {
        method: "POST",
        body: JSON.stringify({ level: claimLevel, note: claimNote.trim() }),
      });
      Sonner.toast("Claim recorded (capped at L1, never unlocks prerequisites).");
      invalidateEvidence(slug);
      setClaimNote("");
      await refetch();
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Claim failed.");
    } finally {
      setClaiming(false);
    }
  }

  async function handleNote(event: FormEvent) {
    event.preventDefault();
    if (!noteBody.trim()) return;
    setSavingNote(true);
    try {
      await api("/notes", {
        method: "POST",
        body: JSON.stringify({ conceptSlug: slug, kind: noteKind, body: noteBody.trim() }),
      });
      Sonner.toast("Note saved.");
      invalidateNotes(slug);
      setNoteBody("");
      await refetch();
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Note failed.");
    } finally {
      setSavingNote(false);
    }
  }

  async function ensureThread() {
    if (tutorThreadId) return;
    setSendingTutor(true);
    try {
      const res = await api<{ thread: { id: string; messages: Array<{ role: string; content: string }> } }>("/tutor/threads", {
        method: "POST",
        body: JSON.stringify({ conceptSlug: slug, mode: "socratic" }),
      });
      setTutorThreadId(res.thread.id);
      setTutorMessages(res.thread.messages ?? []);
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Could not start tutor.");
    } finally {
      setSendingTutor(false);
    }
  }

  async function handleTutorMessage(event: FormEvent) {
    event.preventDefault();
    if (!tutorMessage.trim()) return;
    await ensureThread();
    if (!tutorThreadId) return;
    setSendingTutor(true);
    const userMsg = { role: "user", content: tutorMessage.trim() };
    setTutorMessages((prev) => [...prev, userMsg]);
    const msg = tutorMessage.trim();
    setTutorMessage("");
    try {
      const res = await api<{ message: { role: string; content: string } }>(`/tutor/threads/${tutorThreadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: msg, mode: "socratic" }),
      });
      setTutorMessages((prev) => [...prev, res.message]);
    } catch (cause) {
      setTutorError(cause instanceof Error ? cause.message : "Message failed.");
    } finally {
      setSendingTutor(false);
    }
  }

  const prereqState = concept.prerequisites.map((p) => {
    const level = concept.state?.level ?? 0;
    return { ...p, met: level >= 1 };
  });

  return (
    <div>
      <PageHeader
        eyebrow={meta.short}
        title={concept.term}
        description={concept.oneLiner}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/tutor" params={{ threadId: tutorThreadId ?? "" }}>
              <MessageSquare className="size-3.5" /> Tutor
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
            <span className="text-sm text-muted">{concept.domain}</span>
            <LevelPill level={concept.level} showName />
            <RetentionPill retention={concept.retention} />
            <StatusPill status={concept.status} />
            <Badge variant={concept.enrichmentStatus === "seed" ? "default" : "accent"}>
              {concept.enrichmentStatus}
            </Badge>
          </div>

          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5">
            <h3 className="text-sm font-medium">Definition</h3>
            <Markdown children={concept.mechanism ?? "*No mechanism recorded.*"} />
          </div>

          <section>
            <SectionTitle eyebrow="Evidence" title="Assessments" />
            <div className="space-y-3">
              {concept.reviews.length === 0 ? (
                <Callout tone="neutral" className="text-sm">
                  No assessments yet. Choose a kind below and write your answer without looking anything up.
                </Callout>
              ) : (
                <ul className="space-y-2">
                  {concept.reviews.slice(0, 5).map((review) => (
                    <li key={review.id} className="rounded-[var(--radius-sm)] border border-line p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{review.kind}</span>
                          <span className={cn("font-mono text-[10px]", review.passed ? "text-success" : "text-danger")}>
                            {review.passed ? "pass" : "fail"}
                          </span>
                          <span className="font-mono text-[10px] text-muted">{review.score}/{review.maxScore}</span>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] text-muted">{formatRelative(review.createdAt)}</span>
                      </div>
                      {review.feedback && <p className="mt-2 text-xs leading-relaxed text-muted">{review.feedback}</p>}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 rounded-[var(--radius-md)] border border-line bg-surface p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["explain", "apply", "connect"] as const).map((kind) => (
                    <Button
                      key={kind}
                      variant={assessKind === kind ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setAssessKind(kind)}
                    >
                      {kind.charAt(0).toUpperCase() + kind.slice(1)}
                    </Button>
                  ))}
                </div>
                <PromptBox label={`${assessKind} prompt`} prompt={prompts[assessKind]} onCopy={() => navigator.clipboard.writeText(prompts[assessKind])} />
                <form onSubmit={handleAssess} className="mt-3 space-y-2">
                  <Textarea
                    value={assessAnswer}
                    onChange={(e) => setAssessAnswer(e.target.value)}
                    placeholder={`Write your ${assessKind} answer here…`}
                    rows={6}
                    disabled={assessing}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">
                      {assessKind === "explain" && "8 points: accuracy, mechanism, clarity, example"}
                      {assessKind === "apply" && "7 points: setup, steps, licensing, domain check, result"}
                      {assessKind === "connect" && "6 points: concept named, link stated, consequence checkable, precision"}
                    </span>
                    <Button type="submit" disabled={assessing || assessAnswer.trim().length < 10}>
                      {assessing ? <Loader2 className="size-3.5 animate-spin" /> : "Submit assessment"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {concept.nextReviewAt && (
            <section>
              <SectionTitle eyebrow="Retention" title="Delayed recall" />
              <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Next recall scheduled</p>
                    <p className="mt-1 font-mono text-lg">{formatDate(concept.nextReviewAt)}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted">{formatRelative(concept.nextReviewAt)}</span>
                </div>
                <form onSubmit={handleRecall} className="mt-4 space-y-2">
                  <p className="text-sm leading-relaxed text-muted">
                    Without looking, can you state the definition, mechanism, and one example or failure mode?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["yes", "partial", "no"] as const).map((grade) => (
                      <Button
                        key={grade}
                        type="submit"
                        variant={recallGrade === grade ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setRecallGrade(grade)}
                      >
                        {grade.charAt(0).toUpperCase() + grade.slice(1)}
                      </Button>
                    ))}
                  </div>
                </form>
              </div>
            </section>
          )}

          <section>
            <SectionTitle eyebrow="Self-report" title="Claim a level" />
            <Callout tone="warning" className="text-sm">
              Claims are capped at L1 and never unlock prerequisites. Only graded evidence changes mastery.
            </Callout>
            <form onSubmit={handleClaim} className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant={claimLevel === 0 ? "primary" : "outline"} size="sm" onClick={() => setClaimLevel(0)}>
                  L0 — Unseen
                </Button>
                <Button type="button" variant={claimLevel === 1 ? "primary" : "outline"} size="sm" onClick={() => setClaimLevel(1)}>
                  L1 — Explain
                </Button>
              </div>
              <Textarea
                value={claimNote}
                onChange={(e) => setClaimNote(e.target.value)}
                placeholder="Why do you believe this level is appropriate? What evidence have you seen?"
                rows={3}
                disabled={claiming}
              />
              <Button type="submit" disabled={claiming || !claimNote.trim()}>
                {claiming ? <Loader2 className="size-3.5 animate-spin" /> : "Record claim"}
              </Button>
            </form>
          </section>

          <section>
            <SectionTitle eyebrow="Notes" title="Your annotations" action={<Button variant="ghost" size="sm" onClick={() => setActiveTab("notes")}><Plus className="size-3.5" /> Add note</Button>} />
            {concept.notes.length === 0 ? (
              <Callout tone="neutral" className="text-sm">No notes yet.</Callout>
            ) : (
              <ul className="space-y-2">
                {concept.notes.slice(0, 10).map((note) => (
                  <li key={note.id} className="rounded-[var(--radius-sm)] border border-line p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{note.kind}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted">{formatRelative(note.createdAt)}</span>
                    </div>
                    <Markdown children={note.body} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle eyebrow="Sources" title="Cited references" />
            <ul className="space-y-1">
              {concept.sources.length === 0 ? (
                <li className="text-sm text-muted">No sources recorded for this seed entry.</li>
              ) : (
                concept.sources.map((source, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-[10px] text-muted shrink-0">[{source.refNo}]</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section>
            <SectionTitle eyebrow="Graph neighbours" title="Prerequisites & related" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Prerequisites ({concept.prerequisites.length})</h4>
                {concept.prerequisites.length === 0 ? (
                  <p className="text-sm text-muted">None.</p>
                ) : (
                  <ul className="space-y-1">
                    {concept.prerequisites.map((p) => (
                      <li key={p.slug}>
                        <Link to="/concepts/$slug" params={{ slug: p.slug }} className="text-sm hover:text-accent">
                          {p.term} <span className="font-mono text-[10px] text-muted">(w {p.weight})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Related ({concept.related.length})</h4>
                {concept.related.length === 0 ? (
                  <p className="text-sm text-muted">None.</p>
                ) : (
                  <ul className="space-y-1">
                    {concept.related.map((r) => (
                      <li key={r.slug}>
                        <Link to="/concepts/$slug" params={{ slug: r.slug }} className="text-sm hover:text-accent">
                          {r.term} <span className="font-mono text-[10px] text-muted">(w {r.weight})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <h3 className="font-medium mb-3">Tutor</h3>
            <Callout tone="neutral" className="text-xs mb-3">
              The tutor receives the definition, assumptions, failure modes, graph neighbours, and sources. No API key? A
              deterministic fallback says so.
            </Callout>
            {tutorThreadId ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {tutorMessages.map((msg, index) => (
                  <div key={index} className={cn("text-sm leading-relaxed", msg.role === "user" ? "text-ink" : "text-muted")}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider">{msg.role === "user" ? "You" : "Tutor"}</span>
                    </div>
                    <Markdown children={msg.content} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Start a conversation below.</p>
            )}
            <form onSubmit={handleTutorMessage} className="mt-3 space-y-2">
              <Textarea
                value={tutorMessage}
                onChange={(e) => setTutorMessage(e.target.value)}
                placeholder="Ask a question, request an explanation, or start a quiz…"
                rows={3}
                disabled={sendingTutor}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={sendingTutor || !tutorMessage.trim()}>
                  {sendingTutor ? <Loader2 className="size-3.5 animate-spin" /> : "Send"}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => void navigate({ to: "/tutor", params: { threadId: tutorThreadId ?? "" } })}>
                  Open full chat
                </Button>
              </div>
              {tutorError && <p className="text-xs text-danger">{tutorError}</p>}
            </form>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <h3 className="font-medium mb-3">Your state</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Mastery level</dt><dd><LevelPill level={concept.level} showName /></dd></div>
              <div className="flex justify-between"><dt className="text-muted">Retention</dt><dd><RetentionPill retention={concept.retention} /></dd></div>
              <div className="flex justify-between"><dt className="text-muted">Status</dt><dd><StatusPill status={concept.status} /></dd></div>
              <div className="flex justify-between"><dt className="text-muted">Confidence</dt><dd className="font-mono">{concept.confidence}%</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Next review</dt><dd className="font-mono">{concept.nextReviewAt ? formatRelative(concept.nextReviewAt) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Last review</dt><dd className="font-mono">{concept.lastReviewAt ? formatRelative(concept.lastReviewAt) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Leveled up</dt><dd className="font-mono">{concept.leveledUpAt ? formatDate(concept.leveledUpAt) : "—"}</dd></div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <h3 className="font-medium mb-3">FSRS card</h3>
            {concept.state ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Stability</dt><dd className="font-mono">{concept.state.stability.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Difficulty</dt><dd className="font-mono">{concept.state.difficulty.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Reps</dt><dd className="font-mono">{concept.state.reps}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Lapses</dt><dd className="font-mono">{concept.state.lapses}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-muted">No card yet. Submit an assessment to initialize.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}