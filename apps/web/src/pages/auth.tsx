import { useState, type ReactNode } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { KeyRound, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth";
import { useConfig } from "@/lib/queries";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/page";

function safeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.73.13-1.44.37-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
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

function GoogleAuth({ mode }: { mode: "login" | "signup" }) {
  const { data: config, isLoading } = useConfig();
  const search = useSearch({ strict: false }) as { redirect?: string; error?: string };
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";
  const target = isSignup ? "/welcome" : safeRedirect(search.redirect);
  const callbackURL = `${window.location.origin}${target}`;
  const configured = config?.googleEnabled === true;
  const visibleError =
    error ??
    (search.error ? "Google sign-in could not be completed. Please try again." : null);

  async function handleGoogle() {
    setError(null);
    setPending(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: `${window.location.origin}/welcome`,
        errorCallbackURL: `${window.location.origin}${isSignup ? "/signup" : "/login"}`,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start Google sign-in.");
      setPending(false);
    }
  }

  return (
    <AuthFrame>
      <div>
        <p className="eyebrow">{isSignup ? "Create your record" : "Welcome back"}</p>
        <h1 className="mt-2 text-3xl">{isSignup ? "Start with Google." : "Continue with Google."}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {isSignup
            ? "Your Google account verifies your email and creates your record. No password, no placement quiz."
            : "One click verifies your email and restores your record. No password to remember."}
        </p>
      </div>

      {visibleError ? (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger" role="alert">
          {visibleError}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => void handleGoogle()}
        disabled={pending || !configured}
        className="mt-6 w-full border-[#dadce0] bg-white text-[#1f1f1f] hover:bg-[#f8f9fa] disabled:bg-white [&_svg]:size-5"
      >
        <GoogleIcon />
        {pending ? "Opening Google…" : isLoading ? "Checking sign-in…" : "Continue with Google"}
      </Button>

      {!isLoading && !configured ? (
        <Callout tone="warning" title="Google sign-in is not configured" className="mt-4">
          Add <code className="font-mono text-[0.9em]">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="font-mono text-[0.9em]">GOOGLE_CLIENT_SECRET</code> to the deployment
          secrets, then reload this page.
        </Callout>
      ) : null}

      <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
        MathMastery only receives your name, email address, and profile image from Google.
      </p>

      <p className="mt-6 text-center text-xs text-muted">
        {isSignup ? (
          <>
            Already have a record?{" "}
            <Link to="/login" className="text-accent underline underline-offset-4">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link to="/signup" className="text-accent underline underline-offset-4">
              Create your record
            </Link>
          </>
        )}
      </p>

      {isSignup ? (
        <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
          By creating an account you agree to use the atlas honestly: self-reports are claims, not evidence.
        </p>
      ) : null}
    </AuthFrame>
  );
}

export function LoginPage() {
  return <GoogleAuth mode="login" />;
}

export function SignupPage() {
  return <GoogleAuth mode="signup" />;
}
