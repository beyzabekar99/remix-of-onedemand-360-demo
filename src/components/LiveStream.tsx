import { useEffect, useState } from "react";
import { Brain, GitBranch, PlayCircle, Megaphone, AlertTriangle, Sparkles } from "lucide-react";

const POOL = [
  { icon: Brain, agent: "Forecast Agent", text: "Haziran forecast'i güncellendi (+2,1%)", tone: "primary" },
  { icon: GitBranch, agent: "Revision Agent", text: "İstanbul Avrupa'da -%5,8 sapma tespit edildi", tone: "warning" },
  { icon: PlayCircle, agent: "Execution Agent", text: "Ankara bölgesi Protect moduna alındı", tone: "danger" },
  { icon: Megaphone, agent: "Campaign Agent", text: "İzmir Karşıyaka için ücretsiz teslimat önerildi", tone: "primary" },
  { icon: AlertTriangle, agent: "Loss & Root Cause", text: "Kurye kaynaklı 112 kaçan sipariş hesaplandı", tone: "danger" },
  { icon: Brain, agent: "Forecast Agent", text: "Yağış sinyali ile İstanbul katsayısı 1.08'e çekildi", tone: "primary" },
  { icon: Sparkles, agent: "Creative Agent", text: "3 banner varyasyonu üretildi (CTR ~%4.2)", tone: "primary" },
  { icon: GitBranch, agent: "Revision Agent", text: "Bursa için EOD projeksiyonu +180 sipariş revize", tone: "success" },
  { icon: Megaphone, agent: "Campaign Agent", text: "Ankara için kampanya ROI < 1, kampanya engellendi", tone: "danger" },
  { icon: PlayCircle, agent: "Execution Agent", text: "İzmir havuz H009 için +6 kurye çağrıldı", tone: "warning" },
];

const toneCls: Record<string, string> = {
  primary: "text-primary bg-primary/10 border-primary/30",
  warning: "text-warning bg-warning/10 border-warning/30",
  danger: "text-danger bg-danger/10 border-danger/30",
  success: "text-success bg-success/10 border-success/30",
};

type Item = (typeof POOL)[number] & { id: number; time: string };

function nowStr() {
  const d = new Date();
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function LiveStream() {
  const [items, setItems] = useState<Item[]>(() =>
    POOL.slice(0, 5).map((p, i) => ({ ...p, id: i, time: nowStr() })),
  );

  useEffect(() => {
    let id = items.length;
    const t = setInterval(() => {
      const pick = POOL[Math.floor(Math.random() * POOL.length)];
      setItems((prev) => [{ ...pick, id: id++, time: nowStr() }, ...prev].slice(0, 7));
    }, 2600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-card to-muted/40">
        <div className="flex items-center gap-2">
          <span className="od-live-dot" />
          <div className="text-sm font-semibold">Canlı Demo Akışı</div>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Agent kararları</div>
      </div>
      <ul className="divide-y divide-border/60 max-h-[420px] overflow-hidden">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.id} className="od-stream-row flex items-start gap-3 px-4 py-2.5">
              <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border ${toneCls[it.tone]}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-xs font-semibold truncate">{it.agent}</div>
                  <div className="text-[10px] font-mono text-muted-foreground shrink-0">{it.time}</div>
                </div>
                <div className="text-xs text-muted-foreground leading-snug">{it.text}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
