import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Compass,
  Flame,
  Home,
  LogOut,
  Map,
  MessageSquare,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sun,
  Zap,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { queryClient } from "@/lib/query";
import { useMe, useQueue, useSummary } from "@/lib/queries";
import { cn, initials } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import type { MeResponse } from "@/lib/types";
import { Brand, BrandMark } from "@/components/brand";
import { SearchCommand } from "@/components/search-command";

const MAIN_NAV = [
  { to: "/dashboard", label: "Today", icon: Home },
  { to: "/atlas", label: "Atlas", icon: Map },
  { to: "/review", label: "Review", icon: RotateCcw },
  { to: "/curriculum", label: "Curriculum", icon: Compass },
  { to: "/tutor", label: "Tutor", icon: MessageSquare },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;

const MOBILE_NAV = MAIN_NAV;

function NavRow({
  to,
  label,
  icon: Icon,
  badge,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  badge?: number;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
        active ? "bg-ink text-paper" : "text-muted hover:bg-ink/5 hover:text-ink",
      )}
    >
      <Icon className={cn("size-4", active ? "text-paper" : "text-muted group-hover:text-ink")} />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 ? (
        <span
          className={cn(
            "min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-[10px]",
            active ? "bg-paper/20 text-paper" : "bg-accent/10 text-accent",
          )}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppShell({ me, children }: { me: MeResponse; children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: summary } = useSummary();
  const { data: queue } = useQueue();
  const { data: freshMe } = useMe();
  const profile = freshMe?.profile ?? me.profile;
  const user = freshMe?.user ?? me.user;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    queryClient.clear();
    void navigate({ to: "/" });
  }

  const due = queue?.due.length ?? summary?.due ?? 0;
  const streak = summary?.streak.current ?? 0;
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-dvh bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-paper lg:flex">
        <div className="px-5 pb-5 pt-6">
          <Brand />
        </div>

        <div className="px-5 pb-2">
          <span className="eyebrow">Workspace</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {MAIN_NAV.map((item) => (
            <NavRow
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              badge={item.to === "/review" ? due : undefined}
              active={pathname === item.to || pathname.startsWith(`${item.to}/`)}
            />
          ))}
          <div className="my-3 border-t border-line" />
          <NavRow to="/settings" label="Settings" icon={Settings} active={pathname === "/settings"} />
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/12 font-mono text-[11px] font-medium text-accent">
              {initials(profile?.displayName ?? user?.name ?? "Learner")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{profile?.displayName ?? user?.name}</p>
              <p className="truncate text-[10px] text-muted">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded p-1.5 text-muted hover:bg-ink/5 hover:text-ink"
              aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}
              title={`Use ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded p-1.5 text-muted hover:bg-ink/5 hover:text-danger"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center gap-3 px-4 sm:px-6">
            <Link to="/dashboard" className="lg:hidden" aria-label="MathMastery home">
              <BrandMark className="size-7" />
            </Link>
            <div className="hidden min-w-0 items-center gap-2 text-xs text-muted lg:flex">
              <span className="eyebrow">Workspace</span>
              <span className="text-line">/</span>
              <span>{dateLabel}</span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-8 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                <Search className="size-3.5" />
                <span className="hidden sm:inline">Search the atlas</span>
                <kbd className="hidden rounded border border-line px-1 font-mono text-[9px] sm:inline">⌘K</kbd>
              </button>

              <Link
                to="/progress"
                className="flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs"
                title={`${streak}-day streak`}
              >
                <Flame className={cn("size-3.5", streak > 0 ? "text-accent" : "text-muted")} />
                <span className="font-mono">{streak}</span>
              </Link>

              <Link
                to="/review"
                className="flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs"
                title={`${due} reviews due`}
              >
                <RotateCcw className="size-3.5 text-muted" />
                <span className="font-mono">{due}</span>
              </Link>

              <Link
                to="/progress"
                className="hidden h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs sm:flex"
                title="Total XP in the last 30 days"
              >
                <Zap className="size-3.5 text-warning" />
                <span className="font-mono">
                  {(summary?.recentActivity ?? []).reduce((sum, day) => sum + day.xp, 0).toLocaleString()}
                </span>
              </Link>

              <button
                type="button"
                onClick={toggle}
                className="ml-1 rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink lg:hidden"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-6 sm:px-6 lg:pb-16 lg:pt-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px]",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
                {item.to === "/review" && due > 0 ? (
                  <span className="absolute right-1/4 top-1.5 size-1.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
