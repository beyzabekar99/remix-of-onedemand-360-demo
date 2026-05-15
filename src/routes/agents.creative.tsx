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

  const illustration = buildIllustration(c.bannerImage);

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
    <clipPath id="illoClip">
      <rect x="660" y="60" width="500" height="510" rx="32"/>
    </clipPath>
  </defs>
  <rect width="${BANNER_W}" height="${BANNER_H}" fill="url(#bg)"/>
  <circle cx="${BANNER_W - 120}" cy="120" r="280" fill="${orange}" opacity="0.08"/>
  <circle cx="${BANNER_W - 200}" cy="${BANNER_H - 200}" r="80" fill="${orangeDark}" opacity="0.12"/>
  <rect x="0" y="0" width="14" height="${BANNER_H}" fill="url(#orangeGrad)"/>
  <g transform="translate(60, 60)">
    <rect width="180" height="44" rx="22" fill="${orange}"/>
    <text x="90" y="29" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700" fill="${white}" text-anchor="middle">Migros One</text>
  </g>
  <g transform="translate(60, 124)">
    <rect width="${(store.store.length * 11) + 40}" height="34" rx="17" fill="${white}" stroke="${orange}" stroke-width="2"/>
    <text x="20" y="23" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="600" fill="${orange}">${escapeXml(store.store)}</text>
  </g>
  ${headlineLines.map((ln, i) => `<text x="60" y="${260 + i * 78}" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="800" fill="${ink}" letter-spacing="-1.5">${escapeXml(ln)}</text>`).join("\n")}
  <text x="60" y="${260 + headlineLines.length * 78 + 36}" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="500" fill="${ink}" opacity="0.75">${escapeXml(c.bannerSub)}</text>
  <g transform="translate(60, ${BANNER_H - 110})">
    <rect width="${(c.bannerCta.length * 14) + 60}" height="64" rx="32" fill="${orange}"/>
    <text x="${((c.bannerCta.length * 14) + 60) / 2}" y="42" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="${white}" text-anchor="middle">${escapeXml(c.bannerCta)} →</text>
  </g>
  <g clip-path="url(#illoClip)">
    ${illustration}
  </g>
  <rect x="660" y="60" width="500" height="510" rx="32" fill="none" stroke="${orange}" stroke-opacity="0.25" stroke-width="2"/>
</svg>`;
}

function buildIllustration(brief: string): string {
  const b = brief.toLocaleLowerCase("tr");
  if (/(plaj|sahil|deniz|şezlong|yaz)/.test(b)) return illoBeach();
  if (/(skyline|şehir|trafik|levent|bina)/.test(b)) return illoCity();
  if (/(mahalle|bisiklet|kurye|sokak)/.test(b)) return illoNeighborhood();
  if (/(sebze|meyve|ekmek|sepet|tabak|yemek|masa|taze)/.test(b)) return illoFresh();
  return illoFresh();
}

function illoBeach(): string {
  return `
    <rect x="660" y="60" width="500" height="510" fill="#FFF1DC"/>
    <rect x="660" y="380" width="500" height="190" fill="#7FC8E8"/>
    <path d="M660 420 Q760 400 860 420 T1060 420 T1160 420 V440 H660 Z" fill="#5BB5DD" opacity="0.7"/>
    <path d="M660 460 Q760 440 860 460 T1060 460 T1160 460 V480 H660 Z" fill="#4AA3CD" opacity="0.6"/>
    <circle cx="1060" cy="180" r="68" fill="#FFC857"/>
    <circle cx="1060" cy="180" r="90" fill="#FFC857" opacity="0.25"/>
    <path d="M820 380 L820 230" stroke="#7A4A2A" stroke-width="6"/>
    <path d="M720 240 Q820 160 920 240 Z" fill="#ED7625"/>
    <path d="M720 240 Q770 200 820 240" fill="#FFFFFF" opacity="0.35"/>
    <path d="M820 240 Q870 200 920 240" fill="#FFFFFF" opacity="0.2"/>
    <rect x="900" y="360" width="180" height="14" rx="6" fill="#ED7625"/>
    <rect x="900" y="370" width="14" height="40" fill="#7A4A2A"/>
    <rect x="1066" y="370" width="14" height="40" fill="#7A4A2A"/>
    <circle cx="780" cy="395" r="22" fill="#FFFFFF" stroke="#ED7625" stroke-width="3"/>
    <path d="M758 395 Q780 375 802 395" stroke="#ED7625" stroke-width="3" fill="none"/>
  `;
}

function illoFresh(): string {
  return `
    <rect x="660" y="60" width="500" height="510" fill="#FFF6EE"/>
    <ellipse cx="910" cy="500" rx="220" ry="20" fill="#000" opacity="0.06"/>
    <path d="M730 360 L1090 360 L1050 510 L770 510 Z" fill="#B8470F"/>
    <path d="M730 360 L1090 360 L1080 380 L740 380 Z" fill="#8C3208"/>
    <g stroke="#8C3208" stroke-width="3" opacity="0.5">
      <line x1="780" y1="390" x2="790" y2="500"/>
      <line x1="840" y1="390" x2="850" y2="500"/>
      <line x1="900" y1="390" x2="910" y2="500"/>
      <line x1="960" y1="390" x2="970" y2="500"/>
      <line x1="1020" y1="390" x2="1030" y2="500"/>
    </g>
    <circle cx="820" cy="320" r="55" fill="#E63946"/>
    <path d="M820 270 Q830 250 850 250" stroke="#4A6B2A" stroke-width="4" fill="none"/>
    <ellipse cx="855" cy="260" rx="14" ry="7" fill="#5C8A33" transform="rotate(-25 855 260)"/>
    <circle cx="930" cy="340" r="50" fill="#F39455"/>
    <circle cx="930" cy="340" r="50" fill="none" stroke="#C95B12" stroke-width="2" opacity="0.4"/>
    <circle cx="1020" cy="320" r="28" fill="#5C8A33"/>
    <circle cx="1045" cy="310" r="22" fill="#6B9D3E"/>
    <circle cx="1000" cy="305" r="20" fill="#4A6B2A"/>
    <rect x="1015" y="335" width="10" height="30" fill="#C29B6B"/>
    <ellipse cx="760" cy="360" rx="50" ry="28" fill="#D8A05B"/>
    <path d="M720 355 Q760 340 800 355" stroke="#A87432" stroke-width="2" fill="none"/>
    <path d="M730 365 Q760 350 790 365" stroke="#A87432" stroke-width="2" fill="none"/>
  `;
}

function illoCity(): string {
  return `
    <rect x="660" y="60" width="500" height="510" fill="#E9F1F7"/>
    <rect x="660" y="430" width="500" height="140" fill="#C7D6E2"/>
    <rect x="700" y="220" width="70" height="240" fill="#3E5266"/>
    <rect x="780" y="160" width="80" height="300" fill="#506B82"/>
    <rect x="870" y="240" width="60" height="220" fill="#3E5266"/>
    <rect x="940" y="120" width="90" height="340" fill="#2D3E4F"/>
    <rect x="1040" y="260" width="80" height="200" fill="#506B82"/>
    <g fill="#FFD56B" opacity="0.9">
      <rect x="710" y="240" width="14" height="14"/><rect x="734" y="240" width="14" height="14"/>
      <rect x="710" y="280" width="14" height="14"/><rect x="734" y="280" width="14" height="14"/>
      <rect x="710" y="320" width="14" height="14"/><rect x="734" y="320" width="14" height="14"/>
      <rect x="795" y="180" width="16" height="16"/><rect x="819" y="180" width="16" height="16"/>
      <rect x="795" y="220" width="16" height="16"/><rect x="819" y="220" width="16" height="16"/>
      <rect x="795" y="260" width="16" height="16"/><rect x="819" y="260" width="16" height="16"/>
      <rect x="955" y="140" width="18" height="18"/><rect x="985" y="140" width="18" height="18"/>
      <rect x="955" y="180" width="18" height="18"/><rect x="985" y="180" width="18" height="18"/>
      <rect x="955" y="220" width="18" height="18"/><rect x="985" y="220" width="18" height="18"/>
      <rect x="955" y="260" width="18" height="18"/><rect x="985" y="260" width="18" height="18"/>
      <rect x="1055" y="280" width="14" height="14"/><rect x="1079" y="280" width="14" height="14"/>
      <rect x="1055" y="320" width="14" height="14"/><rect x="1079" y="320" width="14" height="14"/>
    </g>
    <circle cx="1080" cy="140" r="36" fill="#ED7625" opacity="0.85"/>
    <line x1="660" y1="500" x2="1160" y2="500" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="20 14"/>
  `;
}

function illoNeighborhood(): string {
  return `
    <rect x="660" y="60" width="500" height="510" fill="#EAF4E2"/>
    <circle cx="900" cy="180" r="60" fill="#FFC857"/>
    <rect x="720" y="320" width="120" height="140" fill="#F4C9A0"/>
    <polygon points="710,320 850,320 780,250" fill="#B8470F"/>
    <rect x="765" y="380" width="30" height="80" fill="#7A4A2A"/>
    <rect x="730" y="350" width="22" height="22" fill="#A8D5F2"/>
    <rect x="810" y="350" width="22" height="22" fill="#A8D5F2"/>
    <rect x="880" y="290" width="140" height="170" fill="#FFE4C2"/>
    <polygon points="870,290 1030,290 950,210" fill="#ED7625"/>
    <rect x="930" y="370" width="34" height="90" fill="#7A4A2A"/>
    <rect x="895" y="320" width="24" height="24" fill="#A8D5F2"/>
    <rect x="980" y="320" width="24" height="24" fill="#A8D5F2"/>
    <rect x="660" y="460" width="500" height="110" fill="#7FB069"/>
    <g transform="translate(1000,420)">
      <circle cx="0" cy="40" r="26" fill="none" stroke="#1A1A1A" stroke-width="5"/>
      <circle cx="70" cy="40" r="26" fill="none" stroke="#1A1A1A" stroke-width="5"/>
      <path d="M0 40 L35 0 L70 40 M35 0 L40 -20" stroke="#ED7625" stroke-width="5" fill="none"/>
      <rect x="20" y="-40" width="30" height="28" rx="4" fill="#ED7625"/>
      <circle cx="35" cy="-50" r="10" fill="#1A1A1A"/>
    </g>
    <circle cx="700" cy="430" r="30" fill="#5C8A33"/>
    <rect x="695" y="450" width="10" height="20" fill="#7A4A2A"/>
  `;
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
