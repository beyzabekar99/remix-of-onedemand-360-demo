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

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sinyal uyumları</h2>
      <div className="grid gap-3 lg:grid-cols-3">
        {[
          { key: "weather", label: "Hava durumu uyumu", color: "from-sky-400 to-indigo-600" },
          { key: "specialDay", label: "Özel gün uyumu", color: "from-pink-400 to-rose-600" },
          { key: "campaign", label: "Kampanya uplift uyumu", color: "from-orange-400 to-red-500" },
        ].map((s) => {
          const total = filtered.length;
          const ok = filtered.filter((r) =>
            s.key === "weather" ? r.revision.weatherMatch : s.key === "specialDay" ? r.revision.specialDayMatch : r.revision.campaignMatch,
          ).length;
          const pct = total ? Math.round((ok / total) * 100) : 0;
          return (
            <div key={s.key} className="od-card-hover rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${pct >= 80 ? "bg-success/15 text-success" : pct >= 50 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"}`}>
                  {ok}/{total} uyum
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                  style={{
                    width: "0%",
                    animation: "od-bar-grow 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
                    // @ts-ignore
                    ["--target" as any]: `${pct}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">%{pct}</div>
              <div className="text-[11px] text-muted-foreground">Beklenen vs gerçekleşen sinyal eşleşmesi</div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agent yorumları</h2>
      <div className="mt-2 grid gap-3 lg:grid-cols-2">
        {filtered.map((r) => {
          const v = r.revision;
          const tone =
            v.deviationPct < -10 ? "danger" :
            v.deviationPct < -5 ? "warning" :
            v.deviationPct < 0 ? "info" : "success";
          const toneCls = {
            danger: { ring: "ring-danger/30", chip: "bg-danger/15 text-danger", bar: "from-rose-500 to-red-700", label: "Kritik sapma" },
            warning: { ring: "ring-warning/30", chip: "bg-warning/15 text-warning", bar: "from-amber-400 to-orange-600", label: "Uyarı" },
            info: { ring: "ring-primary/20", chip: "bg-primary/10 text-primary", bar: "from-cyan-400 to-teal-600", label: "İzleniyor" },
            success: { ring: "ring-success/30", chip: "bg-success/15 text-success", bar: "from-emerald-400 to-green-600", label: "Stabil" },
          }[tone];
          return (
            <div
              key={r.store}
              className={`od-card-hover relative overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 ring-1 ${toneCls.ring}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneCls.bar}`} />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StoreIcon className="h-3.5 w-3.5 text-primary" />
                    <div className="text-sm font-semibold truncate">{r.store}</div>
                    <span className="text-[10px] text-muted-foreground">· {r.city} · {r.tier}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Revision Agent · {r.hour}</div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${toneCls.chip}`}>
                  {toneCls.label}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                <span className="text-muted-foreground">“</span>{v.comment}<span className="text-muted-foreground">”</span>
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sapma</div>
                  <div className={`mt-0.5 font-semibold tabular-nums ${v.deviationPct < 0 ? "text-danger" : "text-success"}`}>
                    {fmtPct(v.deviationPct)}
                  </div>
                </div>
                <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revize</div>
                  <div className="mt-0.5 font-semibold tabular-nums">{fmtNum(v.revisedForecast)}</div>
                </div>
                <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Telafi</div>
                  <div className={`mt-0.5 font-semibold tabular-nums ${v.ordersToRecover > 0 ? "text-warning" : "text-muted-foreground"}`}>
                    {v.ordersToRecover > 0 ? `+${fmtNum(v.ordersToRecover)}` : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <SignalChip ok={v.weatherMatch} label="Hava" />
                <SignalChip ok={v.specialDayMatch} label="Özel gün" />
                <SignalChip ok={v.campaignMatch} label="Kampanya" />
                <span className="ml-auto text-[11px] text-muted-foreground">
                  CR <span className="tabular-nums">%{v.expectedCr.toFixed(1)} → %{v.actualCr.toFixed(1)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function SignalChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
        ok
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

function Match({ ok }: { ok: boolean }) {
  return ok ? <CheckCircle2 className="inline h-4 w-4 text-success" /> : <XCircle className="inline h-4 w-4 text-danger" />;
}
