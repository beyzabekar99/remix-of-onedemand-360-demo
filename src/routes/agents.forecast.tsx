import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, fmtNum } from "@/lib/demo-data";
import { Brain, TrendingUp, Users, Percent, Megaphone, CloudRain, PartyPopper, Store as StoreIcon } from "lucide-react";

export const Route = createFileRoute("/agents/forecast")({
  component: ForecastAgentPage,
  head: () => ({
    meta: [
      { title: "Forecast Agent — OneDemand 360" },
      { name: "description", content: "≈140K siparişin mağaza bazlı forecast dekompozisyonu." },
    ],
  }),
});

const SIGNAL_LABELS = {
  baseOrders: { label: "Baz sipariş", icon: TrendingUp, color: "from-slate-400 to-slate-700" },
  activeCustomerImpact: { label: "Aktif müşteri etkisi", icon: Users, color: "from-cyan-400 to-blue-600" },
  crImpact: { label: "CR etkisi", icon: Percent, color: "from-violet-400 to-fuchsia-600" },
  campaignImpact: { label: "Kampanya etkisi", icon: Megaphone, color: "from-orange-400 to-red-500" },
  weatherImpact: { label: "Hava etkisi", icon: CloudRain, color: "from-sky-400 to-indigo-600" },
  specialDayImpact: { label: "Özel gün etkisi", icon: PartyPopper, color: "from-pink-400 to-rose-600" },
} as const;

function ForecastAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  const totalBase = filtered.reduce((s, r) => s + r.forecast.baseOrders, 0);
  const totalCampaign = filtered.reduce((s, r) => s + r.forecast.campaignImpact, 0);
  const totalWeather = filtered.reduce((s, r) => s + r.forecast.weatherImpact, 0);
  const totalSpecial = filtered.reduce((s, r) => s + r.forecast.specialDayImpact, 0);
  const totalForecast = filtered.reduce((s, r) => s + r.forecast.finalForecast, 0);

  return (
    <AppShell>
      <PageHeader
        title="Forecast Agent"
        subtitle="Geçmiş trend + aktif müşteri + CR + kampanya + hava + özel gün → mağaza bazlı dağıtım"
        right={<AgentBadge icon={Brain} label={`${filtered.length} mağaza analiz edildi`} tone="info" />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Toplam forecast" value={fmtNum(totalForecast)} hint={`${filtered.length} mağaza`} />
        <Card label="Baz sipariş" value={fmtNum(totalBase)} hint="Trend bileşeni" />
        <Card label="Kampanya etkisi" value={`+${fmtNum(totalCampaign)}`} tone="success" />
        <Card label="Hava + özel gün" value={`+${fmtNum(totalWeather + totalSpecial)}`} tone="success" />
      </div>

      {/* Decomposition waterfall */}
      <div className="mt-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Forecast Decomposition · waterfall</div>
            <div className="text-xs text-muted-foreground">
              Her sinyalin toplam forecast'e katkısı (animasyonlu)
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="od-live-dot od-live-dot-orange" /> canlı analiz
          </span>
        </div>
        <DecompositionBars
          rows={(Object.keys(SIGNAL_LABELS) as Array<keyof typeof SIGNAL_LABELS>).map((k) => ({
            key: k,
            ...SIGNAL_LABELS[k],
            value: filtered.reduce((s, r) => s + r.forecast[k], 0),
          }))}
          total={totalForecast}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-medium">Forecast Decomposition</div>
            <div className="text-xs text-muted-foreground">
              Baz + Aktif müşteri + CR + Kampanya + Hava + Özel gün = Final forecast
            </div>
          </div>
          <CityFilter value={city} onChange={setCity} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Mağaza</th>
                <th className="px-3 py-3 text-left">İl</th>
                <th className="px-3 py-3 text-right">Baz</th>
                <th className="px-3 py-3 text-right">Aktif müşteri</th>
                <th className="px-3 py-3 text-right">CR</th>
                <th className="px-3 py-3 text-right">Kampanya</th>
                <th className="px-3 py-3 text-right">Hava</th>
                <th className="px-3 py-3 text-right">Özel gün</th>
                <th className="px-3 py-3 text-right">Final forecast</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const f = r.forecast;
                return (
                  <tr key={r.store} className="border-t border-border hover:bg-accent/30">
                    <td className="px-3 py-3 font-medium"><StoreIcon className="inline h-3.5 w-3.5 mr-1 text-primary" />{r.store}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.city}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(f.baseOrders)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">+{fmtNum(f.activeCustomerImpact)}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${f.crImpact < 0 ? "text-danger" : "text-success"}`}>
                      {f.crImpact > 0 ? "+" : ""}{fmtNum(f.crImpact)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">+{fmtNum(f.campaignImpact)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">+{fmtNum(f.weatherImpact)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-success">+{fmtNum(f.specialDayImpact)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{fmtNum(f.finalForecast)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(SIGNAL_LABELS) as Array<keyof typeof SIGNAL_LABELS>).map((k) => {
          const meta = SIGNAL_LABELS[k];
          const total = filtered.reduce((s, r) => s + r.forecast[k], 0);
          const Icon = meta.icon;
          return (
            <div key={k} className="rounded-md border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3 w-3" />{meta.label}
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">
                {total > 0 ? "+" : ""}{fmtNum(total)}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Card({ label, value, hint, tone = "default" }: { label: string; value: string; hint?: string; tone?: "default" | "success" }) {
  const cls = tone === "success" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${cls}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function AgentBadge({ icon: Icon, label, tone }: { icon: any; label: string; tone: "info" | "success" | "warning" | "danger" }) {
  const cls = {
    info: "bg-primary/10 text-primary border-primary/30",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    danger: "bg-danger/15 text-danger border-danger/30",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${cls}`}>
      <Icon className="h-3.5 w-3.5" />{label}
    </span>
  );
}
