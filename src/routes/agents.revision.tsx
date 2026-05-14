import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, fmtNum, fmtPct } from "@/lib/demo-data";
import { GitBranch, CheckCircle2, XCircle, Store as StoreIcon } from "lucide-react";
import { AgentBadge } from "./agents.forecast";

export const Route = createFileRoute("/agents/revision")({
  component: RevisionAgentPage,
  head: () => ({
    meta: [
      { title: "Revision Agent — OneDemand 360" },
      { name: "description", content: "Mağaza bazlı varsayım × gerçekleşen karşılaştırması ve revize forecast." },
    ],
  }),
});

function RevisionAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  return (
    <AppShell>
      <PageHeader
        title="Revision Agent"
        subtitle="Varsayım × gerçekleşen uyumu, revize forecast ve telafi planı"
        right={<AgentBadge icon={GitBranch} label={`${filtered.length} mağaza analiz edildi`} tone="info" />}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm font-medium">Mağaza bazlı revizyon</div>
          <CityFilter value={city} onChange={setCity} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Mağaza</th>
                <th className="px-3 py-3 text-left">İl</th>
                <th className="px-3 py-3 text-right">Forecast</th>
                <th className="px-3 py-3 text-right">Gerçekleşen</th>
                <th className="px-3 py-3 text-right">Gün sonu proj.</th>
                <th className="px-3 py-3 text-right">Sapma</th>
                <th className="px-3 py-3 text-right">Sapma %</th>
                <th className="px-3 py-3 text-center">Hava</th>
                <th className="px-3 py-3 text-center">Özel gün</th>
                <th className="px-3 py-3 text-center">Kampanya</th>
                <th className="px-3 py-3 text-right">CR (bek/ger)</th>
                <th className="px-3 py-3 text-right">Uplift (bek/ger)</th>
                <th className="px-3 py-3 text-right">Revize forecast</th>
                <th className="px-3 py-3 text-right">Telafi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const v = r.revision;
                return (
                  <tr key={r.store} className="border-t border-border hover:bg-accent/30 align-top">
                    <td className="px-3 py-3 font-medium"><StoreIcon className="inline h-3.5 w-3.5 mr-1 text-primary" />{r.store}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.city}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(v.forecastOrders)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(v.actualOrders)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(v.endOfDayProjection)}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${v.deviationCount < 0 ? "text-danger" : "text-success"}`}>
                      {v.deviationCount > 0 ? "+" : ""}{fmtNum(v.deviationCount)}
                    </td>
                    <td className={`px-3 py-3 text-right tabular-nums font-medium ${v.deviationPct < 0 ? "text-danger" : "text-success"}`}>
                      {fmtPct(v.deviationPct)}
                    </td>
                    <td className="px-3 py-3 text-center"><Match ok={v.weatherMatch} /></td>
                    <td className="px-3 py-3 text-center"><Match ok={v.specialDayMatch} /></td>
                    <td className="px-3 py-3 text-center"><Match ok={v.campaignMatch} /></td>
                    <td className="px-3 py-3 text-right tabular-nums text-xs">
                      %{v.expectedCr.toFixed(1)} / <span className={v.actualCr < v.expectedCr ? "text-danger" : "text-success"}>%{v.actualCr.toFixed(1)}</span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-xs">
                      %{v.expectedUpliftPct.toFixed(1)} / <span className={v.actualUpliftPct < v.expectedUpliftPct ? "text-danger" : "text-success"}>%{v.actualUpliftPct.toFixed(1)}</span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{fmtNum(v.revisedForecast)}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${v.ordersToRecover > 0 ? "text-warning" : "text-muted-foreground"}`}>
                      {v.ordersToRecover > 0 ? `+${fmtNum(v.ordersToRecover)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.store} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.store} · {r.city}</div>
            <div className="mt-1 text-sm leading-relaxed">{r.revision.comment}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Match({ ok }: { ok: boolean }) {
  return ok ? <CheckCircle2 className="inline h-4 w-4 text-success" /> : <XCircle className="inline h-4 w-4 text-danger" />;
}
