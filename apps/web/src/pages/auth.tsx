import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GitBranch, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { useConfig } from "@/lib/queries";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Callout } from "@/components/page";
import { cn } from "@/lib/utils";

function safeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1fr_0.85fr]">
      <div className="flex min-h-dvh flex-col px-5 py-6 sm:px-10">
        <Brand />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-[10px] leading-relaxed text-muted">
          Evidence-first by design. Self-report never unlocks mastery.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:block">
        <svg viewBox="0 0 600 900" className="absolute inset-0 size-full" aria-hidden="true">
          <g stroke="var(--paper)" strokeOpacity="0.08">
            {Array.from({ length: 14 }, (_, index) => (
              <circle key={index} cx="470" cy="330" r={40 + index * 34} fill="none" />
            ))}
            <line x1="0" y1="660" x2="600" y2="250" />
            <line x1="0" y1="760" x2="600" y2="350" />
            <line x1="60" y1="900" x2="600" y2="480" />
          </g>
          {[
            [470, 330, 5],
            [310, 520, 3],
            [610, 210, 3],
            [390, 260, 2],
            [550, 520, 2],
            [250, 650, 2],
          ].map(([x, y, r], index) => (
            <circle key={index} cx={x} cy={y} r={r} fill="var(--accent)" fillOpacity={index === 0 ? 0.9 : 0.45} />
          ))}
          <text x="60" y="820" fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="2" fill="var(--paper)" fillOpacity="0.35">
            429 · 12 · 4
          </text>
        </svg>

        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="eyebrow text-paper/40">The premise</p>
          <blockquote className="mt-4 max-w-md font-display text-4xl leading-[1.08] tracking-[-0.03em] text-paper">
            “A definition you can repeat is not a concept you can use.”
          </blockquote>
          <div className="mt-8 space-y-3 border-t border-paper/15 pt-6 text-xs leading-relaxed text-paper/60">
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" />
              Every level is tied to a published rubric, not a confidence score.
            </p>
            <p className="flex items-start gap-2">
              <KeyRound className="mt-0.5 size-3.5 shrink-0 text-accent" />
              Your progress is yours: one-click JSON, Markdown, and Anki exports.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function GitHubButton({ callbackURL }: { callbackURL: string }) {
  const { data: config } = useConfig();
  if (!config?.githubEnabled) return null;
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => void authClient.signIn.social({ provider: "github", callbackURL })}
    >
      <GitBranch className="size-4" />
      Continue with GitHub
    </Button>
  );
}

export function LoginPage({ redirect }: { redirect?: string }) {
  const { data: config } = useConfig();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"password" | "otp" | "send" | null>(null);
  const target = safeRedirect(redirect);
  const [sentTo, setSentTo] = useState("");

  async function afterAuth() {
    await queryClient.invalidateQueries();
    window.location.assign(target);
  }

  async function handlePassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending("password");
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message ?? "Could not sign in.");
        return;
      }
      await afterAuth();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setPending(null);
    }
  }

  async function sendOtp(event?: FormEvent) {
    event?.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setPending("send");
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" });
      if (result.error) {
        setError(result.error.message ?? "Could not send the code.");
        return;
      }
      setOtpSent(true);
      setSentTo(email.trim());
      setDevOtp(null);
      if (config?.devAuth) {
        try {
          const local = await api<{ otp: string | null }>(`/dev/otp?email=${encodeURIComponent(email.trim())}`);
          setDevOtp(local.otp);
        } catch {
          /* the code is still in the server log */
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the code.");
    } finally {
      setPending(null);
    }
  }

  async function handleOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending("otp");
    try {
      const result = await authClient.signIn.emailOtp({ email: email.trim(), otp: otp.trim() });
      if (result.error) {
        setError(result.error.message ?? "That code was not accepted.");
        return;
      }
      await afterAuth();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not verify the code.");
    } finally {
      setPending(null);
    }
  }

  return (
    <AuthFrame>
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-2 text-3xl">Sign in to your record.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Levels, retention, curriculum, and tutor threads are tied to your account.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-[var(--radius-sm)] border border-line p-1">
        {(["password", "otp"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setMode(option);
              setError(null);
            }}
            className={cn(
              "rounded-[5px] px-3 py-1.5 text-xs transition-colors",
              mode === option ? "bg-ink text-paper" : "text-muted hover:text-ink",
            )}
          >
            {option === "password" ? "Password" : "Email code"}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {mode === "password" ? (
        <form className="mt-5 space-y-3" onSubmit={handlePassword}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending === "password"}>
            {pending === "password" ? "Signing in…" : "Sign in"}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      ) : (
        <form className="mt-5 space-y-3" onSubmit={otpSent ? handleOtp : sendOtp}>
          <div className="space-y-1.5">
            <Label htmlFor="otp-email">Email</Label>
            <Input
              id="otp-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {otpSent ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="otp">Six-digit code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="font-mono text-lg tracking-[0.3em]"
                />
              </div>
              {devOtp ? (
                <Callout tone="warning" title="Local development">
                  Email delivery is not configured, so the code is shown here and in the server log.{" "}
                  <strong className="font-mono">{devOtp}</strong> — sent to {sentTo}.
                </Callout>
              ) : (
                <p className="text-[11px] text-muted">
                  Code sent to {sentTo}. In local development it is also written to the API log.
                </p>
              )}
              <Button type="submit" className="w-full" disabled={pending === "otp" || otp.length < 6}>
                {pending === "otp" ? "Verifying…" : "Verify and sign in"}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => void sendOtp()}
                disabled={pending === "send"}
              >
                <Mail className="size-3.5" />
                {pending === "send" ? "Sending…" : "Send a new code"}
              </Button>
            </>
          ) : (
            <Button type="submit" className="w-full" disabled={pending === "send"}>
              <Mail className="size-4" />
              {pending === "send" ? "Sending…" : "Email me a sign-in code"}
            </Button>
          )}
        </form>
      )}

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <GitHubButton callbackURL={`${typeof window !== "undefined" ? window.location.origin : ""}${target}`} />

      <p className="mt-6 text-center text-xs text-muted">
        New here?{" "}
        <Link to="/signup" className="text-accent underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}

export function SignupPage() {
  const { data: config } = useConfig();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 10) {
      setError("Use at least 10 characters. Length beats clever substitutions.");
      return;
    }
    setPending(true);
    try {
      const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
      if (result.error) {
        setError(result.error.message ?? "Could not create the account.");
        return;
      }
      await queryClient.invalidateQueries();
      window.location.assign("/welcome");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame>
      <div>
        <p className="eyebrow">Create your record</p>
        <h1 className="mt-2 text-3xl">Start with the atlas.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No credit card, no placement quiz. You begin at L0 and earn levels with evidence.
        </p>
      </div>

      {error ? (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ada Lovelace"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 10 characters"
          />
          <p className="text-[10px] text-muted">Ten characters minimum. A passphrase is better than a puzzle.</p>
        </div>
        <Button type="submit" className="w-full" disabled={pending || config?.passwordEnabled === false}>
          {pending ? "Creating…" : "Create account"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <GitHubButton callbackURL={`${typeof window !== "undefined" ? window.location.origin : ""}/welcome`} />

      <p className="mt-6 text-center text-xs text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-accent underline underline-offset-4">
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
        By creating an account you agree to use the atlas honestly: self-reports are claims, not evidence.
      </p>
    </AuthFrame>
  );
}
