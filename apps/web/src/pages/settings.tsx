import { useState, type FormEvent } from "react";
import { Clock, Globe, Loader2, Moon, Palette, Shield, Sparkles, Sun, User } from "lucide-react";
import { PageHeader, SectionTitle, Callout, ErrorState } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/api";
import { invalidateEvidence } from "@/lib/actions";
import { useConfig, useMe } from "@/lib/queries";
import { useTheme } from "@/lib/theme";
import { formatRelative } from "@/lib/utils";
import * as Sonner from "sonner";

const TIMEZONES = Intl.supportedValuesOf("timeZone").sort();

export function SettingsPage() {
  const { data: me } = useMe();
  const { data: config } = useConfig();
  const { theme, toggle } = useTheme();
  const profile = me?.profile;
  const user = me?.user;

  const [saving, setSaving] = useState<"profile" | "account" | null>(null);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [timezone, setTimezone] = useState(profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [weeklyMinutes, setWeeklyMinutes] = useState(profile?.weeklyMinutes ?? 300);
  const [goal, setGoal] = useState(profile?.goal ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleProfile(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving("profile");
    try {
      await api("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          displayName: displayName.trim(),
          timezone,
          weeklyMinutes,
          goal: goal.trim() || undefined,
        }),
      });
      Sonner.toast("Profile saved.");
      invalidateEvidence();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save profile.");
    } finally {
      setSaving(null);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Delete your account? This cannot be undone. All your progress, curricula, and tutor threads will be permanently removed.")) return;
    if (!confirm("Are you absolutely sure?")) return;
    setSaving("account");
    try {
      await authClient.deleteUser();
      Sonner.toast("Account deleted.");
      window.location.assign("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete account.");
      setSaving(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account, appearance, and data"
        description="Your progress is stored locally in Postgres. Export anytime from the Progress page."
      />

      <section className="mb-10">
        <SectionTitle eyebrow="Profile" title="Identity & planner settings" icon={<User className="size-4" />} />
        {error && <ErrorState error={error} onRetry={() => setError(null)} />}
        <form onSubmit={handleProfile} className="space-y-5 max-w-xl">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="flex h-10 w-full rounded-[var(--radius-sm)] border border-line bg-paper px-3 py-2 text-sm text-ink">
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
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
              value={weeklyMinutes}
              onChange={(e) => setWeeklyMinutes(Math.max(30, Math.min(3000, parseInt(e.target.value) || 300)))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goal">Current goal</Label>
            <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., measure theory and integration" />
            <p className="text-[10px] text-muted">The active curriculum shows progress toward this goal.</p>
          </div>
          <Button type="submit" disabled={saving === "profile"}>
            {saving === "profile" ? <Loader2 className="size-3.5 animate-spin" /> : "Save profile"}
          </Button>
        </form>
      </section>

      <section className="mb-10">
        <SectionTitle eyebrow="Security" title="Sign-in & sessions" icon={<Shield className="size-4" />} />
        <div className="max-w-xl rounded-[var(--radius-md)] border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Sign-in method</p>
              <p className="text-sm text-muted">
                Google account{user?.email ? ` · ${user.email}` : ""}. Passwords are never stored by MathMastery.
              </p>
            </div>
            <Badge variant={user?.emailVerified ? "success" : "warning"}>
              {user?.emailVerified ? "Google verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-line p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign out everywhere</p>
              <p className="text-sm text-muted">Revokes all sessions except this one.</p>
            </div>
            <Button variant="outline" onClick={() => authClient.signOut()}>Sign out everywhere</Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle eyebrow="Appearance" title="Theme" icon={<Palette className="size-4" />} />
        <div className="flex items-center gap-4">
          <Button variant={theme === "light" ? "primary" : "outline"} onClick={() => toggle()} className="flex items-center gap-2">
            <Sun className="size-4" /> Light
          </Button>
          <Button variant={theme === "dark" ? "primary" : "outline"} onClick={() => toggle()} className="flex items-center gap-2">
            <Moon className="size-4" /> Dark
          </Button>
          <Badge variant="ink" className="ml-auto">
            System: {theme === "dark" ? "dark" : "light"}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted">Preference stored locally. No server round-trip.</p>
      </section>

      <section className="mb-10">
        <SectionTitle eyebrow="AI" title="Provider & quotas" icon={<Sparkles className="size-4" />} />
        <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Provider</p>
              <p className="text-sm text-muted">{config?.aiMode === "fixture" ? "Deterministic fixture (no API key)" : "OpenAI"}</p>
            </div>
            <Badge variant={config?.aiMode === "fixture" ? "warning" : "success"}>{config?.aiMode}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily messages</p>
              <p className="text-sm text-muted">Resets at midnight in your timezone.</p>
            </div>
            <Badge variant="accent">{config?.dailyMessages ?? 40}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily assessments</p>
              <p className="text-sm text-muted">Graded explain/apply/connect submissions.</p>
            </div>
            <Badge variant="accent">{config?.dailyAssessments ?? 20}</Badge>
          </div>
          <Callout tone="neutral" className="text-sm">
            Fixture mode uses a deterministic heuristic grader (confidence 0.5). It says so on every response. Set
            <code className="rounded bg-ink/[0.06] px-1 py-0.5 font-mono text-[10px]">AI_PROVIDER=openai</code> and
            <code className="rounded bg-ink/[0.06] px-1 py-0.5 font-mono text-[10px]">OPENAI_API_KEY</code> to enable model grading.
          </Callout>
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle eyebrow="Data" title="Export & deletion" icon={<Globe className="size-4" />} />
        <div className="space-y-4">
          <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export progress</p>
                <p className="text-sm text-muted">JSON, Markdown, or Anki TSV from the Progress page.</p>
              </div>
              <Button asChild variant="outline">
                <a href="/api/export?format=json" download>Download JSON</a>
              </Button>
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-dashed border-danger/30 bg-danger/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-danger">Delete account</p>
                <p className="text-sm text-muted">Permanently removes all your data. Cannot be undone.</p>
              </div>
              <Button variant="danger" onClick={handleDeleteAccount} disabled={saving === "account"}>
                {saving === "account" ? <Loader2 className="size-3.5 animate-spin" /> : "Delete account"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Session" title="Current login" icon={<Clock className="size-4" />} />
        <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5 space-y-3">
          {user && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 font-mono text-sm font-medium text-accent">
                    {user.name?.split(/\s+/).map((p) => p[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">User ID</p>
                  <p className="font-mono text-xs break-all">{user.id}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Joined</p>
                  <p className="font-mono text-xs">{formatRelative(user.createdAt)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}