import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import { stores, tierStyle, campaignStyle, fmtNum, type StoreRow, type CreativeAsset } from "@/lib/demo-data";
import { Sparkles, Bell, Smartphone, Mail, MonitorSmartphone, Download, Store as StoreIcon } from "lucide-react";
import { AgentBadge } from "./agents.forecast";

export const Route = createFileRoute("/agents/creative")({
  component: CreativeAgentPage,
  head: () => ({
    meta: [
      { title: "Creative Agent — OneDemand 360" },
      { name: "description", content: "Onaylı kampanyalar için banner görseli ve push metni önerileri." },
    ],
  }),
});

const channelIcon = {
  Push: Bell,
  InApp: Smartphone,
  Email: Mail,
  Banner: MonitorSmartphone,
} as const;

// ----- SVG Banner -----
const BANNER_W = 1200;
const BANNER_H = 630;

function buildSvg(store: StoreRow, c: CreativeAsset): string {
  // Migros turuncu palet
  const orange = "#ED7625";
  const orangeDark = "#C95B12";
  const cream = "#FFF6EE";
  const ink = "#1A1A1A";
  const white = "#FFFFFF";

  // text wrapping for headline
  const words = c.bannerHeadline.split(" ");
  const lines: string[] = [];
  let cur = "";
  const max = 22;
  words.forEach((w) => {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  });
  if (cur) lines.push(cur);
  const headlineLines = lines.slice(0, 3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BANNER_W} ${BANNER_H}" width="${BANNER_W}" height="${BANNER_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${cream}"/>
      <stop offset="100%" stop-color="${white}"/>
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${orange}"/>
      <stop offset="100%" stop-color="${orangeDark}"/>
    </linearGradient>
  </defs>
  <rect width="${BANNER_W}" height="${BANNER_H}" fill="url(#bg)"/>
  <!-- decorative shapes -->
  <circle cx="${BANNER_W - 120}" cy="120" r="280" fill="${orange}" opacity="0.10"/>
  <circle cx="${BANNER_W - 60}" cy="${BANNER_H - 80}" r="160" fill="${orange}" opacity="0.18"/>
  <circle cx="${BANNER_W - 200}" cy="${BANNER_H - 200}" r="80" fill="${orangeDark}" opacity="0.20"/>
  <!-- left orange ribbon -->
  <rect x="0" y="0" width="14" height="${BANNER_H}" fill="url(#orangeGrad)"/>
  <!-- Migros One badge -->
  <g transform="translate(60, 60)">
    <rect width="180" height="44" rx="22" fill="${orange}"/>
    <text x="90" y="29" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700" fill="${white}" text-anchor="middle">Migros One</text>
  </g>
  <!-- store badge -->
  <g transform="translate(60, 124)">
    <rect width="${(store.store.length * 11) + 40}" height="34" rx="17" fill="${white}" stroke="${orange}" stroke-width="2"/>
    <text x="20" y="23" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="600" fill="${orange}">${escapeXml(store.store)}</text>
  </g>
  <!-- headline -->
  ${headlineLines.map((ln, i) => `<text x="60" y="${260 + i * 78}" font-family="Inter, system-ui, sans-serif" font-size="68" font-weight="800" fill="${ink}" letter-spacing="-1.5">${escapeXml(ln)}</text>`).join("\n")}
  <!-- subline -->
  <text x="60" y="${260 + headlineLines.length * 78 + 36}" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="500" fill="${ink}" opacity="0.75">${escapeXml(c.bannerSub)}</text>
  <!-- CTA button -->
  <g transform="translate(60, ${BANNER_H - 110})">
    <rect width="${(c.bannerCta.length * 14) + 60}" height="64" rx="32" fill="${orange}"/>
    <text x="${((c.bannerCta.length * 14) + 60) / 2}" y="42" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="${white}" text-anchor="middle">${escapeXml(c.bannerCta)} →</text>
  </g>
  <!-- segment chip -->
  <g transform="translate(${BANNER_W - 200}, 60)">
    <rect width="140" height="34" rx="17" fill="${ink}" opacity="0.85"/>
    <text x="70" y="23" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="${white}" text-anchor="middle">${store.tier.toUpperCase()}</text>
  </g>
</svg>`;
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function svgToPng(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, BANNER_W, BANNER_H);
    ctx.drawImage(img, 0, 0, BANNER_W, BANNER_H);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

function CreativeAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );
  const active = filtered.filter((r) => r.campaign.creative);
  const inactive = filtered.filter((r) => !r.campaign.creative);

  return (
    <AppShell>
      <PageHeader
        title="Creative Agent"
        subtitle="Onaylı kampanyalar için tasarlanmış banner + push + in-app — PNG ve SVG indirme hazır"
        right={
          <div className="flex items-center gap-2">
            <CityFilter value={city} onChange={setCity} />
            <AgentBadge icon={Sparkles} label={`${active.length} kreatif üretildi`} tone="info" />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {active.map((r) => (
          <CreativeCard key={r.store} store={r} />
        ))}
      </div>

      {inactive.length > 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
          Aşağıdaki mağazalarda kampanya açılmadığı için Creative Agent kreatif üretmedi:{" "}
          <span className="font-medium text-foreground">
            {inactive.map((r) => r.store).join(", ")}
          </span>
        </div>
      )}
    </AppShell>
  );
}

function CreativeCard({ store }: { store: StoreRow }) {
  const c = store.campaign.creative!;
  const containerRef = useRef<HTMLDivElement>(null);
  const svg = useMemo(() => buildSvg(store, c), [store, c]);
  const filenameSafe = store.store.replace(/\s+/g, "_");

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <StoreIcon className="h-3 w-3 text-primary" />{store.store} · {store.city}
          </div>
          <div className="text-sm font-semibold flex items-center gap-2 mt-0.5">
            <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${tierStyle[store.tier]}`}>{store.tier}</span>
            <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${campaignStyle[store.campaign.type]}`}>{store.campaign.type}</span>
            <span className="text-muted-foreground text-xs">{fmtNum(store.reachableUsers)} reachable</span>
          </div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          Tahmini CTR <span className="font-semibold text-foreground">%{c.expectedCtr.toFixed(1)}</span>
          <div>Open <span className="font-semibold text-foreground">%{c.expectedOpenRate.toFixed(1)}</span></div>
        </div>
      </div>

      {/* Banner — render the actual SVG */}
      <div className="m-4 rounded-lg overflow-hidden border border-border" ref={containerRef}>
        <div
          className="w-full"
          style={{ aspectRatio: `${BANNER_W} / ${BANNER_H}` }}
          dangerouslySetInnerHTML={{ __html: svg.replace(`width="${BANNER_W}" height="${BANNER_H}"`, 'width="100%" height="100%"') }}
        />
      </div>

      <div className="px-4 -mt-1 mb-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => svgToPng(svg, `${filenameSafe}_banner.png`)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          <Download className="h-3 w-3" /> PNG indir (1200×630)
        </button>
        <button
          onClick={() => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${filenameSafe}_banner.svg`)}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
        >
          <Download className="h-3 w-3" /> SVG indir
        </button>
        <span className="text-[10px] text-muted-foreground italic">Görsel briefi: {c.bannerImage}</span>
      </div>

      {/* Push mock */}
      <div className="mx-4 mb-4 rounded-lg border border-border bg-background/60 p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Bell className="h-3 w-3" /> Push bildirimi
        </div>
        <div className="mt-2 flex items-start gap-3">
          <div className="h-9 w-9 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-base">
            {c.pushEmoji}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">{c.pushTitle}</div>
            <div className="text-xs text-muted-foreground">{c.pushBody}</div>
          </div>
        </div>
      </div>

      {/* In-app */}
      <div className="mx-4 mb-4 rounded-lg border border-border bg-background/60 p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> Uygulama içi kart
        </div>
        <div className="mt-1 text-sm">{c.inAppCard}</div>
      </div>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {c.channels.map((ch) => {
            const Icon = channelIcon[ch];
            return (
              <span key={ch} className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px]">
                <Icon className="h-3 w-3" /> {ch}
              </span>
            );
          })}
        </div>
        <button className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30">
          Yayına al
        </button>
      </div>
    </div>
  );
}
