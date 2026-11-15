import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Loader2, MessageSquare, Plus, Trash2, X } from "lucide-react";
import { PageHeader, Callout, LoadingBlock, ErrorState, SectionTitle } from "@/components/page";
import { LevelPill } from "@/components/level";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useThreads, invalidateEvidence } from "@/lib/queries";
import { api } from "@/lib/api";
import { cn, formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

const MODE_LABELS: Record<string, string> = {
  socratic: "Socratic",
  explain: "Explain",
  quiz: "Quiz",
  deep_dive: "Deep dive",
};

export function TutorListPage() {
  const { data, isLoading, error, refetch } = useThreads();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [conceptSlug, setConceptSlug] = useState("");
  const [mode, setMode] = useState<"socratic" | "explain" | "quiz" | "deep_dive">("socratic");
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setErrorMsg(null);
    setCreating(true);
    try {
      const res = await api<{ thread: { id: string } }>("/tutor/threads", {
        method: "POST",
        body: JSON.stringify({ conceptSlug: conceptSlug.trim() || undefined, mode, title: title.trim() || undefined }),
      });
      Sonner.toast("Thread created.");
      invalidateEvidence();
      void navigate({ to: "/tutor/$threadId", params: { threadId: res.thread.id } });
    } catch (cause) {
      setErrorMsg(cause instanceof Error ? cause.message : "Could not create thread.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    setDeleting(id);
    try {
      await api(`/tutor/threads/${id}`, { method: "DELETE" });
      Sonner.toast("Thread deleted.");
      await refetch();
    } catch (cause) {
      Sonner.toast.error(cause instanceof Error ? cause.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <div>
      <PageHeader
        eyebrow="Tutor"
        title="Conversations"
        description="Each thread is grounded in an atlas concept (or none). The tutor receives the definition, assumptions, failure modes, neighbours, and sources."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> New thread
          </Button>
        }
      />

      {isLoading ? (
        <LoadingBlock rows={6} />
      ) : data?.threads.length === 0 ? (
        <EmptyState
          eyebrow="No conversations yet"
          title="Start a thread"
          description="Pick a concept and a mode — Socratic, Explain, Quiz, or Deep dive. The tutor will use the sourced definition, assumptions, failure modes, and graph neighbours."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-3.5" /> Create thread
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line/70">
          {data!.threads.map((thread) => (
            <li key={thread.id} className="py-3">
              <Link
                to="/tutor/$threadId"
                params={{ threadId: thread.id }}
                className="group grid grid-cols-[1fr_auto] items-start gap-4 px-1 py-2 hover:bg-ink/[0.025] rounded-[var(--radius-sm)]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-medium truncate">{thread.title || "Untitled"}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{MODE_LABELS[thread.mode]}</span>
                    {thread.conceptId && (
                      <span className="font-mono text-[10px] text-muted">concept</span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-muted">Updated {formatRelative(thread.updatedAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(thread.id, e)} disabled={deleting === thread.id} className="text-muted hover:text-danger">
                    {deleting === thread.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-4" />}
                  </Button>
                  <ArrowUpRight className="size-5 shrink-0 text-muted group-hover:text-accent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}