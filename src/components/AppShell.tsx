import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LayoutGrid,
  Brain,
  GitBranch,
  PlayCircle,
  Megaphone,
  Sparkles,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Talep İzleme", icon: LayoutDashboard, color: "from-sky-400 to-blue-600" },
  { to: "/summary", label: "Mağaza Özeti", icon: LayoutGrid, color: "from-violet-400 to-fuchsia-600" },
  { to: "/agents/forecast", label: "Forecast Agent", icon: Brain, color: "from-cyan-400 to-teal-600" },
  { to: "/agents/revision", label: "Revision Agent", icon: GitBranch, color: "from-emerald-400 to-green-600" },
  { to: "/agents/execution", label: "Execution Agent", icon: PlayCircle, color: "from-amber-400 to-orange-600" },
  { to: "/agents/campaign", label: "Campaign Agent", icon: Megaphone, color: "from-orange-400 to-red-500" },
  { to: "/agents/creative", label: "Creative Agent", icon: Sparkles, color: "from-pink-400 to-rose-600" },
  { to: "/agents/loss", label: "Loss & Root Cause Agent", icon: AlertTriangle, color: "from-rose-500 to-red-700" },
  { to: "/how-it-works", label: "Nasıl Çalışır", icon: HelpCircle, color: "from-slate-400 to-slate-700" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* ambient animated blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <span className="od-blob od-blob-a" style={{ width: 520, height: 520, top: -160, left: -120 }} />
        <span className="od-blob od-blob-b" style={{ width: 480, height: 480, top: -80, right: -140 }} />
        <span className="od-blob od-blob-c" style={{ width: 600, height: 600, bottom: -220, left: "30%" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 12% -10%, rgba(237,118,37,0.06), transparent 55%), radial-gradient(700px circle at 95% 8%, rgba(255,176,102,0.05), transparent 55%)",
          }}
        />
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/90 backdrop-blur-xl text-sidebar-foreground md:flex overflow-hidden">
        {/* sidebar ambient gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(400px circle at 0% 0%, rgba(237,118,37,0.10), transparent 60%), radial-gradient(300px circle at 100% 100%, rgba(244,114,182,0.08), transparent 65%)",
          }}
        />
        <div className="relative flex items-center gap-3 px-5 py-5 border-b border-sidebar-border bg-gradient-to-br from-[#ED7625]/10 via-transparent to-fuchsia-500/5">
          <Logo className="h-10 w-10 drop-shadow-[0_4px_12px_rgba(237,118,37,0.45)]" />
          <div>
            <div className="text-sm font-semibold tracking-tight bg-gradient-to-r from-[#ED7625] to-[#B8470F] bg-clip-text text-transparent">
              OneDemand 360
            </div>
            <div className="text-[11px] text-muted-foreground">AI Demand Orchestration</div>
          </div>
        </div>
        <nav className="relative flex flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-gradient-to-r data-[status=active]:from-[#ED7625] data-[status=active]:to-[#F39455] data-[status=active]:text-white data-[status=active]:font-medium data-[status=active]:shadow-[0_8px_22px_-10px_rgba(237,118,37,0.7)] transition-all"
            >
              <span
                className={`relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${color} text-white shadow-sm shadow-black/10 ring-1 ring-white/30 transition-transform group-hover:scale-110 group-data-[status=active]:bg-white/20 group-data-[status=active]:bg-none group-data-[status=active]:ring-white/40`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="relative mt-auto p-4 text-xs text-muted-foreground border-t border-sidebar-border bg-gradient-to-tr from-fuchsia-500/5 via-transparent to-[#ED7625]/10">
          <div className="flex items-center gap-2">
            <span className="od-live-dot" />
            <div className="font-medium text-foreground">Demo Ortamı</div>
          </div>
          <div className="mt-1">Migros One · Internal AI Competition</div>
        </div>
      </aside>

      <main className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-card/70 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Türkiye</span> · 14 Mayıs 2026 · 14:00 · 13 mağaza
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
              <span className="text-muted-foreground">5 ajan canlı</span>
            </div>
          </div>
        </header>
        <div key={pathname} className="od-page-enter p-6 max-w-7xl mx-auto">{children}</div>
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
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-foreground via-foreground to-[#ED7625] bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
