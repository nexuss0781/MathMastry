import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Braces, GitBranch, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { Brand, BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/page";
import { useMe, usePublicAtlas } from "@/lib/queries";
import { domainMeta } from "@/lib/domains";
import { cn } from "@/lib/utils";

const LEVELS = [
  {
    level: "L1",
    name: "Explain",
    description: "State the object, its mechanism, and one checked example in your own words.",
    evidence: "Explain assessment · 8-point rubric",
  },
  {
    level: "L2",
    name: "Apply",
    description: "Use it on a concrete case, show each licensed step, and name where the method stops.",
    evidence: "Apply assessment · 7-point rubric",
  },
  {
    level: "L3",
    name: "Connect",
    description: "Name a structural link to another concept and a consequence that could be checked.",
    evidence: "Connect assessment · 6-point rubric",
  },
];

const DOMAIN_SAMPLES = [
  "Formal language",
  "Category",
  "Field",
  "Manifold",
  "Homology",
  "Measure space",
  "Graph minor",
  "Martingale",
  "Condition number",
  "Duality",
  "Attractor",
  "Noether's theorem",
];

function AtlasGraphic({
  domains,
}: {
  domains: Array<{ slug: string; name: string; count: number }>;
}) {
  const size = 560;
  const center = size / 2;
  const ring = 148;
  const list = domains.length > 0
    ? domains
    : DOMAIN_SAMPLES.map((name, index) => ({ slug: `sample-${index}`, name, count: 24 + index * 3 }));

  const hubs = list.map((domain, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / list.length;
    return {
      ...domain,
      angle,
      x: center + Math.cos(angle) * ring,
      y: center + Math.sin(angle) * ring,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="The MathMastery atlas: 12 domains linked by prerequisites">
      <defs>
        <radialGradient id="atlas-glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={size} height={size} fill="url(#atlas-glow)" />
      <circle cx={center} cy={center} r={ring + 62} fill="none" stroke="var(--line)" strokeDasharray="1 7" />
      <circle cx={center} cy={center} r={ring - 52} fill="none" stroke="var(--line)" strokeOpacity="0.6" />
      <circle cx={center} cy={center} r={ring} fill="none" stroke="var(--line)" strokeOpacity="0.4" />

      {hubs.map((hub) => {
        const meta = domainMeta(hub.slug);
        const satelliteCount = Math.min(13, Math.max(3, Math.round(hub.count / 4)));
        return (
          <g key={hub.slug}>
            <line
              x1={center}
              y1={center}
              x2={hub.x}
              y2={hub.y}
              stroke={meta.color}
              strokeOpacity="0.22"
              strokeWidth="0.8"
            />
            {Array.from({ length: satelliteCount }, (_, index) => {
              const spread = (index - (satelliteCount - 1) / 2) * 0.105;
              const orbit = 17 + ((index * 7) % 17);
              const x = hub.x + Math.cos(hub.angle + spread) * orbit;
              const y = hub.y + Math.sin(hub.angle + spread) * orbit;
              return (
                <g key={index}>
                  <line x1={hub.x} y1={hub.y} x2={x} y2={y} stroke={meta.color} strokeOpacity="0.16" strokeWidth="0.6" />
                  <circle cx={x} cy={y} r={1.9} fill={meta.color} fillOpacity={0.55} />
                </g>
              );
            })}
            <circle cx={hub.x} cy={hub.y} r={4.2} fill={meta.color} />
            <circle cx={hub.x} cy={hub.y} r={8} fill="none" stroke={meta.color} strokeOpacity="0.25" />
            <text
              x={hub.x + Math.cos(hub.angle) * 24}
              y={hub.y + Math.sin(hub.angle) * 24}
              textAnchor={hub.x > center + 8 ? "start" : hub.x < center - 8 ? "end" : "middle"}
              dominantBaseline="middle"
              fontSize="7.6"
              fontFamily="Geist Mono, monospace"
              fill="var(--ink)"
              fontWeight="500"
            >
              {meta.short.length > 20 ? `${meta.short.slice(0, 19)}…` : meta.short}
            </text>
            <text
              x={hub.x + Math.cos(hub.angle) * 24}
              y={hub.y + Math.sin(hub.angle) * 24 + 9}
              textAnchor={hub.x > center + 8 ? "start" : hub.x < center - 8 ? "end" : "middle"}
              dominantBaseline="middle"
              fontSize="6.3"
              fontFamily="Geist Mono, monospace"
              fill="var(--muted)"
            >
              {hub.count} concepts
            </text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r={46} fill="var(--ink)" />
      <text x={center} y={center - 7} textAnchor="middle" fontSize="20" fontFamily="Fraunces, Georgia, serif" fill="var(--paper)">
        {list.reduce((sum, domain) => sum + domain.count, 0) || 429}
      </text>
      <text
        x={center}
        y={center + 10}
        textAnchor="middle"
        fontSize="6.5"
        fontFamily="Geist Mono, monospace"
        letterSpacing="1"
        fill="var(--paper)"
        opacity="0.65"
      >
        CONCEPTS
      </text>
      <circle cx={center} cy={center} r={54} fill="none" stroke="var(--accent)" strokeOpacity="0.4" strokeDasharray="2 4" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: GitBranch,
    title: "A graph, not a list",
    body: "Every concept carries prerequisite and related links. The planner walks backwards from your goal, so you repair the foundation before the roof.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence, not self-report",
    body: "Saying you know something caps at a claim. Levels move only when a graded response passes a published rubric.",
  },
  {
    icon: Timer,
    title: "Retention is separate",
    body: "FSRS schedules delayed recall. Pass after seven days and the level is marked retained; fail twice and it drops.",
  },
  {
    icon: Braces,
    title: "Grounded tutoring",
    body: "The tutor receives the sourced definition, assumptions, failure modes, graph neighbours, and source URLs. No key? A deterministic fallback says so.",
  },
];

export function LandingPage() {
  const { data } = usePublicAtlas();
  const { data: me } = useMe();
  const signedIn = Boolean(me?.user);
  const stats = {
    concepts: data?.totalConcepts ?? 429,
    domains: data?.totalDomains ?? 12,
    sources: data?.totalSources ?? 93,
    edges: data?.totalEdges ?? 148,
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Brand />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#method" className="transition-colors hover:text-ink">Method</a>
            <a href="#atlas" className="transition-colors hover:text-ink">Atlas</a>
            <a href="#retention" className="transition-colors hover:text-ink">Retention</a>
            <a href="#tutor" className="transition-colors hover:text-ink">Tutor</a>
          </nav>
          <div className="flex items-center gap-2">
            {signedIn ? (
              <Button asChild size="sm">
                <Link to="/dashboard">
                  Open workspace <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Start the atlas</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div className="relative z-10">
              <p className="eyebrow">Mathematics · {stats.concepts} concepts · {stats.domains} domains</p>
              <h1 className="mt-5 font-display text-[3.5rem] leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[5.4rem]">
                The map is
                <br />
                <span className="italic text-accent">the curriculum.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">
                A mastery operating system for the whole of mathematics. Browse a prerequisite-linked atlas, turn any
                goal into a sequenced plan, prove each level with graded evidence, and keep it with scheduled recall.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link to={signedIn ? "/dashboard" : "/signup"}>
                    {signedIn ? "Continue where you left off" : "Build your first curriculum"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to={signedIn ? "/atlas" : "/login"}>
                    <BookOpen className="size-4" />
                    {signedIn ? "Browse the atlas" : "Sign in"}
                  </Link>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
                <Stat label="Concepts" value={stats.concepts} hint="sourced glossary entries" />
                <Stat label="Domains" value={stats.domains} hint="MSC2020 coverage spine" />
                <Stat label="Graph edges" value={stats.edges} hint="prerequisite & related" />
                <Stat label="Sources" value={stats.sources} hint="cited in the atlas" />
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-[590px]">
              <div className="absolute inset-6 rounded-full border border-line/50" aria-hidden="true" />
              <AtlasGraphic domains={data?.domains ?? []} />
              <p className="absolute bottom-0 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                {stats.concepts} entries · {stats.domains} domains · one graph
              </p>
            </div>
          </div>
        </section>

        <section id="method" className="border-b border-line">
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow">The mastery ladder</p>
                <h2 className="mt-2 max-w-md text-4xl leading-[1.05]">Knowing a name is not knowing the idea.</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                  Each level is earned by a different kind of evidence. A fluent paragraph does not prove application;
                  a correct calculation without a method does not prove understanding.
                </p>
                <div className="mt-6 rounded-[var(--radius-md)] border border-line bg-surface p-4">
                  <p className="text-xs font-medium">Self-report is capped on purpose.</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    “I already know this” records a claim at most L1 and never unlocks a prerequisite. Only graded
                    evidence moves the record.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-line bg-ink/[0.02] p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl text-muted">L0</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">No evidence</span>
                  </div>
                  <p className="mt-3 text-sm font-medium">Unseen</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    The default state of every concept. Browsing does not change it.
                  </p>
                </div>
                {LEVELS.map((entry, index) => (
                  <div
                    key={entry.level}
                    className={cn(
                      "rounded-[var(--radius-md)] border border-line bg-surface p-5",
                      index === LEVELS.length - 1 && "sm:col-span-2",
                    )}
                  >
                    <div className="flex items-baseline justify-between">
                      <span
                        className={cn(
                          "font-display text-4xl",
                          entry.level === "L1" && "text-level-1",
                          entry.level === "L2" && "text-level-2",
                          entry.level === "L3" && "text-level-3",
                        )}
                      >
                        {entry.level}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{entry.name}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">{entry.description}</p>
                    <p className="mt-2 font-mono text-[10px] text-muted">{entry.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="atlas" className="border-b border-line bg-surface/60">
          <div className="container-page py-16 lg:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">The atlas</p>
                <h2 className="mt-2 text-4xl leading-[1.05]">Twelve domains. One connected index.</h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-muted">
                Counts come from the ingested glossary, not from a marketing spreadsheet. Every entry links back to its
                source list; many are still seed definitions and say so.
              </p>
            </div>

            <div className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {(data?.domains ?? []).map((domain, index) => {
                const meta = domainMeta(domain.slug);
                return (
                  <div key={domain.slug} className="border-t border-line py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-muted">{String(index + 1).padStart(2, "0")}</span>
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                          <h3 className="truncate text-[15px] font-medium">{meta.short}</h3>
                        </div>
                        <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-muted">{domain.description}</p>
                        <p className="mt-2 line-clamp-1 font-mono text-[10px] text-muted/80">
                          {domain.sample.map((entry) => entry.term).join(" · ")}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm">{domain.count}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-muted">entries</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="retention" className="border-b border-line">
          <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="eyebrow">Retention is a separate claim</p>
              <h2 className="mt-2 text-4xl leading-[1.05]">Earned once is not known forever.</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Levels describe what you can do now. Retention describes whether it survived. Delayed recall is scheduled
                with FSRS; a pass after seven days marks the level retained. Two consecutive failures lower it.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-[var(--radius-md)] border border-line p-4">
                  <p className="font-display text-3xl">7d</p>
                  <p className="mt-1 text-[10px] text-muted">minimum delay before retention can be claimed</p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-line p-4">
                  <p className="font-display text-3xl">2×</p>
                  <p className="mt-1 text-[10px] text-muted">failed recalls before a level drops</p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-line p-4">
                  <p className="font-display text-3xl">1</p>
                  <p className="mt-1 text-[10px] text-muted">grace day per week protects a streak without faking evidence</p>
                </div>
              </div>
            </div>
            <div className="paper-grain relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="eyebrow">Activity is evidence</p>
                  <p className="mt-1 font-display text-2xl">A year, one square per day.</p>
                </div>
                <span className="font-mono text-[10px] text-muted">GitHub-style, earned XP only</span>
              </div>
              <div className="mt-6 grid grid-flow-col grid-rows-7 gap-[3px]">
                {Array.from({ length: 53 * 7 }, (_, index) => {
                  const value = (index * 37 + 11) % 17;
                  const level = value > 13 ? 4 : value > 10 ? 3 : value > 6 ? 2 : value > 2 ? 1 : 0;
                  return (
                    <span
                      key={index}
                      className={cn(
                        "aspect-square rounded-[2px]",
                        level === 0 && "bg-ink/[0.055]",
                        level === 1 && "bg-accent/25",
                        level === 2 && "bg-accent/45",
                        level === 3 && "bg-accent/70",
                        level === 4 && "bg-accent",
                      )}
                    />
                  );
                })}
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-muted">
                Illustration only. Your map is built from recorded reviews, not from page views or streaks.
              </p>
            </div>
          </div>
        </section>

        <section id="tutor" className="border-b border-line bg-ink text-paper">
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">The tutor</p>
                <h2 className="mt-2 text-4xl leading-[1.05] text-paper">
                  A source trail,
                  <br />
                  not a confident voice.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/65">
                  The tutor is grounded in the selected atlas entry: definition, assumptions, failure modes, neighbours,
                  and URLs. It is instructed never to invent a citation, and to call a seed entry a seed entry.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] text-paper/70">
                    Socratic
                  </span>
                  <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] text-paper/70">
                    Explain
                  </span>
                  <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] text-paper/70">
                    Quiz
                  </span>
                  <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] text-paper/70">
                    Deep dive
                  </span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="rounded-[var(--radius-md)] border border-paper/12 bg-paper/[0.04] p-5">
                    <feature.icon className="size-4 text-accent" />
                    <h3 className="mt-3 text-base text-paper">{feature.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-paper/60">{feature.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="container-page flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <BrandMark className="mt-1 size-10" />
              <div>
                <h2 className="text-3xl leading-tight">Pick a goal. See the path.</h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  State what you want to understand. MathMastery matches atlas concepts, walks their prerequisites, and
                  budgets the work against your week.
                </p>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link to={signedIn ? "/curriculum" : "/signup"}>
                {signedIn ? "Open curriculum" : "Start free"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="container-page flex flex-col gap-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BrandMark className="size-5" />
          <span>MathMastery · an evidence-first mathematics atlas</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="size-3" />
            {data ? `${data.totalConcepts} concepts · ${data.totalSources} sources` : "429 concepts · 93 sources"}
          </span>
          <Link to="/login" className="hover:text-ink">Sign in</Link>
          <Link to="/signup" className="hover:text-ink">Create account</Link>
        </div>
      </footer>
    </div>
  );
}
