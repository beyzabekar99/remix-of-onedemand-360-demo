import { Link } from "@tanstack/react-router";
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
  { to: "/", label: "Talep İzleme", icon: LayoutDashboard },
  { to: "/summary", label: "Mağaza Özeti", icon: LayoutGrid },
  { to: "/agents/forecast", label: "Forecast Agent", icon: Brain },
  { to: "/agents/revision", label: "Revision Agent", icon: GitBranch },
  { to: "/agents/execution", label: "Execution Agent", icon: PlayCircle },
  { to: "/agents/campaign", label: "Campaign Agent", icon: Megaphone },
  { to: "/agents/creative", label: "Creative Agent", icon: Sparkles },
  { to: "/agents/loss", label: "Loss & Root Cause Agent", icon: AlertTriangle },
  { to: "/how-it-works", label: "Nasıl Çalışır", icon: HelpCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* ambient radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px circle at 12% -10%, rgba(237,118,37,0.10), transparent 55%), radial-gradient(700px circle at 95% 8%, rgba(255,176,102,0.08), transparent 55%), radial-gradient(800px circle at 50% 110%, rgba(237,118,37,0.06), transparent 60%)",
        }}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground md:flex">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <Logo className="h-10 w-10 drop-shadow-[0_4px_12px_rgba(237,118,37,0.35)]" />
          <div>
            <div className="text-sm font-semibold tracking-tight bg-gradient-to-r from-[#ED7625] to-[#B8470F] bg-clip-text text-transparent">
              OneDemand 360
            </div>
            <div className="text-[11px] text-muted-foreground">AI Demand Orchestration</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-gradient-to-r data-[status=active]:from-[#ED7625] data-[status=active]:to-[#F39455] data-[status=active]:text-white data-[status=active]:font-medium data-[status=active]:shadow-[0_6px_20px_-8px_rgba(237,118,37,0.6)] transition-all"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 text-xs text-muted-foreground border-t border-sidebar-border">
          <div className="font-medium text-foreground">Demo Ortamı</div>
          Migros One · Internal AI Competition
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
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
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
