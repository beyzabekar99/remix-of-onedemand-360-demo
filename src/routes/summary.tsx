import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, opsStyle, opsLabel, campaignStyle, approvalStyle, tierStyle, fmtMoney, fmtNum, fmtPct } from "@/lib/demo-data";
import { Megaphone, Users, ShieldCheck, Activity, Store as StoreIcon } from "lucide-react";

export const Route = createFileRoute("/summary")({
  component: SummaryPage,
  head: () => ({
    meta: [
      { title: "Mağaza Özeti — OneDemand 360" },
      { name: "description", content: "Tüm mağazalar için forecast, operasyon ve kampanya özet kartları." },
    ],
  }),
});

function SummaryPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  return (
    <AppShell>
      <PageHeader
        title="Mağaza Özeti"
        subtitle="Her MMM mağazası için talep, operasyon ve agent kararı tek ekranda"
        right={<CityFilter value={city} onChange={setCity} />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.store} className={`rounded-xl border p-5 ${
            r.opsStatus === "RED" ? "border-danger/40 bg-danger/5"
            : r.opsStatus === "YELLOW" ? "border-warning/40 bg-warning/5"
            : "border-border bg-card"
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  {r.city} · {r.hour}
                  <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${tierStyle[r.tier]}`}>{r.tier}</span>
                </div>
                <div className="mt-1 text-lg font-semibold flex items-center gap-2">
                  <StoreIcon className="h-4 w-4 text-primary" />{r.store}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Reachable {fmtNum(r.reachableUsers)} · CR %{r.cr.toFixed(1)} (hedef %{r.crTarget.toFixed(1)})
                  {r.campaign.roi > 0 && <> · ROI {r.campaign.roi.toFixed(1)}x</>}
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${opsStyle[r.opsStatus]}`}>
                <ShieldCheck className="h-3.5 w-3.5" /> {opsLabel[r.opsStatus]}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Mini label="Forecast" value={fmtNum(r.forecast.finalForecast)} />
              <Mini label="Gerçekleşen" value={fmtNum(r.actual)} />
              <Mini label="Gap" value={fmtPct(r.gapPct)} tone={r.gapPct < 0 ? "danger" : "success"} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Mini label="Picking" value={r.picking.status} tone={r.picking.status === "RED" ? "danger" : r.picking.status === "YELLOW" ? "warning" : "success"} />
              <Mini label="Kurye" value={r.courier.status} tone={r.courier.status === "RED" ? "danger" : r.courier.status === "YELLOW" ? "warning" : "success"} />
            </div>

            <div className="mt-4 rounded-md border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Megaphone className="h-3.5 w-3.5" /> Önerilen kampanya
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${campaignStyle[r.campaign.type]}`}>{r.campaign.type}</span>
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${approvalStyle[r.campaign.approval]}`}>{r.campaign.approval}</span>
                </div>
              </div>
              <div className="mt-2 text-sm font-medium">{r.campaign.offer}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                <Users className="inline h-3 w-3 mr-1" />{r.tier} segment · {fmtNum(r.reachableUsers)} reachable
              </div>
              {r.campaign.type !== "Yok" && (
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                  <Mini label="Ek sip." value={`+${fmtNum(r.campaign.incrementalOrders)}`} />
                  <Mini label="Ek ciro" value={fmtMoney(r.campaign.incrementalRevenue)} />
                  <Mini label="ROI" value={`${r.campaign.roi.toFixed(1)}x`} />
                  <Mini label="Net" value={fmtMoney(r.campaign.netContribution)} />
                </div>
              )}
            </div>

            <div className="mt-3 rounded-md border border-border bg-background/40 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                <Activity className="h-3 w-3" /> Agent karar özeti
              </div>
              <div className="mt-1 text-foreground">{r.agentSummary}</div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Mini({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" | "warning" }) {
  const cls = { default: "text-foreground", success: "text-success", danger: "text-danger", warning: "text-warning" }[tone];
  return (
    <div className="rounded-md border border-border bg-background/50 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}
