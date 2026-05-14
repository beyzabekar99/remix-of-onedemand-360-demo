import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, opsStyle, campaignStyle, approvalStyle, tierStyle, fmtMoney, fmtNum } from "@/lib/demo-data";
import { Megaphone, Store as StoreIcon, Users, ShoppingBasket, ShieldCheck, Sparkles } from "lucide-react";
import { AgentBadge } from "./agents.forecast";

export const Route = createFileRoute("/agents/campaign")({
  component: CampaignAgentPage,
  head: () => ({
    meta: [
      { title: "Campaign Agent — OneDemand 360" },
      { name: "description", content: "Mağaza/segment bazlı kupon ve ücretsiz teslimat önerileri." },
    ],
  }),
});

function CampaignAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  const auto = filtered.filter((r) => r.campaign.approval === "Otomatik onaylandı").length;
  const pending = filtered.filter((r) => r.campaign.approval === "İnsan onayı gerekli").length;
  const blocked = filtered.filter((r) => r.campaign.approval === "Engellendi").length;
  const totalNet = filtered.reduce((s, r) => s + r.campaign.netContribution, 0);
  const totalReach = filtered.reduce((s, r) => s + (r.campaign.type !== "Yok" ? r.reachableUsers : 0), 0);

  return (
    <AppShell>
      <PageHeader
        title="Campaign Agent"
        subtitle="Mağaza segmenti × CR boşluğu × operasyon guardrail bağlamında öneri"
        right={<AgentBadge icon={Megaphone} label={`${auto} otomatik · ${pending} onayda · ${blocked} engellendi`} tone="success" />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Otomatik onaylı" value={String(auto)} tone="success" />
        <Kpi label="İnsan onayında" value={String(pending)} tone="warning" />
        <Kpi label="Toplam reachable" value={fmtNum(totalReach)} tone="info" />
        <Kpi label="Beklenen net katkı" value={fmtMoney(totalNet)} tone="success" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm font-medium">Mağaza × kampanya önerileri</div>
          <CityFilter value={city} onChange={setCity} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Mağaza</th>
                <th className="px-3 py-3 text-left">İl</th>
                <th className="px-3 py-3 text-left">Segment</th>
                <th className="px-3 py-3 text-right">Reachable</th>
                <th className="px-3 py-3 text-left">Tip</th>
                <th className="px-3 py-3 text-left">Önerilen offer</th>
                <th className="px-3 py-3 text-right">Min. sepet</th>
                <th className="px-3 py-3 text-right">Ek sip.</th>
                <th className="px-3 py-3 text-right">Ek ciro</th>
                <th className="px-3 py-3 text-right">CR etki</th>
                <th className="px-3 py-3 text-right">ROI</th>
                <th className="px-3 py-3 text-right">Net katkı</th>
                <th className="px-3 py-3 text-left">Onay</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const c = r.campaign;
                const noCamp = c.type === "Yok";
                return (
                  <tr key={r.store} className={`border-t border-border align-top ${noCamp ? "bg-muted/20" : "hover:bg-accent/30"}`}>
                    <td className="px-3 py-3 font-medium"><StoreIcon className="inline h-3.5 w-3.5 mr-1 text-primary" />{r.store}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.city}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${tierStyle[r.tier]}`}>{r.tier}</span></td>
                    <td className="px-3 py-3 text-right tabular-nums">{noCamp ? "—" : fmtNum(r.reachableUsers)}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${campaignStyle[c.type]}`}>{c.type}</span></td>
                    <td className="px-3 py-3 text-xs">
                      {c.couponTier && <div className="font-medium">{c.couponTier}</div>}
                      <div className="text-muted-foreground">{c.offer}</div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.minBasket > 0 ? `${c.minBasket} ₺` : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">{c.incrementalOrders > 0 ? `+${fmtNum(c.incrementalOrders)}` : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">{c.incrementalRevenue > 0 ? fmtMoney(c.incrementalRevenue) : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.crImpactPct > 0 ? `+${c.crImpactPct.toFixed(1)} pp` : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.roi > 0 ? `${c.roi.toFixed(1)}x` : "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{c.netContribution > 0 ? fmtMoney(c.netContribution) : "—"}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${approvalStyle[c.approval]}`}>{c.approval}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mağaza segmentleri</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.store} className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <StoreIcon className="h-3.5 w-3.5 text-primary" />{r.store}
              </div>
              <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${tierStyle[r.tier]}`}>{r.tier}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reachable</div>
                <div className="text-sm font-semibold tabular-nums">{fmtNum(r.reachableUsers)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">CR / Hedef</div>
                <div className="text-sm font-semibold tabular-nums">%{r.cr.toFixed(1)} / %{r.crTarget.toFixed(1)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agent gerekçeleri</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((r) => {
          const c = r.campaign;
          const disabled = c.approval === "Engellendi";
          return (
            <div key={r.store} className={`rounded-xl border p-4 ${disabled ? "border-danger/40 bg-danger/5" : "border-border bg-card"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.store} · {r.city}</div>
                  <div className="mt-1 text-sm font-semibold flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${campaignStyle[c.type]}`}>{c.type}</span>
                    {c.couponTier ?? c.offer}
                  </div>
                </div>
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.opsStatus]}`}>
                  <ShieldCheck className="h-3 w-3 mr-1" />{r.opsStatus}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.rationale}</div>
              <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                  <span><ShoppingBasket className="inline h-3 w-3 mr-1" />Min sepet {c.minBasket > 0 ? `${c.minBasket} ₺` : "—"}</span>
                  {c.type !== "Yok" && (
                    <span><Users className="inline h-3 w-3 mr-1" />{fmtNum(r.reachableUsers)} reachable</span>
                  )}
                </div>
                {c.creative ? (
                  <Link
                    to="/agents/creative"
                    className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    <Sparkles className="h-3 w-3" /> Creative öner
                  </Link>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Creative yok</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "danger" | "info" }) {
  const cls = { success: "text-success", warning: "text-warning", danger: "text-danger", info: "text-primary" }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}
