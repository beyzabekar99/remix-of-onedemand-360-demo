import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { CountUp } from "@/components/CountUp";
import { LiveStream } from "@/components/LiveStream";
import { AgentTimeline } from "@/components/AgentTimeline";
import {
  stores, opsStyle, opsLabel, campaignStyle, tierStyle, fmtMoney, fmtNum, fmtPct,
} from "@/lib/demo-data";
import {
  TrendingUp, TrendingDown, Receipt, Wallet, ShieldCheck, ShieldAlert, ShieldX,
  Activity, Percent, Megaphone, Store as StoreIcon, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Talep İzleme — OneDemand 360" },
      { name: "description", content: "13 MMM mağazası için saatlik talep, operasyon ve kampanya görünümü." },
    ],
  }),
});

function Kpi({
  icon: Icon, label, value, hint, tone = "default",
}: {
  icon: any; label: string; value: React.ReactNode; hint?: string;
  tone?: "default" | "success" | "danger" | "warning";
}) {
  const cls = {
    default: "text-foreground", success: "text-success",
    danger: "text-danger", warning: "text-warning",
  }[tone];
  return (
    <div className="od-card-hover rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />{label}
      </div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${cls}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Hero() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border p-6 md:p-8 mb-6 text-white shadow-[0_20px_60px_-20px_rgba(237,118,37,0.45)]"
      style={{
        background: "linear-gradient(135deg, #ED7625 0%, #F39455 45%, #B8470F 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(500px circle at 80% 20%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(400px circle at 10% 90%, rgba(0,0,0,0.25), transparent 50%)",
        }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium backdrop-blur">
            <Sparkles className="h-3 w-3" /> AI Control Tower · canlı demo
          </span>
          <h1 className="mt-3 text-2xl md:text-4xl font-semibold leading-tight tracking-tight">
            OneDemand 360 AI Control Tower
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/85">
            Forecast, kampanya, operasyon ve kayıp analizi agent'ları tek ekranda.
          </p>
        </div>
        <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 px-4 py-3 text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="od-live-dot" />
            <span className="font-semibold">5 agent aktif</span>
          </div>
          <div className="text-white/80">Son güncelleme: <span className="tabular-nums">şimdi</span></div>
          <div className="text-white/80">13 mağaza · 5 şehir · 5 segment</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  const totForecast = filtered.reduce((s, r) => s + r.forecast.finalForecast, 0);
  const totActual = filtered.reduce((s, r) => s + r.actual, 0);
  const totEod = filtered.reduce((s, r) => s + r.revision.endOfDayProjection, 0);
  const totIncOrders = filtered.reduce((s, r) => s + r.campaign.incrementalOrders, 0);
  const totIncRev = filtered.reduce((s, r) => s + r.campaign.incrementalRevenue, 0);
  const avgCr = filtered.reduce((s, r) => s + r.cr, 0) / Math.max(filtered.length, 1);
  const active = filtered.filter((r) => r.campaign.roi > 0);
  const avgRoi = active.length ? active.reduce((s, r) => s + r.campaign.roi, 0) / active.length : 0;
  const green = filtered.filter((r) => r.opsStatus === "GREEN").length;
  const yellow = filtered.filter((r) => r.opsStatus === "YELLOW").length;
  const red = filtered.filter((r) => r.opsStatus === "RED").length;
  const gap = totForecast > 0 ? ((totActual - totForecast) / totForecast) * 100 : 0;

  return (
    <AppShell>
      <Hero />

      <PageHeader
        title="Talep İzleme Paneli"
        subtitle="≈ 140K günlük forecast · 13 MMM mağazası · saatlik agent koordinasyonu"
        right={<CityFilter value={city} onChange={setCity} />}
      />

      <div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi icon={TrendingUp} label="Toplam forecast" value={<CountUp value={totForecast} />} hint="Günlük plan" />
        <Kpi icon={Activity} label="Gerçekleşen" value={<CountUp value={totActual} />} hint={`Gün sonu: ${fmtNum(totEod)}`} />
        <Kpi icon={TrendingDown} label="Gap" value={<CountUp value={gap} decimals={1} suffix="%" />} tone={gap < -5 ? "danger" : gap < 0 ? "warning" : "success"} />
        <Kpi icon={Receipt} label="Beklenen ek sipariş" value={<CountUp value={totIncOrders} prefix="+" />} tone="success" />
        <Kpi icon={Wallet} label="Beklenen ek ciro" value={<CountUp value={totIncRev} format={(n) => fmtMoney(n)} />} tone="success" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi icon={Percent} label="Ortalama CR" value={<CountUp value={avgCr} decimals={2} prefix="%" />} />
        <Kpi icon={TrendingUp} label="Ortalama ROI" value={avgRoi > 0 ? <CountUp value={avgRoi} decimals={1} suffix="x" /> : "—"} />
        <Kpi icon={ShieldCheck} label="GREEN mağaza" value={<CountUp value={green} />} tone="success" />
        <Kpi icon={ShieldAlert} label="YELLOW mağaza" value={<CountUp value={yellow} />} tone="warning" />
        <Kpi icon={ShieldX} label="RED mağaza" value={<CountUp value={red} />} tone="danger" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm font-medium">Mağaza Performansı</div>
              <div className="text-xs text-muted-foreground">Operasyon RED satırlar kırmızı uyarıyla vurgulanır</div>
            </div>
            <CityFilter value={city} onChange={setCity} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 text-left">Mağaza</th>
                  <th className="px-3 py-3 text-left">İl</th>
                  <th className="px-3 py-3 text-left">Segment</th>
                  <th className="px-3 py-3 text-right">Forecast</th>
                  <th className="px-3 py-3 text-right">Gerçek / Proj.</th>
                  <th className="px-3 py-3 text-right">Gap %</th>
                  <th className="px-3 py-3 text-right">CR</th>
                  <th className="px-3 py-3 text-right">ROI</th>
                  <th className="px-3 py-3 text-left">Kampanya</th>
                  <th className="px-3 py-3 text-left">Picking</th>
                  <th className="px-3 py-3 text-left">Kurye</th>
                  <th className="px-3 py-3 text-left">Operasyon</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const rowTone =
                    r.opsStatus === "RED" ? "bg-danger/5 hover:bg-danger/10"
                    : r.opsStatus === "YELLOW" ? "bg-warning/5 hover:bg-warning/10"
                    : "hover:bg-accent/40";
                  return (
                    <tr key={r.store} className={`border-t border-border transition-colors ${rowTone}`}>
                      <td className="px-3 py-3 font-medium"><StoreIcon className="inline h-3.5 w-3.5 mr-1 text-primary" />{r.store}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{r.city}</td>
                      <td className="px-3 py-3"><span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${tierStyle[r.tier]}`}>{r.tier}</span></td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtNum(r.forecast.finalForecast)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {fmtNum(r.actual)}
                        <div className="text-[11px] text-muted-foreground">→ {fmtNum(r.revision.endOfDayProjection)}</div>
                      </td>
                      <td className={`px-3 py-3 text-right tabular-nums font-medium ${r.gapPct < 0 ? "text-danger" : "text-success"}`}>
                        {fmtPct(r.gapPct)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">%{r.cr.toFixed(1)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.campaign.roi > 0 ? `${r.campaign.roi.toFixed(1)}x` : "—"}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${campaignStyle[r.campaign.type]}`}>
                          <Megaphone className="h-3 w-3" />{r.campaign.type}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.picking.status]}`}>{r.picking.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${opsStyle[r.courier.status]}`}>{r.courier.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${opsStyle[r.opsStatus]}`}>{opsLabel[r.opsStatus]}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-5 py-3 text-right">
            <Link to="/summary" className="text-xs font-medium text-primary hover:underline">Mağaza özetine git →</Link>
          </div>
        </div>

        <div className="space-y-4">
          <AgentTimeline />
          <LiveStream />
        </div>
      </div>
    </AppShell>
  );
}
