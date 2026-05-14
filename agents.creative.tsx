import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CityFilter } from "@/components/CityFilter";
import {
  campaignStyle,
  fmtMoney,
  fmtNum,
  stores,
  tierStyle,
  type CreativeAsset,
  type StoreRow,
} from "@/lib/demo-data";
import {
  Bell,
  Download,
  Mail,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Smartphone,
  Store as StoreIcon,
  WandSparkles,
} from "lucide-react";
import { AgentBadge } from "./agents.forecast";

export const Route = createFileRoute("/agents/creative")({
  component: CreativeAgentPage,
  head: () => ({
    meta: [
      { title: "Creative Agent — OneDemand 360" },
      {
        name: "description",
        content: "Creative system that turns approved offers into launch-ready channels.",
      },
    ],
  }),
});

const channelIcon = {
  Push: Bell,
  InApp: Smartphone,
  Email: Mail,
  Banner: MonitorSmartphone,
} as const;

const BANNER_W = 1200;
const BANNER_H = 630;

function CreativeAgentPage() {
  const [city, setCity] = useState("all");
  const filtered = useMemo(
    () => (city === "all" ? stores : stores.filter((s) => s.city === city)),
    [city]
  );

  const active = filtered.filter((row) => row.campaign.creative);
  const totalReach = active.reduce((sum, row) => sum + row.reachableUsers, 0);
  const totalValue = active.reduce((sum, row) => sum + row.campaign.netContribution, 0);

  return (
    <AppShell>
      <PageHeader
        title="Creative Agent"
        subtitle="Approved campaigns are translated into premium launch-ready creative directions with channel payloads and exportable assets."
        right={
          <div className="flex items-center gap-2">
            <CityFilter value={city} onChange={setCity} />
            <AgentBadge icon={Sparkles} label={`${active.length} launch packs ready`} tone="info" />
          </div>
        }
      />

      <section className="rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white p-5 shadow-[0_24px_40px_-30px_rgba(237,118,37,0.45)]">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary/75">
              Handoff from campaign agent
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {active.length} stores passed guardrails and now have publishable creative.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Creative Agent is packaging offer logic, segment tone and channel mix into multiple visual directions so teams can launch fast without falling back to generic templates.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TopMetric label="Reachable audience" value={fmtNum(totalReach)} />
            <TopMetric label="Protected net value" value={fmtMoney(totalValue)} />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6">
        {active.map((store) => (
          <CreativeShowcase key={store.store} store={store} />
        ))}
      </div>
    </AppShell>
  );
}

function CreativeShowcase({ store }: { store: StoreRow }) {
  const creative = store.campaign.creative!;
  const performanceSvg = useMemo(() => buildPerformanceSvg(store, creative), [store, creative]);
  const editorialSvg = useMemo(() => buildEditorialSvg(store, creative), [store, creative]);
  const filenameSafe = store.store.replace(/\s+/g, "_");

  return (
    <section className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-[0_22px_40px_-32px_rgba(15,23,42,0.42)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {store.city} creative pack
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xl font-semibold text-foreground">
            <StoreIcon className="h-4 w-4 text-primary" />
            {store.store}
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${tierStyle[store.tier]}`}>
              {store.tier}
            </span>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${campaignStyle[store.campaign.type]}`}>
              {store.campaign.type}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {store.campaign.rationale}
          </p>
        </div>

        <div className="grid min-w-[220px] gap-2 rounded-3xl border border-border/70 bg-background/70 p-3 text-sm">
          <MetricPair label="Reachable users" value={fmtNum(store.reachableUsers)} />
          <MetricPair label="Expected net contribution" value={fmtMoney(store.campaign.netContribution)} />
          <MetricPair label="Expected CTR / Open" value={`%${creative.expectedCtr.toFixed(1)} / %${creative.expectedOpenRate.toFixed(1)}`} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <CreativeVariant
          badge="Performance direction"
          description="Stronger CTA hierarchy, bolder offer framing and channel-first urgency for fast conversion."
          filename={`${filenameSafe}_performance`}
          svg={performanceSvg}
        />
        <CreativeVariant
          badge="Editorial direction"
          description="More premium, atmospheric art direction designed to feel less promotional and more brand-native."
          filename={`${filenameSafe}_editorial`}
          svg={editorialSvg}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <WandSparkles className="h-3.5 w-3.5" />
            Channel payload
          </div>

          <div className="mt-4 rounded-2xl border border-border/70 bg-card p-4">
            <div className="text-xs text-muted-foreground">Push notification</div>
            <div className="mt-2 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                {creative.pushEmoji}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{creative.pushTitle}</div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">{creative.pushBody}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-border/70 bg-card p-4">
            <div className="text-xs text-muted-foreground">In-app card</div>
            <div className="mt-2 text-sm leading-6 text-foreground">{creative.inAppCard}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            Creative system notes
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <NoteCard
              title="Visual brief"
              body={creative.bannerImage}
            />
            <NoteCard
              title="Channel mix"
              body={creative.channels.join(" · ")}
            />
            <NoteCard
              title="Offer framing"
              body={store.campaign.offer}
            />
            <NoteCard
              title="Audience angle"
              body={`${store.tier} segment · ${fmtNum(store.reachableUsers)} reachable users`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {creative.channels.map((channel) => {
              const Icon = channelIcon[channel];
              return (
                <span
                  key={channel}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {channel}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreativeVariant({
  badge,
  description,
  filename,
  svg,
}: {
  badge: string;
  description: string;
  filename: string;
  svg: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{badge}</div>
          <div className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => svgToPng(svg, `${filename}.png`)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Download className="h-3 w-3" />
            PNG
          </button>
          <button
            onClick={() => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${filename}.svg`)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
          >
            <Download className="h-3 w-3" />
            SVG
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[24px] border border-border/70 bg-card">
        <div
          className="w-full"
          style={{ aspectRatio: `${BANNER_W} / ${BANNER_H}` }}
          dangerouslySetInnerHTML={{
            __html: svg.replace(`width="${BANNER_W}" height="${BANNER_H}"`, 'width="100%" height="100%"'),
          }}
        />
      </div>
    </div>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-white/80 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function MetricPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function NoteCard({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</div>
      <div className="mt-2 text-sm leading-6 text-foreground">{body}</div>
    </div>
  );
}

function buildPerformanceSvg(store: StoreRow, c: CreativeAsset) {
  return baseSvg({
    accent: "#ED7625",
    badgeFill: "#16110f",
    background:
      "linear-gradient(135deg, #fff3e8 0%, #ffffff 52%, #ffe1ca 100%)",
    c,
    eyebrow: `${store.store} · conversion push`,
    store,
    subtitle: c.bannerSub,
    title: c.bannerHeadline,
    titleColor: "#18120f",
  });
}

function buildEditorialSvg(store: StoreRow, c: CreativeAsset) {
  return baseSvg({
    accent: "#b8470f",
    badgeFill: "#ffffff",
    background:
      "linear-gradient(135deg, #281711 0%, #4c2614 32%, #c65d1b 100%)",
    c,
    eyebrow: `${store.store} · premium mood`,
    store,
    subtitle: c.bannerSub,
    title: c.bannerHeadline,
    titleColor: "#fff7f0",
  });
}

function baseSvg({
  accent,
  badgeFill,
  background,
  c,
  eyebrow,
  store,
  subtitle,
  title,
  titleColor,
}: {
  accent: string;
  badgeFill: string;
  background: string;
  c: CreativeAsset;
  eyebrow: string;
  store: StoreRow;
  subtitle: string;
  title: string;
  titleColor: string;
}) {
  const lines = wrapText(title, 18).slice(0, 3);
  const isDark = titleColor !== "#18120f";
  const textMuted = isDark ? "rgba(255,247,240,0.78)" : "rgba(24,18,15,0.68)";
  const chipText = isDark ? "#fff7f0" : accent;
  const chipBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(237,118,37,0.10)";
  const ctaFill = isDark ? "#fff7f0" : accent;
  const ctaText = isDark ? "#3f1d0f" : "#ffffff";
  const ctaStroke = isDark ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BANNER_W} ${BANNER_H}" width="${BANNER_W}" height="${BANNER_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      ${gradientStops(background)}
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${shadeColor(accent, -18)}" />
    </linearGradient>
  </defs>
  <rect width="${BANNER_W}" height="${BANNER_H}" fill="url(#bg)" />
  <circle cx="${BANNER_W - 110}" cy="110" r="240" fill="${isDark ? "rgba(255,255,255,0.08)" : "rgba(237,118,37,0.14)"}" />
  <circle cx="${BANNER_W - 210}" cy="${BANNER_H - 120}" r="180" fill="${isDark ? "rgba(255,255,255,0.10)" : "rgba(184,71,15,0.10)"}" />
  <rect x="48" y="56" width="240" height="36" rx="18" fill="${chipBg}" />
  <text x="72" y="79" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="${chipText}" letter-spacing="1.2">${escapeXml(eyebrow.toUpperCase())}</text>
  <rect x="${BANNER_W - 172}" y="56" width="124" height="38" rx="19" fill="${badgeFill}" opacity="${isDark ? "0.16" : "1"}" />
  <text x="${BANNER_W - 110}" y="80" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="${isDark ? "#fff7f0" : accent}">${escapeXml(store.tier)}</text>
  ${lines
    .map(
      (line, index) =>
        `<text x="60" y="${220 + index * 78}" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="800" fill="${titleColor}" letter-spacing="-1.5">${escapeXml(line)}</text>`
    )
    .join("\n")}
  <text x="60" y="${220 + lines.length * 78 + 34}" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="500" fill="${textMuted}">${escapeXml(subtitle)}</text>
  <rect x="60" y="${BANNER_H - 118}" width="${Math.max(250, c.bannerCta.length * 14 + 70)}" height="64" rx="32" fill="${ctaFill}" stroke="${ctaStroke}" />
  <text x="${60 + Math.max(250, c.bannerCta.length * 14 + 70) / 2}" y="${BANNER_H - 76}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="${ctaText}">${escapeXml(c.bannerCta)} →</text>
  <text x="60" y="${BANNER_H - 28}" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="500" fill="${textMuted}">${escapeXml(c.bannerImage)}</text>
</svg>`;
}

function gradientStops(value: string) {
  if (!value.includes("linear-gradient")) {
    return `<stop offset="0%" stop-color="${value}" /><stop offset="100%" stop-color="${value}" />`;
  }

  const colors = value.match(/#(?:[0-9a-fA-F]{3}){1,2}/g) ?? ["#ffffff", "#ffffff"];
  return colors
    .map((color, index) => {
      const offset = (index / Math.max(colors.length - 1, 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}" />`;
    })
    .join("");
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  });

  if (current) lines.push(current);
  return lines;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function shadeColor(color: string, percent: number) {
  const hex = color.replace("#", "");
  const num = Number.parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const r = (num >> 16) + amt;
  const g = ((num >> 8) & 0x00ff) + amt;
  const b = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (Math.max(0, Math.min(255, r)) << 16) +
    (Math.max(0, Math.min(255, g)) << 8) +
    Math.max(0, Math.min(255, b))
  )
    .toString(16)
    .slice(1)}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function svgToPng(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, BANNER_W, BANNER_H);
    ctx.drawImage(image, 0, 0, BANNER_W, BANNER_H);
    URL.revokeObjectURL(url);

    canvas.toBlob((pngBlob) => {
      if (pngBlob) downloadBlob(pngBlob, filename);
    }, "image/png");
  };

  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}
