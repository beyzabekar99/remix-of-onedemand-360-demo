import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  GitBranch,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Mission Control", icon: LayoutDashboard },
  { to: "/summary", label: "Store Intelligence", icon: LayoutGrid },
  { to: "/agents/forecast", label: "Forecast Agent", icon: Brain },
  { to: "/agents/revision", label: "Revision Agent", icon: GitBranch },
  { to: "/agents/execution", label: "Execution Agent", icon: PlayCircle },
  { to: "/agents/campaign", label: "Campaign Agent", icon: Megaphone },
  { to: "/agents/creative", label: "Creative Agent", icon: Sparkles },
  { to: "/agents/loss", label: "Loss Feedback Agent", icon: AlertTriangle },
  { to: "/how-it-works", label: "System Map", icon: HelpCircle },
] as const;

const railStats = [
  { label: "Scope", value: "13 stores" },
  { label: "Cadence", value: "Hourly" },
  { label: "Mode", value: "Live orchestration" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(960px circle at 12% -12%, rgba(237,118,37,0.16), transparent 56%), radial-gradient(760px circle at 92% 8%, rgba(255,176,102,0.16), transparent 54%), radial-gradient(720px circle at 50% 100%, rgba(184,71,15,0.08), transparent 58%), linear-gradient(180deg, rgba(255,248,241,0.95) 0%, rgba(255,255,255,1) 42%)",
        }}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar/84 backdrop-blur-2xl md:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11 drop-shadow-[0_10px_24px_rgba(237,118,37,0.28)]" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                OneDemand 360
              </div>
              <div className="mt-1 text-base font-semibold tracking-tight text-foreground">
                AI Decision Cockpit
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white p-4 shadow-[0_18px_32px_-24px_rgba(237,118,37,0.55)]">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
              National command layer
            </div>
            <div className="mt-2 text-sm font-medium leading-6 text-foreground">
              Forecast, guardrail and campaign decisions roll up into one operator view.
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground data-[status=active]:bg-gradient-to-r data-[status=active]:from-[#ED7625] data-[status=active]:to-[#F39455] data-[status=active]:text-white data-[status=active]:shadow-[0_10px_28px_-14px_rgba(237,118,37,0.72)]"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-sidebar-border px-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            {railStats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/70 bg-white/75 px-3 py-2 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-success/20 bg-success/10 px-3 py-3 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              Orchestration active
            </div>
            <div className="mt-1 text-muted-foreground">
              Guardrails are evaluating store and courier capacity continuously.
            </div>
          </div>
        </div>
      </aside>

      <main className="md:pl-72">
        <header className="sticky top-0 z-10 border-b border-border/80 bg-card/75 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Migros One grocery network
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Turkey orchestration</span>
                <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-flex" />
                <span>14 May 2026</span>
                <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-flex" />
                <span>14:00 snapshot</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-success">
                <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse" />
                5 agents live
              </span>
              <span className="hidden rounded-full border border-border bg-white/80 px-3 py-1 text-muted-foreground lg:inline-flex">
                13 stores in scope
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="max-w-3xl">
        <h1 className="bg-gradient-to-br from-foreground via-foreground to-[#ED7625] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-[15px]">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
