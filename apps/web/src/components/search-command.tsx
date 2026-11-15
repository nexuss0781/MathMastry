import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CornerDownLeft, Loader2, Search } from "lucide-react";
import { useSearch } from "@/lib/queries";
import { LevelPill } from "@/components/level";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "Today", to: "/dashboard" },
  { label: "Atlas", to: "/atlas" },
  { label: "Review queue", to: "/review" },
  { label: "Curriculum", to: "/curriculum" },
  { label: "Tutor", to: "/tutor" },
  { label: "Progress", to: "/progress" },
] as const;

export function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data, isFetching } = useSearch(query, open);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const items = data?.items ?? [];
  const goConcept = (slug: string) => {
    onClose();
    void navigate({ to: "/concepts/$slug", params: { slug } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/35 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="size-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && items[0]) goConcept(items[0].slug);
            }}
            placeholder="Search 429 concepts, definitions, ideas…"
            className="h-7 w-full bg-transparent text-[15px] outline-none placeholder:text-muted/70"
          />
          {isFetching ? <Loader2 className="size-4 animate-spin text-muted" /> : null}
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">esc</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <div className="p-2">
              <p className="eyebrow px-2 pb-2">Jump to</p>
              <div className="grid grid-cols-2 gap-1">
                {QUICK_LINKS.map((link) => (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => {
                      onClose();
                      void navigate({ to: link.to });
                    }}
                    className="flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm hover:bg-ink/5"
                  >
                    {link.label}
                    <ArrowRight className="size-3.5 text-muted" />
                  </button>
                ))}
              </div>
              <p className="mt-3 px-2 text-xs leading-relaxed text-muted">
                Search runs against definitions as well as titles, and blends a local embedding with exact matches. No
                model call is used.
              </p>
            </div>
          ) : items.length === 0 && !isFetching ? (
            <div className="px-4 py-10 text-center">
              <BookOpen className="mx-auto size-6 text-muted" />
              <p className="mt-3 text-sm font-medium">No concept matched “{query.trim()}”.</p>
              <p className="mt-1 text-xs text-muted">Try a broader term, or browse the atlas by domain.</p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => goConcept(item.slug)}
                    className="group flex w-full items-start gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-left hover:bg-ink/5"
                  >
                    <span className="mt-0.5 font-mono text-[10px] text-muted">{item.domainSlug.slice(0, 2).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">{item.term}</span>
                        <LevelPill level={item.level} />
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-xs text-muted">{item.oneLiner}</span>
                    </span>
                    <CornerDownLeft className="mt-1 size-3.5 shrink-0 text-muted opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={cn("flex items-center justify-between border-t border-line px-4 py-2 text-[10px] text-muted")}>
          <span className="font-mono">{items.length > 0 ? `${items.length} results` : "Atlas search"}</span>
          <span>Enter opens the first result</span>
        </div>
      </div>
    </div>
  );
}
