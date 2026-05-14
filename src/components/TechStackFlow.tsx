import { Database, Brain, Workflow, Sparkles, MonitorPlay, Layers } from "lucide-react";

const STACK = [
  { id: 1, name: "BigQuery", desc: "Sipariş, müşteri, kampanya, hava ve operasyon sinyalleri", icon: Database, color: "from-blue-400 to-blue-700" },
  { id: 2, name: "Forecast Modeli", desc: "Mağaza × saat × segment bazlı talep tahmini (LightGBM + uplift)", icon: Brain, color: "from-cyan-400 to-teal-600" },
  { id: 3, name: "n8n Orchestration", desc: "Agent çağrıları, koşullar, retry ve event akışı", icon: Workflow, color: "from-emerald-400 to-green-600" },
  { id: 4, name: "AI Agent Karar Katmanı", desc: "6 uzman agent: forecast, revision, execution, campaign, creative, loss", icon: Sparkles, color: "from-pink-400 to-rose-600" },
  { id: 5, name: "Cockpit Aksiyonu", desc: "Kampanya yayını, kupon basımı, kurye çağrısı", icon: MonitorPlay, color: "from-amber-400 to-orange-600" },
  { id: 6, name: "Lovable Demo Frontend", desc: "AI Control Tower · canlı izleme ve karar onayı", icon: Layers, color: "from-fuchsia-400 to-purple-700" },
];

export function TechStackFlow() {
  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 overflow-hidden">
      <div className="mb-4">
        <div className="text-sm font-semibold">Teknoloji Akışı</div>
        <div className="text-xs text-muted-foreground">
          Veriden aksiyona — BigQuery → Forecast → n8n → AI Agents → Cockpit → Demo Frontend
        </div>
      </div>

      <ol className="relative grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {STACK.map((s, i) => (
          <li
            key={s.id}
            className="od-card-hover relative rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-3"
            style={{ animation: "od-fade-up 0.55s ease-out both", animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow ring-1 ring-white/30`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">0{s.id}</span>
            </div>
            <div className="mt-2 text-sm font-semibold">{s.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{s.desc}</div>
            {i < STACK.length - 1 && (
              <span
                aria-hidden
                className="hidden md:block absolute top-1/2 -right-1.5 h-px w-3 bg-gradient-to-r from-primary/40 to-transparent"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
