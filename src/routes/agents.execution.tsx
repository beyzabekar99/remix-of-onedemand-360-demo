import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, opsStyle, opsLabel, fmtPct } from "@/lib/demo-data";
import { PlayCircle, Truck, Store as StoreIcon, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { AgentBadge } from "./agents.forecast";

export const Route = createFileRoute("/agents/execution")({
  component: ExecutionAgentPage,
  head: () => ({
    meta: [
      { title: "Execution Agent — OneDemand 360" },
      { name: "description", content: "Picking ve Kurye KPI guardrail kontrolleri ile kampanya uygunluk kararı." },
    ],
  }),
});

function ExecutionAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  // Group courier rows by pool (unique)
  const pools = useMemo(() => {
    const map = new Map<string, ReturnType<typeof storesPool>>();
    function storesPool(p: string) { return filtered.find((s) => s.courier.pool === p)!; }
    filtered.forEach((s) => { if (!map.has(s.courier.pool)) map.set(s.courier.pool, s); });
    return Array.from(map.values());
  }, [filtered]);

  const riskyStores = filtered.filter((s) => s.picking.status !== "GREEN").length;
  const riskyPools = pools.filter((s) => s.courier.status !== "GREEN").length;
  const openable = filtered.filter((r) => r.opsStatus === "GREEN").length;
  const blocked = filtered.filter((r) => r.opsStatus === "RED").length;

  return (
    <AppShell>
      <PageHeader
        title="Execution Agent"
        subtitle="2 seviyeli guardrail · Picking KPI (mağaza) + Kurye KPI (havuz)"
        right={<AgentBadge icon={PlayCircle} label="KPI'lar tarandı" tone="info" />}
      />

      <GuardrailProgress />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Picking durumu (genel)" value={riskyStores === 0 ? "GREEN" : riskyStores > 1 ? "RED" : "YELLOW"} tone={riskyStores === 0 ? "success" : "warning"} />
        <Card label="Kurye durumu (genel)" value={riskyPools === 0 ? "GREEN" : "YELLOW"} tone={riskyPools === 0 ? "success" : "warning"} />
        <Card label="Riskli mağaza" value={String(riskyStores)} tone={riskyStores ? "warning" : "success"} icon={ShieldAlert} />
        <Card label="Riskli kurye havuzu" value={String(riskyPools)} tone={riskyPools ? "warning" : "success"} icon={ShieldAlert} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Kampanya açılabilir mağaza" value={String(openable)} tone="success" icon={ShieldCheck} />
        <Card label="Kampanya engellenen" value={String(blocked)} tone={blocked ? "danger" : "success"} icon={ShieldX} />
        <Card label="İnsan onayında" value={String(filtered.length - openable - blocked)} tone="warning" icon={ShieldAlert} />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
        <span>Seviye 1 · Picking KPI (mağaza)</span>
        <CityFilter value={city} onChange={setCity} />
      </h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Mağaza</th>
                <th className="px-3 py-3 text-left">İl</th>
                <th className="px-3 py-3 text-center">Toplama uygun?</th>
                <th className="px-3 py-3 text-center">Danışman yeterli?</th>
                <th className="px-3 py-3 text-right">Tahmini (dk)</th>
                <th className="px-3 py-3 text-right">Gerçekleşen (dk)</th>
                <th className="px-3 py-3 text-right">Sapma %</th>
                <th className="px-3 py-3 text-left">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const p = r.picking;
                return (
                  <tr key={r.store} className="border-t border-border">
                    <td className="px-3 py-3 font-medium"><StoreIcon className="inline h-3.5 w-3.5 mr-1 text-primary" />{r.store}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.city}</td>
                    <td className="px-3 py-3 text-center">{p.pickingOk ? "✓" : "✕"}</td>
                    <td className="px-3 py-3 text-center">{p.staffOk ? "✓" : "✕"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.estPickingMin}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.actualPickingMin}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${p.pickingDeviationPct > 15 ? "text-danger" : p.pickingDeviationPct > 5 ? "text-warning" : "text-success"}`}>
                      {fmtPct(p.pickingDeviationPct)}
                    </td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${opsStyle[p.status]}`}>{p.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seviye 2 · Kurye KPI (havuz)</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Havuz</th>
                <th className="px-3 py-3 text-center">Kapasite</th>
                <th className="px-3 py-3 text-center">Teslimat</th>
                <th className="px-3 py-3 text-center">ETA sapma</th>
                <th className="px-3 py-3 text-center">Kurye/sip oranı</th>
                <th className="px-3 py-3 text-right">Tah. (dk)</th>
                <th className="px-3 py-3 text-right">Ger. (dk)</th>
                <th className="px-3 py-3 text-right">ETA sapma %</th>
                <th className="px-3 py-3 text-right">Aktif kurye</th>
                <th className="px-3 py-3 text-right">1 kurye / X sip.</th>
                <th className="px-3 py-3 text-left">Durum</th>
              </tr>
            </thead>
            <tbody>
              {pools.map((r) => {
                const c = r.courier;
                const ratioSpread = Math.round(1 / c.courierOrderRatio);
                return (
                  <tr key={c.pool} className="border-t border-border">
                    <td className="px-3 py-3 font-medium"><Truck className="inline h-3.5 w-3.5 mr-1 text-primary" />{c.pool}</td>
                    <td className="px-3 py-3 text-center">{c.capacityOk ? "✓" : "✕"}</td>
                    <td className="px-3 py-3 text-center">{c.deliveryOk ? "✓" : "✕"}</td>
                    <td className="px-3 py-3 text-center">{c.etaDeviation ? "✕" : "✓"}</td>
                    <td className="px-3 py-3 text-center">{c.ratioOk ? "✓" : "✕"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.estDeliveryMin}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.actualDeliveryMin}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${c.etaDeviationPct > 15 ? "text-danger" : c.etaDeviationPct > 5 ? "text-warning" : "text-success"}`}>{fmtPct(c.etaDeviationPct)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.activeCouriers}</td>
                    <td className="px-3 py-3 text-right tabular-nums">1 / {ratioSpread}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${opsStyle[c.status]}`}>{c.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Operasyon guardrail kararı</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.store} className={`rounded-xl border p-4 ${
            r.opsStatus === "RED" ? "border-danger/40 bg-danger/5"
            : r.opsStatus === "YELLOW" ? "border-warning/40 bg-warning/5"
            : "border-border bg-card"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{r.store}</div>
                <div className="text-[11px] text-muted-foreground">{r.city}</div>
              </div>
              <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${opsStyle[r.opsStatus]}`}>{opsLabel[r.opsStatus]}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-border bg-background/50 p-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Picking</div>
                <span className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.picking.status]}`}>{r.picking.status}</span>
              </div>
              <div className="rounded-md border border-border bg-background/50 p-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Kurye</div>
                <span className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.courier.status]}`}>{r.courier.status}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{r.agentSummary}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Card({ label, value, tone = "default", icon: Icon }: { label: string; value: string; tone?: "default" | "success" | "danger" | "warning"; icon?: any }) {
  const cls = { default: "text-foreground", success: "text-success", danger: "text-danger", warning: "text-warning" }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}{label}
      </div>
      <div className={`mt-2 text-xl font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
