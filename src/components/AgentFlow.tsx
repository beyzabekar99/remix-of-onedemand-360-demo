import {
  Brain, GitBranch, PlayCircle, Megaphone, Sparkles, AlertTriangle,
  Database, Cloud, CalendarDays, Users, Truck, ShoppingBasket,
  MonitorSmartphone, Store, Smartphone, RotateCcw,
} from "lucide-react";

type AgentNode = {
  id: string;
  label: string;
  sub: string;
  icon: any;
  x: number;
  y: number;
  color: string;
};

const NODES: AgentNode[] = [
  { id: "f",  label: "Forecast",       sub: "Talep tahmini",       icon: Brain,         x: 220, y: 110, color: "from-cyan-400 to-teal-600" },
  { id: "r",  label: "Revision",       sub: "Sapma revizyonu",      icon: GitBranch,     x: 420, y: 40,  color: "from-emerald-400 to-green-600" },
  { id: "e",  label: "Execution",      sub: "Operasyon guardrail",  icon: PlayCircle,    x: 620, y: 110, color: "from-amber-400 to-orange-600" },
  { id: "c",  label: "Campaign",       sub: "ROI'li öneri",         icon: Megaphone,     x: 820, y: 40,  color: "from-orange-400 to-red-500" },
  { id: "cr", label: "Creative",       sub: "Banner / push / inApp",icon: Sparkles,      x: 1020,y: 110, color: "from-pink-400 to-rose-600" },
  { id: "l",  label: "Loss & RC",      sub: "Kayıp & öğrenim",      icon: AlertTriangle, x: 1220,y: 40,  color: "from-rose-500 to-red-700" },
];

const EDGES: Array<{ from: string; to: string; label: string; mid?: { x: number; y: number } }> = [
  { from: "f",  to: "r",  label: "forecast" },
  { from: "r",  to: "e",  label: "revize plan" },
  { from: "e",  to: "c",  label: "GREEN sinyali" },
  { from: "c",  to: "cr", label: "kampanya brief" },
  { from: "cr", to: "l",  label: "kreatif çıktı" },
];

const INPUTS = [
  { icon: Database,       label: "Sipariş & ciro" },
  { icon: Users,          label: "Aktif müşteri" },
  { icon: Cloud,          label: "Hava sinyali" },
  { icon: CalendarDays,   label: "Özel gün" },
  { icon: Truck,          label: "Kurye KPI" },
  { icon: ShoppingBasket, label: "Picking KPI" },
];

const OUTPUTS = [
  { icon: MonitorSmartphone, label: "AI Cockpit",     sub: "operasyon" },
  { icon: Store,             label: "Mağaza ekranı",  sub: "yönetici" },
  { icon: Smartphone,        label: "Migros app",     sub: "müşteri" },
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function pathFor(from: AgentNode, to: AgentNode) {
  const x1 = from.x + 60;
  const y1 = from.y + 30;
  const x2 = to.x;
  const y2 = to.y + 30;
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

function midPoint(from: AgentNode, to: AgentNode) {
  return { x: (from.x + 60 + to.x) / 2, y: (from.y + to.y) / 2 + 30 };
}

export function AgentFlow() {
  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 -z-0"
        style={{
          background:
            "radial-gradient(500px circle at 15% 0%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(500px circle at 85% 100%, rgba(244,114,182,0.10), transparent 55%)",
        }}
      />

      <div className="relative flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-sm font-semibold">Agent Orkestrasyon Akışı</div>
          <div className="text-xs text-muted-foreground">
            Girdi sinyalleri → 6 uzman agent → operasyon, mağaza ve müşteri kanalları · öğrenim geri besleniyor
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="od-live-dot" /> canlı
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 1380 460" className="w-full min-w-[1100px] h-[460px]">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#ED7625" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ED7625" />
            </marker>
            <marker id="arrowIn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker id="arrowFb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Section labels */}
          <text x="60" y="20" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="1.5">
            GİRDİ SİNYALLERİ
          </text>
          <text x="610" y="20" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="1.5">
            AGENT ORKESTRA
          </text>
          <text x="1240" y="20" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="1.5" textAnchor="end">
            ÇIKTI KANALLARI
          </text>

          {/* Vertical separators (dashed) */}
          <line x1="190" y1="30" x2="190" y2="380" stroke="#cbd5e1" strokeDasharray="4 6" />
          <line x1="1190" y1="30" x2="1190" y2="380" stroke="#cbd5e1" strokeDasharray="4 6" />

          {/* Input feed lines into Forecast */}
          {INPUTS.map((_, i) => {
            const y = 50 + i * 50;
            return (
              <path
                key={`in-${i}`}
                d={`M 175 ${y} C 200 ${y}, 220 140, 240 140`}
                stroke="#94a3b8"
                strokeWidth="1.4"
                fill="none"
                strokeDasharray="4 6"
                style={{ animation: `od-flow-dash 2.4s linear infinite`, animationDelay: `${i * 0.1}s` }}
                markerEnd="url(#arrowIn)"
                opacity="0.7"
              />
            );
          })}

          {/* Input pills (foreignObject) */}
          {INPUTS.map((s, i) => {
            const Icon = s.icon;
            return (
              <foreignObject key={s.label} x="20" y={30 + i * 50} width="160" height="40">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 shadow-sm">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-slate-400 to-slate-600 text-white">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="text-[11px] font-medium leading-tight">{s.label}</div>
                </div>
              </foreignObject>
            );
          })}

          {/* Edges between agents */}
          {EDGES.map((e, i) => {
            const from = nodeById(e.from);
            const to = nodeById(e.to);
            const d = pathFor(from, to);
            const m = midPoint(from, to);
            const labelW = e.label.length * 6.2 + 14;
            return (
              <g key={i}>
                <path d={d} stroke="url(#edgeGrad)" strokeWidth="2.5" fill="none" opacity="0.85" markerEnd="url(#arrow)" />
                <path
                  d={d}
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6 14"
                  style={{ animation: `od-flow-dash 1.6s linear infinite`, animationDelay: `${i * 0.12}s` }}
                  opacity="0.9"
                />
                <g transform={`translate(${m.x}, ${m.y - 4})`}>
                  <rect x={-labelW / 2} y={-9} width={labelW} height={18} rx={9} fill="white" stroke="#e2e8f0" />
                  <text x={0} y={3} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600">
                    {e.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Feedback loop: Loss → Forecast (under everything) */}
          <path
            d={`M ${1220 + 60} ${40 + 30} C 1300 380, 700 430, 280 380 S 240 ${110 + 30}, ${220} ${110 + 30}`}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 7"
            markerEnd="url(#arrowFb)"
            style={{ animation: "od-flow-dash 2.6s linear infinite reverse" }}
          />
          <g transform="translate(720, 410)">
            <rect x="-130" y="-13" width="260" height="26" rx="13" fill="white" stroke="#cbd5e1" />
            <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              ↺ öğrenim geri beslemesi (Loss → Forecast / Campaign)
            </text>
          </g>

          {/* Agent nodes */}
          {NODES.map((n, i) => (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              style={{
                opacity: 0,
                animation: `od-fade-up 0.55s ease-out forwards`,
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <foreignObject x="-10" y="-10" width="160" height="80">
                <div className="flex items-center gap-2 rounded-xl bg-white border border-border shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)] px-3 py-2 backdrop-blur od-card-hover">
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${n.color} text-white shadow ring-1 ring-white/30`}>
                    <n.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold leading-tight truncate">{n.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{n.sub}</div>
                  </div>
                </div>
              </foreignObject>
            </g>
          ))}

          {/* Output channels (right column) */}
          {OUTPUTS.map((o, i) => {
            const Icon = o.icon;
            const y = 70 + i * 90;
            return (
              <g key={o.label}>
                {/* feed line from Loss → output channels */}
                <path
                  d={`M ${1220 + 60} ${40 + 30} C 1240 ${40 + 30}, 1220 ${y + 20}, 1210 ${y + 20}`}
                  stroke="#cbd5e1"
                  strokeWidth="1.4"
                  fill="none"
                  strokeDasharray="4 6"
                  style={{ animation: `od-flow-dash 2.4s linear infinite`, animationDelay: `${i * 0.15}s` }}
                  markerEnd="url(#arrowIn)"
                />
                <foreignObject x="1210" y={y} width="160" height="50">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-2 shadow-sm">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#ED7625] to-[#B8470F] text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold leading-tight truncate">{o.label}</div>
                      <div className="text-[10px] text-muted-foreground">{o.sub}</div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="relative mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground flex-wrap">
        <div className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-6 rounded bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500" />
          ileri akış (forecast → kayıp)
        </div>
        <div className="inline-flex items-center gap-1.5">
          <RotateCcw className="h-3 w-3" /> Loss & Root Cause çıktısı Forecast / Campaign'e geri besleniyor
        </div>
      </div>
    </div>
  );
}
