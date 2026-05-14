import { useEffect, useState } from "react";
import { Brain, GitBranch, PlayCircle, Megaphone, AlertTriangle, Check, Loader2 } from "lucide-react";

const STEPS = [
  { icon: Brain, name: "Forecast", desc: "Talep tahmini üretiliyor" },
  { icon: GitBranch, name: "Revision", desc: "Sapmalar revize ediliyor" },
  { icon: PlayCircle, name: "Execution", desc: "Guardrail kontrol ediliyor" },
  { icon: Megaphone, name: "Campaign", desc: "Aksiyon önerisi hazırlanıyor" },
  { icon: AlertTriangle, name: "Loss & Root Cause", desc: "Öğrenim geri besleniyor" },
];

export function AgentTimeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % (STEPS.length + 1)), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold">Agent Karar Zinciri</div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="od-live-dot od-live-dot-orange" /> canlı
        </div>
      </div>
      <ol className="relative space-y-3">
        <span className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-border" />
        {STEPS.map((s, i) => {
          const done = i < active;
          const running = i === active;
          const Icon = s.icon;
          return (
            <li key={s.name} className="relative flex items-start gap-3 pl-0">
              <span
                className={[
                  "relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 transition-all",
                  done
                    ? "bg-success/15 border-success text-success"
                    : running
                      ? "bg-gradient-to-br from-[#ED7625] to-[#B8470F] border-transparent text-white shadow-[0_0_0_4px_rgba(237,118,37,0.18)]"
                      : "bg-muted border-border text-muted-foreground",
                ].join(" ")}
              >
                {done ? <Check className="h-4 w-4" /> : running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{s.name} Agent</div>
                  <span
                    className={[
                      "text-[10px] rounded px-1.5 py-0.5 border",
                      done
                        ? "border-success/40 bg-success/10 text-success"
                        : running
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {done ? "tamamlandı" : running ? "analiz ediliyor" : "bekliyor"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
