import { Brain, GitBranch, PlayCircle, Megaphone, Sparkles, AlertTriangle, RotateCcw } from "lucide-react";

type Node = {
  id: string;
  label: string;
  sub: string;
  icon: any;
  x: number;
  y: number;
  color: string; // tailwind from-x to-y
};

const NODES: Node[] = [
  { id: "f", label: "Forecast", sub: "Talep tahmini", icon: Brain, x: 60, y: 140, color: "from-cyan-400 to-teal-600" },
  { id: "r", label: "Revision", sub: "Sapma revizyonu", icon: GitBranch, x: 240, y: 60, color: "from-emerald-400 to-green-600" },
  { id: "e", label: "Execution", sub: "Guardrail", icon: PlayCircle, x: 440, y: 140, color: "from-amber-400 to-orange-600" },
  { id: "c", label: "Campaign", sub: "ROI'li öneri", icon: Megaphone, x: 640, y: 60, color: "from-orange-400 to-red-500" },
  { id: "cr", label: "Creative", sub: "Banner / push", icon: Sparkles, x: 820, y: 140, color: "from-pink-400 to-rose-600" },
  { id: "l", label: "Loss & Root Cause", sub: "Öğrenim", icon: AlertTriangle, x: 1000, y: 60, color: "from-rose-500 to-red-700" },
];

const EDGES: Array<{ from: string; to: string; dash?: boolean }> = [
  { from: "f", to: "r" },
  { from: "r", to: "e" },
  { from: "e", to: "c" },
  { from: "c", to: "cr" },
  { from: "cr", to: "l" },
  // feedback loop
  { from: "l", to: "f", dash: true },
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

// curve between two nodes — quadratic via midpoint
function pathFor(from: Node, to: Node, feedback = false) {
  const x1 = from.x + 60;
  const y1 = from.y + 30;
  const x2 = to.x;
  const y2 = to.y + 30;

  if (feedback) {
    // big arc back at the bottom
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${x1 + 60} 280, ${cx} 320, ${x2 - 60} 280 S ${x2} ${y2 + 100}, ${x2} ${y2}`;
  }
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

export function AgentFlow() {
  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-6 overflow-hidden">
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(500px circle at 20% 0%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(500px circle at 80% 100%, rgba(244,114,182,0.10), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">Agent Orkestrasyon Akışı</div>
          <div className="text-xs text-muted-foreground">
            Forecast → Revision → Execution → Campaign → Creative → Loss & Root Cause · öğrenim geri besleniyor
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="od-live-dot" /> canlı
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 1100 360" className="w-full min-w-[900px] h-[360px]">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#ED7625" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="feedbackGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ED7625" />
            </marker>
            <marker id="arrowFb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* edges */}
          {EDGES.map((e, i) => {
            const from = nodeById(e.from);
            const to = nodeById(e.to);
            const d = pathFor(from, to, e.dash);
            return (
              <g key={i}>
                {!e.dash && (
                  <path
                    d={d}
                    stroke="url(#edgeGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.85"
                    markerEnd="url(#arrow)"
                  />
                )}
                {!e.dash && (
                  <path
                    d={d}
                    stroke="white"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="6 14"
                    style={{
                      animation: `od-flow-dash 1.6s linear infinite`,
                      animationDelay: `${i * 0.12}s`,
                    }}
                    opacity="0.9"
                  />
                )}
                {e.dash && (
                  <path
                    d={d}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5 7"
                    markerEnd="url(#arrowFb)"
                    style={{ animation: "od-flow-dash 2.2s linear infinite reverse" }}
                  />
                )}
              </g>
            );
          })}

          {/* feedback label */}
          <g transform="translate(490, 320)">
            <rect x="-90" y="-14" width="180" height="26" rx="13" fill="white" stroke="#cbd5e1" />
            <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              ↺ öğrenim geri beslemesi
            </text>
          </g>

          {/* nodes */}
          {NODES.map((n, i) => {
            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                style={{
                  opacity: 0,
                  animation: `od-fade-up 0.55s ease-out forwards`,
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                <foreignObject x="-10" y="-10" width="140" height="80">
                  <div
                    className={`flex items-center gap-2 rounded-xl bg-white border border-border shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)] px-3 py-2 backdrop-blur od-card-hover`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${n.color} text-white shadow ring-1 ring-white/30`}
                    >
                      <n.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold leading-tight truncate">{n.label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{n.sub}</div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="relative mt-2 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
        <RotateCcw className="h-3 w-3" /> Loss & Root Cause çıktısı Forecast / Campaign / Execution'a geri besleniyor
      </div>
    </div>
  );
}
