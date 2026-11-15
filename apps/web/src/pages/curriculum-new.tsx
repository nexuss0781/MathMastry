import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Compass, Loader2 } from "lucide-react";
import { PageHeader, Callout, ErrorState } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { invalidateEvidence } from "@/lib/actions";
import { cn } from "@/lib/utils";
import * as Sonner from "sonner";

export function CurriculumNewPage() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [weeklyMinutes, setWeeklyMinutes] = useState(300);
  const [horizonWeeks, setHorizonWeeks] = useState(8);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!goal.trim()) {
      setError("Describe your goal.");
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
      void navigate({ to: "/curriculum/$id", params: { id: res.curriculum.id } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create curriculum.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Curriculum"
        title="Build a new plan"
        description="State what you want to understand. The planner matches atlas concepts, walks prerequisites backwards, and budgets the work against your week."
        actions={
          <Button variant="outline" asChild>
            <Link to="/curriculum">All curricula</Link>
          </Button>
        }
      />

      {error ? <ErrorState error={error} onRetry={() => setError(null)} /> : null}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="goal">Goal (plain language)</Label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., measure theory and integration, representation theory of finite groups, stochastic calculus"
            rows={3}
            required
          />
          <p className="text-[10px] text-muted">
            The planner matches this to atlas concepts, walks their prerequisites, and lays out a weekly schedule.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="weeklyMinutes">Weekly budget (minutes)</Label>
            <Input
              id="weeklyMinutes"
              type="number"
              min={30}
              max={3000}
              step={15}
              value={weeklyMinutes}
              onChange={(e) => setWeeklyMinutes(Math.max(30, Math.min(3000, parseInt(e.target.value) || 300)))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="horizonWeeks">Planning horizon (weeks)</Label>
            <Input
              id="horizonWeeks"
              type="number"
              min={1}
              max={104}
              value={horizonWeeks}
              onChange={(e) => setHorizonWeeks(Math.max(1, Math.min(104, parseInt(e.target.value) || 8)))}
              required
            />
          </div>
        </div>

        <Callout tone="neutral" className="text-sm">
          Goal matching is deliberately conservative. Generic tokens like "theory" and "mathematical" are stripped. A
          concept must share a specific term token or at least two definition tokens to be eligible.
        </Callout>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={creating}>
            {creating ? <Loader2 className="size-3.5 animate-spin" /> : "Build curriculum"}
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link to="/curriculum">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}