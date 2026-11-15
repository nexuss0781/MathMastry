import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, MapPin, User } from "lucide-react";
import { authClient } from "@/lib/auth";
import { queryClient } from "@/lib/query";
import { api } from "@/lib/api";
import { useConfig } from "@/lib/queries";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Callout, ErrorState } from "@/components/page";
import { cn } from "@/lib/utils";

const TIMEZONES = Intl.supportedValuesOf("timeZone").sort();

export function WelcomePage() {
  const { data: config } = useConfig();
  const navigate = useNavigate();
  const [step, setStep] = useState<"profile" | "goal" | "done">("profile");
  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [weeklyMinutes, setWeeklyMinutes] = useState(300);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleProfile(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!displayName.trim()) {
      setError("Enter your name.");
      return;
    }
    setPending(true);
    try {
      const res = await api("/me", {
        method: "PATCH",
        body: JSON.stringify({ displayName: displayName.trim(), timezone, weeklyMinutes }),
      });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setStep("goal");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save profile.");
    } finally {
      setPending(false);
    }
  }

  async function handleGoal(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (goal.trim()) {
        await api("/me", {
          method: "PATCH",
          body: JSON.stringify({ goal: goal.trim() }),
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setStep("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save goal.");
    } finally {
      setPending(false);
    }
  }

  if (step === "done") {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <span className="font-display text-3xl text-accent">✓</span>
          </div>
          <h1 className="text-3xl font-display">You're set.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your timezone, weekly budget, and starting goal are saved. The planner can now turn that goal into a sequenced
            curriculum. Your streak begins with your first piece of evidence.
          </p>
          <Button size="lg" className="mt-6 w-full" asChild>
            <Link to="/dashboard">
              Open the dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-4 text-xs text-muted">
            You can adjust anything later in <Link to="/settings" className="text-accent underline">Settings</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Brand />
        </div>
      </header>

      <main className="container-page py-10 lg:py-16">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5">
              <User className="size-4 text-muted" />
            </div>
            <div>
              <p className="eyebrow">Step {step === "profile" ? 1 : 2} of 2</p>
              <h1 className="mt-1 text-3xl">
                {step === "profile" ? "Tell us about yourself." : "What do you want to master?"}
              </h1>
            </div>
          </div>

          {error ? <ErrorState error={error} /> : null}

          {step === "profile" ? (
            <form className="space-y-5" onSubmit={handleProfile}>
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ada Lovelace"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex h-10 w-full rounded-[var(--radius-sm)] border border-line bg-paper px-3 py-2 text-sm text-ink"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted">Review days and curriculum weeks use this timezone.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="weeklyMinutes">Weekly study budget (minutes)</Label>
                <Input
                  id="weeklyMinutes"
                  type="number"
                  min={30}
                  max={3000}
                  step={15}
                  required
                  value={weeklyMinutes}
                  onChange={(e) => setWeeklyMinutes(Math.max(30, Math.min(3000, parseInt(e.target.value) || 300)))}
                />
                <p className="text-[10px] text-muted">
                  The planner fits curriculum items into this budget. Adjust anytime in Settings.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Saving…" : "Continue"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleGoal}>
              <div className="space-y-1.5">
                <Label htmlFor="goal">Goal (plain language)</Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., measure theory and integration, representation theory of finite groups, stochastic calculus"
                  rows={3}
                />
                <p className="text-[10px] text-muted">
                  The planner matches this to atlas concepts, walks prerequisites, and budgets the work across weeks.
                </p>
              </div>

              {config && (
                <Callout tone="neutral" className="text-xs">
                  The atlas has {config.totalConcepts} concepts across {config.domains} domains. No key? The AI falls back to a deterministic
                  heuristic and discloses it.
                </Callout>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={pending}>
                  {pending ? "Creating plan…" : "Build curriculum"}
                  <ArrowRight className="size-4" />
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => void navigate({ to: "/dashboard" })}>
                  Skip for now
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}