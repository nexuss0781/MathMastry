import { useState, type FormEvent, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Copy, Loader2, MessageSquare, MoreHorizontal, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { PageHeader, Callout, InlineLoader, SectionTitle } from "@/components/page";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useThread, invalidateEvidence } from "@/lib/queries";
import { api } from "@/lib/api";
import { cn, formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

const MODE_LABELS: Record<string, string> = {
  socratic: "Socratic",
  explain: "Explain",
  quiz: "Quiz",
  deep_dive: "Deep dive",
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  citations: string[];
  model: string | null;
  status: string;
  createdAt: string;
}

export function TutorChatPage() {
  const { threadId } = useParams({ from: "/tutor/$threadId" });
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useThread(threadId);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.thread?.messages]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setErrorMsg(null);
    setSending(true);
    const userMsg = message.trim();
    setMessage("");

    try {
      const res = await api<{ message: ChatMessage; threadId: string; mode: string }>(
        `/tutor/threads/${threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ message: userMsg, mode: data?.thread?.mode }),
        },
      );
      // Non-streaming fallback: message already includes assistant response
      if (res.message) {
        await refetch();
      }
    } catch (cause) {
      setErrorMsg(cause instanceof Error ? cause.message : "Message failed.");
    } finally {
      setSending(false);
    }
  }

  async function handleStream(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setErrorMsg(null);
    setStreaming(true);
    const userMsg = message.trim();
    setMessage("");
    setStreamBuffer("");

    try {
      const res = await api<{ message: ChatMessage; threadId: string; mode: string }>(
        `/tutor/threads/${threadId}/messages/stream`,
        {
          method: "POST",
          body: JSON.stringify({ message: userMsg, mode: data?.thread?.mode }),
        },
      );
      // SSE handled by the browser fetch response
      await refetch();
    } catch (cause) {
      setErrorMsg(cause instanceof Error ? cause.message : "Stream failed.");
    } finally {
      setStreaming(false);
    }
  }

  const thread = data?.thread;
  const messages = thread?.messages ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="shrink-0 border-b border-line bg-paper/85 backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/tutor" className="text-sm text-accent hover:underline">
              <MessageSquare className="size-4" /> Conversations
            </Link>
            <span className="text-line">/</span>
            <h1 className="truncate font-medium max-w-md">{thread?.title || "Conversation"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {thread && (
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted sm:inline-flex items-center gap-1">
                <span className="rounded-full border border-line px-2 py-0.5">{MODE_LABELS[thread.mode]}</span>
                {thread.conceptId && <span className="text-[10px]">concept</span>}
              </span>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tutor">
                <RotateCcw className="size-3.5" /> Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div className="border-b border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <Callout tone="neutral" className="text-center">
              <MessageSquare className="mx-auto size-8 text-muted" />
              <h3 className="mt-3">Start the conversation</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Ask a question, request an explanation, start a quiz, or request a deep dive. The tutor is grounded in the
                concept's definition, assumptions, failure modes, graph neighbours, and sources.
              </p>
            </Callout>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] uppercase tracking-wider",
                    msg.role === "user" ? "bg-ink text-paper" : "bg-accent/10 text-accent",
                  )}
                >
                  {msg.role === "user" ? "You" : "AI"}
                </div>
                <div className={cn("flex-1 min-w-0", msg.role === "user" ? "text-right" : "")}>
                  <div className={cn("prose-math", msg.role === "user" ? "text-ink" : "")}>
                    <Markdown children={msg.content} />
                  </div>
                  {msg.citations.length > 0 && (
                    <details className="mt-2">
                      <summary className="font-mono text-[10px] uppercase tracking-wider text-muted cursor-pointer">
                        Sources ({msg.citations.length})
                      </summary>
                      <ul className="mt-1 space-y-1">
                        {msg.citations.map((url, idx) => (
                          <li key={idx}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline-offset-2 hover:underline truncate max-w-xs">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                  <div className="mt-1 flex items-end justify-end gap-2">
                    <span className="font-mono text-[9px] text-muted">{formatRelative(msg.createdAt)}</span>
                    {msg.model && <span className="font-mono text-[9px] text-muted">{msg.model}</span>}
                    <Button variant="ghost" size="icon" className="text-[10px]" onClick={() => navigator.clipboard.writeText(msg.content)}>
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}

          {streaming && streamBuffer && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] uppercase tracking-wider text-accent">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <Markdown children={streamBuffer} />
                <span className="inline-block animate-pulse text-accent">▌</span>
              </div>
            </div>
          )}

          {sending && !streaming && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] uppercase tracking-wider text-accent">
                AI
              </div>
              <div className="flex-1">
                <InlineLoader label="Thinking…" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="shrink-0 border-t border-line bg-paper/85 backdrop-blur p-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleStream} className="space-y-2">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question, request an explanation, start a quiz…"
                rows={2}
                disabled={sending || streaming}
                className="flex-1"
              />
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button type="submit" size="sm" disabled={sending || streaming || !message.trim()}>
                  {streaming ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleSend} disabled={sending || streaming || !message.trim()}>
                  Send (no stream)
                </Button>
              </div>
            </div>
            {thread && (
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted">
                <span className="rounded-full border border-line px-1.5 py-0.5">{MODE_LABELS[thread.mode]}</span>
                <span>Grounded in definition, assumptions, failure modes, neighbours, sources. Fixture mode = deterministic heuristic.</span>
              </p>
            )}
          </form>
        </div>
      </footer>
    </div>
  );
}