import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, Home, Search } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/page";
import { cn } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <Brand className="mb-8" />
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ink/5 mx-auto">
          <span className="font-display text-4xl text-muted">404</span>
        </div>
        <h1 className="text-3xl font-display">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The path you requested doesn't exist. It may have been moved, or the link was mistyped.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild>
            <Link to="/dashboard"><Home className="size-4" /> Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/atlas"><BookOpen className="size-4" /> Atlas</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/curriculum"><Compass className="size-4" /> Curriculum</Link>
          </Button>
        </div>
        <Callout tone="neutral" className="mt-6 text-xs">
          <Search className="size-3.5 inline" /> Press <kbd className="font-mono px-1.5 py-0.5 rounded border border-line">⌘K</kbd> to search the atlas from anywhere.
        </Callout>
      </div>
    </div>
  );
}