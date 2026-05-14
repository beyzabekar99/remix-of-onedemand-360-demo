import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import {
  campaignStyle,
  fmtMoney,
  fmtNum,
  fmtPct,
  opsStyle,
  stores,
  tierStyle,
  type StoreRow,
} from "@/lib/demo-data";
import {
  Activity,
  AlertTriangle,
  Brain,
  GitBranch,
  Megaphone,
  PlayCircle,
  ShieldX,
  Sparkles,
  Store as StoreIcon,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Mission Control — OneDemand 360" },
      {
        name: "description",
        content: "Multi-agent demand, guardrail and campaign cockpit for Migros One stores.",
      },
    ],
  }),
});

const pipeline = [
  { label: "Forecast", detail: "140K daily demand signal", icon: Brain, to: "/agents/forecast" },
  { label: "Revision", detail: "EOD projection refresh", icon: GitBranch, to: "/agents/revision" },
  { label: "Execution", detail: "Store + courier guardrails", icon: PlayCircle, to: "/agents/execution" },
  { label: "Campaign", detail: "Offer and approval logic", icon: Megaphone, to: "/agents/campaign" },
  { label: "Creative", detail: "Launch-ready asset generation", icon: Sparkles, to: "/agents/creative" },
  { label: "Loss feedback", detail: "Closed-loop learning", icon: AlertTriangle, to: "/agents/loss" },
] as const;

function Dashboard() {
  const [city, setCity] = useState("all");

  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );

  const metrics = useMemo(() => {
    const totalForecast = filtered.reduce((sum, row) => sum + row.forecast.finalForecast, 0);
    const totalActual = filtered.reduce((sum, row) => sum + row.actual, 0);
    const totalProjection = filtered.reduce((sum, row) => sum + row.revision.endOfDayProjection, 0);
    const totalNetContribution = filtered.reduce((sum, row) => sum + row.campaign.netContribution, 0);
    const openStores = filtered.filter((row) => row.opsStatus === "GREEN").length;
    const blockedStores = filtered.filter((row) => row.opsStatus === "RED").length;
    const reviewStores = filtered.filter((row) => row.opsStatus === "YELLOW").length;
    const avgCr = filtered.reduce((sum, row) => sum + row.cr, 0) / Math.max(filtered.length, 1);
    const gapPct = totalForecast > 0 ? ((totalActual - totalForecast) / totalForecast) * 100 : 0;

    return {
      avgCr,
      blockedStores,
      gapPct,
      openStores,
      reviewStores,
      totalActual,
      totalForecast,
      totalNetContribution,
      totalProjection,
    };
  }, [filtered]);

  const focusStores = useMemo(() => {
    return [...filtered]
      .sort((a, b) => Math.abs(b.revision.ordersToRecover) - Math.abs(a.revision.ordersToRecover))
      .slice(0, 3);
  }, [filtered]);

  const opportunityStores = useMemo(() => {
    return [...filtered]
      .filter((row) => row.campaign.netContribution > 0)
      .sort((a, b) => b.campaign.netContribution - a.campaign.netContribution)
      .slice(0, 5);
  }, [filtered]);

  const headline = `Open ${metrics.openStores} stores, review ${metrics.reviewStores}, block ${metrics.blockedStores} before 16:00.`;

  return (
    <AppShell>
      <PageHeader
        title="Mission Control"
        subtitle="Demand forecast, operational guardrails and campaign activation now live in one executive decision layer."
        right={<CityFilter value={city} onChange={setCity} />}
      />

      <section className="overflow-hidden rounded-[28px] border border-primary/15 bg-gradient-to-br from-[#1c120d] via-[#55260b] to-[#ed7625] p-6 text-white shadow-[0_30px_80px_-34px_rgba(184,71,15,0.85)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/90">
              Executive decision strip
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {headline}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
              Forecast says {fmtNum(metrics.totalForecast)} orders, field reality is {fmtNum(metrics.totalActual)}
              , and the orchestration layer is steering the network toward {fmtNum(metrics.totalProjection)} end-of-day orders.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Expected net uplift" value={fmtMoney(metrics.totalNetContribution)} hint="Campaign actions already scoped" />
              <HeroMetric
                label="Forecast gap"
                value={fmtPct(metrics.gapPct)}
                hint="Current realized vs plan"
              />
              <HeroMetric label="Average CR" value={`%${metrics.avgCr.toFixed(2)}`} hint="Across active store portfolio" />
            </div>
          </div>

          <div className="grid gap-3">
            <DecisionCard
              icon={Target}
              eyebrow="Primary action"
              title={`${metrics.openStores} stores are eligible for immediate campaign release`}
              body="Execution guardrails are green and creative can launch without additional approvals."
            />
            <DecisionCard
              icon={AlertTriangle}
              eyebrow="Watchlist"
              title={`${metrics.reviewStores} stores need human review before more demand is added`}
              body="Capacity or ETA is drifting; keep the demand curve controlled until revision settles."
            />
            <DecisionCard
              icon={ShieldX}
              eyebrow="Hard block"
              title={`${metrics.blockedStores} stores are blocked from campaign pressure`}
              body="These stores need operational recovery first, not more traffic."
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 lg:grid-cols-6">
        {pipeline.map((step, index) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.label}
              to={step.to}
              className="group rounded-3xl border border-border/70 bg-card/90 p-4 shadow-[0_20px_34px_-30px_rgba(15,23,42,0.5)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_50px_-28px_rgba(237,118,37,0.48)]"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-4 text-sm font-semibold text-foreground">{step.label}</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</div>
            </Link>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-[0_20px_36px_-30px_rgba(15,23,42,0.38)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Store narratives
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Three stores driving today&apos;s story
              </h3>
            </div>
            <Link to="/summary" className="text-sm font-medium text-primary hover:underline">
              Full intelligence view
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {focusStores.map((store) => (
              <StoryCard key={store.store} store={store} />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-[0_20px_36px_-30px_rgba(15,23,42,0.38)]">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Opportunity board
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Highest-return actions in flight
          </h3>

          <div className="mt-5 space-y-3">
            {opportunityStores.map((store) => (
              <OpportunityRow key={store.store} store={store} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-[0_20px_36px_-30px_rgba(15,23,42,0.38)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Portfolio pulse
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Where the network needs attention next
            </h3>
          </div>
          <Link to="/agents/loss" className="text-sm font-medium text-primary hover:underline">
            See loss feedback
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-border/80 bg-muted/30 text-left text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Store</th>
                <th className="px-3 py-3">Signal</th>
                <th className="px-3 py-3 text-right">Forecast</th>
                <th className="px-3 py-3 text-right">Actual</th>
                <th className="px-3 py-3 text-right">Recoverable orders</th>
                <th className="px-3 py-3">Guardrail</th>
                <th className="px-3 py-3">Suggested move</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .slice()
                .sort((a, b) => Math.abs(b.gapPct) - Math.abs(a.gapPct))
                .map((store) => (
                  <tr key={store.store} className="border-b border-border/70 hover:bg-accent/20">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{store.store}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{store.city}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${tierStyle[store.tier]}`}>
                        {store.tier}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(store.forecast.finalForecast)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(store.actual)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-foreground">
                      {fmtNum(store.revision.ordersToRecover)}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${opsStyle[store.opsStatus]}`}>
                        {store.opsStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                      {store.campaign.rationale}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function HeroMetric({
  hint,
  label,
  value,
}: {
  hint: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/70">{hint}</div>
    </div>
  );
}

function DecisionCard({
  body,
  eyebrow,
  icon: Icon,
  title,
}: {
  body: string;
  eyebrow: string;
  icon: any;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-white/12 bg-black/15 p-4 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/65">{eyebrow}</div>
          <div className="mt-1 text-sm font-semibold leading-6 text-white">{title}</div>
          <div className="mt-1 text-xs leading-5 text-white/72">{body}</div>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ store }: { store: StoreRow }) {
  const toneClass =
    store.opsStatus === "RED"
      ? "border-danger/30 bg-danger/5"
      : store.opsStatus === "YELLOW"
        ? "border-warning/30 bg-warning/5"
        : "border-success/20 bg-success/5";

  const headline =
    store.opsStatus === "RED"
      ? "Demand is being intentionally blocked until store recovery catches up."
      : store.opsStatus === "YELLOW"
        ? "The store can still move demand, but capacity requires a human checkpoint."
        : "The store is in a safe window to recover volume through campaign pressure.";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{store.city}</div>
          <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
            <StoreIcon className="h-4 w-4 text-primary" />
            {store.store}
          </div>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${campaignStyle[store.campaign.type]}`}>
          {store.campaign.type}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground">{headline}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat label="Gap" value={fmtPct(store.gapPct)} icon={TrendingUp} />
        <MiniStat label="Recoverable" value={fmtNum(store.revision.ordersToRecover)} icon={Activity} />
        <MiniStat label="ROI" value={store.campaign.roi > 0 ? `${store.campaign.roi.toFixed(1)}x` : "—"} icon={Wallet} />
        <MiniStat label="Status" value={store.opsStatus} icon={AlertTriangle} />
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-white/60 p-3 text-xs leading-5 text-muted-foreground">
        {store.agentSummary}
      </div>
    </div>
  );
}

function OpportunityRow({ store }: { store: StoreRow }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-white/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{store.store}</div>
          <div className="mt-1 text-xs text-muted-foreground">{store.campaign.offer}</div>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${opsStyle[store.opsStatus]}`}>
          {store.opsStatus}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <MiniStat label="Net" value={fmtMoney(store.campaign.netContribution)} icon={Wallet} />
        <MiniStat label="Reachable" value={fmtNum(store.reachableUsers)} icon={Target} />
        <MiniStat label="Creative" value={store.campaign.creative ? "Ready" : "No"} icon={Sparkles} />
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
