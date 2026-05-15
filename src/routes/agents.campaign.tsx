import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, opsStyle, campaignStyle, approvalStyle, tierStyle, fmtMoney, fmtNum } from "@/lib/demo-data";
import { Megaphone, Store as StoreIcon, Users, ShoppingBasket, ShieldCheck, Sparkles, Check, X, Send, AlertTriangle, Eye, Clock } from "lucide-react";
import { AgentBadge } from "./agents.forecast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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

      <ApprovalQueue items={filtered.filter((r) => r.campaign.approval === "İnsan onayı gerekli")} />

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
        {filtered.map((r) => (
          <CampaignRationaleCard key={r.store} r={r} />
        ))}
      </div>
    </AppShell>
  );
}

function CampaignRationaleCard({ r }: { r: (typeof stores)[number] }) {
  const c = r.campaign;
  const blocked = r.opsStatus === "RED" || c.approval === "Engellendi";
  const noCamp = c.type === "Yok";
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "sent">("pending");

  const onApprove = () => {
    if (blocked || noCamp) return;
    setStatus("approved");
    toast.success("Kampanya önerisi onaylandı", {
      description: `${r.store} · ${c.type} · beklenen net katkı ${fmtMoney(c.netContribution)}`,
    });
  };
  const onReject = () => {
    if (noCamp) return;
    setStatus("rejected");
    toast(`${r.store} için öneri reddedildi`, { description: "Geri besleme Campaign Agent'a iletildi." });
  };
  const onSend = () => {
    if (blocked || noCamp) return;
    setStatus("sent");
    toast.success("Cockpit'e gönderildi", {
      description: "Kampanya önerisi demo ortamında Cockpit'e gönderildi.",
    });
  };

  return (
    <div
      className={`od-card-hover rounded-xl border p-4 ${
        blocked ? "border-danger/40 bg-danger/5" : "border-border bg-card/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {r.store} · {r.city}
          </div>
          <div className="mt-1 text-sm font-semibold flex items-center gap-2 flex-wrap">
            <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${campaignStyle[c.type]}`}>{c.type}</span>
            {c.couponTier ?? c.offer}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.opsStatus]}`}>
            <ShieldCheck className="h-3 w-3 mr-1" />{r.opsStatus}
          </span>
          {status !== "pending" && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                status === "approved"
                  ? "border-success/40 bg-success/10 text-success"
                  : status === "sent"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground"
              }`}
            >
              {status === "approved" && <Check className="h-3 w-3" />}
              {status === "sent" && <Send className="h-3 w-3" />}
              {status === "rejected" && <X className="h-3 w-3" />}
              {status === "approved" ? "Onaylandı" : status === "sent" ? "Cockpit'e gönderildi" : "Reddedildi"}
            </span>
          )}
        </div>
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
            className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="h-3 w-3" /> Creative öner
          </Link>
        ) : (
          <span className="text-[11px] text-muted-foreground">Creative yok</span>
        )}
      </div>

      {!noCamp && (
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-end gap-2 flex-wrap">
          <button
            onClick={onReject}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted active:scale-95 transition-all"
          >
            <X className="h-3 w-3" /> Reddet
          </button>
          <button
            onClick={onApprove}
            disabled={blocked}
            title={blocked ? "Operasyonel guardrail nedeniyle kampanya aksiyonu engellendi." : undefined}
            className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-medium text-success hover:bg-success/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-success/10"
          >
            <Check className="h-3 w-3" /> Onayla
          </button>
          <button
            onClick={onSend}
            disabled={blocked}
            title={blocked ? "Operasyonel guardrail nedeniyle kampanya aksiyonu engellendi." : undefined}
            className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#ED7625] to-[#B8470F] px-3 py-1 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(237,118,37,0.6)] hover:shadow-[0_6px_18px_-4px_rgba(237,118,37,0.8)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="h-3 w-3" /> Cockpit Demo'ya Gönder
          </button>
        </div>
      )}
    </div>
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
