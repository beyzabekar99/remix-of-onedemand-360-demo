// OneDemand 360 — demo data (mağaza bazlı)
// Toplam günlük forecast ≈ 140.000 sipariş, ~13 MMM mağazasına dağıtılır.

export type OpsStatus = "GREEN" | "YELLOW" | "RED";
export type CampaignType = "Kupon" | "Ücretsiz Teslimat" | "Yok";
export type ApprovalStatus = "Otomatik onaylandı" | "İnsan onayı gerekli" | "Engellendi";
export type SegmentTier = "Premium" | "Gold" | "SubGold" | "Silver" | "SubSilver";

export interface CreativeAsset {
  bannerHeadline: string;
  bannerSub: string;
  bannerCta: string;
  bannerImage: string;
  pushTitle: string;
  pushBody: string;
  pushEmoji: string;
  inAppCard: string;
  channels: ("Push" | "InApp" | "Email" | "Banner")[];
  expectedCtr: number;
  expectedOpenRate: number;
}

export interface PickingKpi {
  pickingOk: boolean;
  staffOk: boolean;
  estPickingMin: number;
  actualPickingMin: number;
  pickingDeviationPct: number;
  status: OpsStatus;
}

export interface CourierKpi {
  pool: string;
  capacityOk: boolean;
  deliveryOk: boolean;
  etaDeviation: boolean;
  ratioOk: boolean;
  estDeliveryMin: number;
  actualDeliveryMin: number;
  etaDeviationPct: number;
  activeCouriers: number;
  orderCount: number;
  courierOrderRatio: number;
  status: OpsStatus;
}

export interface CampaignSuggestion {
  type: CampaignType;
  couponTier?: string;
  offer: string;
  minBasket: number;
  incrementalOrders: number;
  incrementalRevenue: number;
  crImpactPct: number;
  roi: number;
  cost: number;
  netContribution: number;
  approval: ApprovalStatus;
  rationale: string;
  creative?: CreativeAsset;
}

export interface ForecastDecomp {
  baseOrders: number;
  activeCustomerImpact: number;
  crImpact: number;
  campaignImpact: number;
  weatherImpact: number;
  specialDayImpact: number;
  finalForecast: number;
}

export interface RevisionInsight {
  forecastOrders: number;
  actualOrders: number;
  endOfDayProjection: number;
  deviationCount: number;
  deviationPct: number;
  weatherMatch: boolean;
  specialDayMatch: boolean;
  campaignMatch: boolean;
  expectedCr: number;
  actualCr: number;
  expectedUpliftPct: number;
  actualUpliftPct: number;
  revisedForecast: number;
  ordersToRecover: number;
  comment: string;
}

export interface StoreRow {
  store: string;            // "MMM Levent"
  city: string;             // "İstanbul"
  hour: string;
  tier: SegmentTier;        // mağazanın TEK segmenti
  reachableUsers: number;   // mağaza için ulaşılabilir müşteri
  activeCustomers: number;
  forecast: ForecastDecomp;
  actual: number;
  gapPct: number;
  cr: number;
  crTarget: number;
  picking: PickingKpi;
  courier: CourierKpi;
  campaign: CampaignSuggestion;
  revision: RevisionInsight;
  opsStatus: OpsStatus;
  agentSummary: string;
}

const fc = (
  base: number, active: number, cr: number,
  campaign: number, weather: number, special: number
): ForecastDecomp => ({
  baseOrders: base,
  activeCustomerImpact: active,
  crImpact: cr,
  campaignImpact: campaign,
  weatherImpact: weather,
  specialDayImpact: special,
  finalForecast: base + active + cr + campaign + weather + special,
});

// ---------- Mağazalar (≈140K toplam) ----------
export const stores: StoreRow[] = [
  {
    store: "MMM Levent", city: "İstanbul", hour: "14:00",
    tier: "Premium", reachableUsers: 38_500, activeCustomers: 142_000,
    forecast: fc(13200, 700, -300, 600, 500, 200),
    actual: 13100, gapPct: -7.7, cr: 4.2, crTarget: 4.6,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 18, actualPickingMin: 17, pickingDeviationPct: -5.6, status: "GREEN" },
    courier: { pool: "İstanbul Avrupa", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 32, actualDeliveryMin: 33, etaDeviationPct: 3.1, activeCouriers: 220, orderCount: 13100, courierOrderRatio: 1/60, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Kupon", couponTier: "300 TL üzeri 50 TL kupon",
      offer: "50 TL indirim kuponu (2 saatlik)",
      minBasket: 300, incrementalOrders: 720, incrementalRevenue: 248_000,
      crImpactPct: 0.4, roi: 3.2, cost: 78_000, netContribution: 170_000,
      approval: "Otomatik onaylandı",
      rationale: "Premium mağaza, CR hedefin 0,4 puan altında. 38K reachable kitleye 300/50 offer.",
      creative: {
        bannerHeadline: "Sepete 50 TL Migros'tan!",
        bannerSub: "Levent MMM · 300 TL ve üzeri sepetlerde 2 saat geçerli",
        bannerCta: "Hemen Sepete Git",
        bannerImage: "Levent skyline silueti + taze sebze çelengi",
        pushTitle: "Sepetinde 50 TL hediyen var",
        pushBody: "Bugün 16:00'a kadar 300 TL üzeri alışverişe özel — kaçırma!",
        pushEmoji: "🛒",
        inAppCard: "Levent MMM · Bugün sepete 50 TL hediye kupon hazır.",
        channels: ["Push", "InApp", "Banner"],
        expectedCtr: 7.1, expectedOpenRate: 23.2,
      },
    },
    revision: { forecastOrders: 14200, actualOrders: 13100, endOfDayProjection: 13900, deviationCount: -1100, deviationPct: -7.7, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.6, actualCr: 4.2, expectedUpliftPct: 5.0, actualUpliftPct: 3.0, revisedForecast: 13900, ordersToRecover: 300, comment: "CR hedefin altında; kupon ile telafi devrede." },
    agentSummary: "GREEN · 300/50 kupon otomatik onaylandı.",
  },
  {
    store: "MJet Mecidiyeköy", city: "İstanbul", hour: "14:00",
    tier: "Gold", reachableUsers: 46_200, activeCustomers: 142_000,
    forecast: fc(11800, 600, -400, 500, 500, 200),
    actual: 11200, gapPct: -8.9, cr: 4.0, crTarget: 4.5,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 20, actualPickingMin: 21, pickingDeviationPct: 5.0, status: "GREEN" },
    courier: { pool: "İstanbul Avrupa", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 32, actualDeliveryMin: 33, etaDeviationPct: 3.1, activeCouriers: 220, orderCount: 11200, courierOrderRatio: 1/55, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Kupon", couponTier: "250 TL üzeri 40 TL kupon",
      offer: "40 TL indirim kuponu (2 saatlik)",
      minBasket: 250, incrementalOrders: 640, incrementalRevenue: 198_000,
      crImpactPct: 0.4, roi: 3.0, cost: 66_000, netContribution: 132_000,
      approval: "Otomatik onaylandı",
      rationale: "Gold segment CR hedef altı, 46K reachable. 250/40 offer 3.0x ROI.",
      creative: {
        bannerHeadline: "40 TL hediyen Mecidiyeköy'de",
        bannerSub: "250 TL üzeri sepetlerde 2 saat geçerli",
        bannerCta: "Sepete Git",
        bannerImage: "Şehir trafiği + akşam yemeği masası",
        pushTitle: "Akşam alışverişine 40 TL hediye",
        pushBody: "Mecidiyeköy MJet'den 250 TL üzeri alışverişe özel — bugün 16:00'a kadar.",
        pushEmoji: "🛍️",
        inAppCard: "Mecidiyeköy MJet · Bugün 40 TL kupon aktif.",
        channels: ["Push", "InApp"],
        expectedCtr: 6.4, expectedOpenRate: 21.0,
      },
    },
    revision: { forecastOrders: 13200, actualOrders: 11200, endOfDayProjection: 12100, deviationCount: -2000, deviationPct: -8.9, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.5, actualCr: 4.0, expectedUpliftPct: 5.0, actualUpliftPct: 2.8, revisedForecast: 12100, ordersToRecover: 500, comment: "Beklenen uplift gelmedi, kupon devreye alındı." },
    agentSummary: "GREEN · 250/40 kupon otomatik onaylandı.",
  },
  {
    store: "MMM Bakırköy", city: "İstanbul", hour: "14:00",
    tier: "SubGold", reachableUsers: 41_300, activeCustomers: 142_000,
    forecast: fc(9000, 400, -200, 400, 300, 100),
    actual: 8400, gapPct: -15.0, cr: 3.7, crTarget: 4.2,
    picking: { pickingOk: true, staffOk: false, estPickingMin: 22, actualPickingMin: 25, pickingDeviationPct: 13.6, status: "YELLOW" },
    courier: { pool: "İstanbul Avrupa", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 32, actualDeliveryMin: 34, etaDeviationPct: 6.3, activeCouriers: 220, orderCount: 8400, courierOrderRatio: 1/65, status: "GREEN" },
    opsStatus: "YELLOW",
    campaign: {
      type: "Ücretsiz Teslimat",
      offer: "Ücretsiz teslimat (sepet ≥ 250 TL)",
      minBasket: 250, incrementalOrders: 380, incrementalRevenue: 121_000,
      crImpactPct: 0.3, roi: 2.5, cost: 49_000, netContribution: 72_000,
      approval: "İnsan onayı gerekli",
      rationale: "SubGold segment terk oranı yüksek; picking YELLOW olduğu için insan onayı.",
      creative: {
        bannerHeadline: "Bakırköy'de teslimat bizden",
        bannerSub: "250 TL üzeri sepetlerde ücretsiz",
        bannerCta: "Tamamla",
        bannerImage: "Sahil + Migros poşeti",
        pushTitle: "Teslimat bugün bizden",
        pushBody: "Bakırköy MMM · 250 TL üzeri alışverişe ücretsiz teslimat.",
        pushEmoji: "🚲",
        inAppCard: "Bakırköy MMM · Bugün ücretsiz teslimat aktif.",
        channels: ["Push", "InApp"],
        expectedCtr: 5.2, expectedOpenRate: 18.4,
      },
    },
    revision: { forecastOrders: 10000, actualOrders: 8400, endOfDayProjection: 9100, deviationCount: -1600, deviationPct: -15.0, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.2, actualCr: 3.7, expectedUpliftPct: 4.0, actualUpliftPct: 2.0, revisedForecast: 9100, ordersToRecover: 400, comment: "Picking sapması nedeniyle ETA risk; ücretsiz teslimat insan onayında." },
    agentSummary: "YELLOW · Picking 13% sapma, ücretsiz teslimat onayda.",
  },
  {
    store: "MM Kadıköy", city: "İstanbul", hour: "14:00",
    tier: "Gold", reachableUsers: 44_100, activeCustomers: 138_000,
    forecast: fc(13000, 600, -200, 500, 600, 300),
    actual: 13800, gapPct: 4.0, cr: 4.7, crTarget: 4.5,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 19, actualPickingMin: 22, pickingDeviationPct: 15.8, status: "YELLOW" },
    courier: { pool: "İstanbul Anadolu", capacityOk: false, deliveryOk: true, etaDeviation: true, ratioOk: false, estDeliveryMin: 35, actualDeliveryMin: 41, etaDeviationPct: 17.1, activeCouriers: 160, orderCount: 13800, courierOrderRatio: 1/86, status: "YELLOW" },
    opsStatus: "YELLOW",
    campaign: {
      type: "Yok",
      offer: "Kampanya önerilmiyor — kapasite önceliği",
      minBasket: 0, incrementalOrders: 0, incrementalRevenue: 0,
      crImpactPct: 0, roi: 0, cost: 0, netContribution: 0,
      approval: "İnsan onayı gerekli",
      rationale: "Talep forecast üzerinde, ETA sapması %17. Kampanya açmak SLA'yı bozar.",
    },
    revision: { forecastOrders: 14800, actualOrders: 13800, endOfDayProjection: 15100, deviationCount: -1000, deviationPct: 4.0, weatherMatch: true, specialDayMatch: true, campaignMatch: true, expectedCr: 4.5, actualCr: 4.7, expectedUpliftPct: 0, actualUpliftPct: 0, revisedForecast: 15100, ordersToRecover: 0, comment: "Talep beklenenin üzerinde; kapasite sınırlayıcı." },
    agentSummary: "YELLOW · ETA %17, kampanya açılmadı.",
  },
  {
    store: "MJet Ataşehir", city: "İstanbul", hour: "14:00",
    tier: "Silver", reachableUsers: 52_400, activeCustomers: 138_000,
    forecast: fc(9800, 400, -200, 400, 400, 200),
    actual: 9400, gapPct: -8.7, cr: 3.6, crTarget: 4.2,
    picking: { pickingOk: false, staffOk: false, estPickingMin: 20, actualPickingMin: 27, pickingDeviationPct: 35.0, status: "RED" },
    courier: { pool: "İstanbul Anadolu", capacityOk: false, deliveryOk: true, etaDeviation: true, ratioOk: false, estDeliveryMin: 35, actualDeliveryMin: 41, etaDeviationPct: 17.1, activeCouriers: 160, orderCount: 9400, courierOrderRatio: 1/95, status: "YELLOW" },
    opsStatus: "RED",
    campaign: {
      type: "Yok",
      offer: "Kampanya engellendi — picking RED",
      minBasket: 0, incrementalOrders: 0, incrementalRevenue: 0,
      crImpactPct: 0, roi: 0, cost: 0, netContribution: 0,
      approval: "Engellendi",
      rationale: "Picking sapması %35; mağaza içi takviye öncelikli.",
    },
    revision: { forecastOrders: 11000, actualOrders: 9400, endOfDayProjection: 10100, deviationCount: -1600, deviationPct: -8.7, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.2, actualCr: 3.6, expectedUpliftPct: 0, actualUpliftPct: 0, revisedForecast: 10100, ordersToRecover: 600, comment: "Operasyon RED, kampanya engellendi." },
    agentSummary: "RED · Picking RED, kampanya engellendi.",
  },
  {
    store: "MMM Çankaya", city: "Ankara", hour: "14:00",
    tier: "Gold", reachableUsers: 28_600, activeCustomers: 122_000,
    forecast: fc(11500, 500, -200, 700, 300, 200),
    actual: 11000, gapPct: -13.5, cr: 3.8, crTarget: 4.3,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 17, actualPickingMin: 16, pickingDeviationPct: -5.9, status: "GREEN" },
    courier: { pool: "Ankara Merkez", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 30, actualDeliveryMin: 30, etaDeviationPct: 0, activeCouriers: 160, orderCount: 11000, courierOrderRatio: 1/69, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Kupon", couponTier: "200 TL üzeri 30 TL kupon",
      offer: "30 TL indirim kuponu (3 saatlik)",
      minBasket: 200, incrementalOrders: 540, incrementalRevenue: 162_000,
      crImpactPct: 0.5, roi: 2.8, cost: 60_000, netContribution: 102_000,
      approval: "Otomatik onaylandı",
      rationale: "Gold segment, 30 günlük pasif kullanıcılar. 200/30 offer hızlı CR kapatıcı.",
      creative: {
        bannerHeadline: "Bugüne özel 30 TL Migros'ta",
        bannerSub: "Çankaya MMM · 200 TL üzeri sepetlerde 3 saat geçerli",
        bannerCta: "Kuponu Kullan",
        bannerImage: "Taze ekmek + meyve sepeti",
        pushTitle: "Seni özledik — 30 TL hediyen burada",
        pushBody: "Çankaya MMM'den 200 TL üzeri alışverişe 30 TL indirim, bugün 17:00'a kadar.",
        pushEmoji: "🥦",
        inAppCard: "Son alışverişinden bu yana 30 gün geçti. Bugün dön, 30 TL hediyeni kullan.",
        channels: ["Push", "InApp", "Email"],
        expectedCtr: 5.6, expectedOpenRate: 20.1,
      },
    },
    revision: { forecastOrders: 13000, actualOrders: 11000, endOfDayProjection: 12200, deviationCount: -2000, deviationPct: -13.5, weatherMatch: true, specialDayMatch: true, campaignMatch: true, expectedCr: 4.3, actualCr: 3.8, expectedUpliftPct: 5.0, actualUpliftPct: 4.6, revisedForecast: 12200, ordersToRecover: 800, comment: "CR hedefin 0,5 puan altında; kupon ile telafi mümkün." },
    agentSummary: "GREEN · 200/30 kupon otomatik onaylandı.",
  },
  {
    store: "MM Çayyolu", city: "Ankara", hour: "14:00",
    tier: "SubGold", reachableUsers: 24_300, activeCustomers: 122_000,
    forecast: fc(8800, 300, -100, 400, 200, 100),
    actual: 8400, gapPct: -12.5, cr: 3.7, crTarget: 4.1,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 19, actualPickingMin: 20, pickingDeviationPct: 5.3, status: "GREEN" },
    courier: { pool: "Ankara Merkez", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 30, actualDeliveryMin: 30, etaDeviationPct: 0, activeCouriers: 160, orderCount: 8400, courierOrderRatio: 1/70, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Ücretsiz Teslimat",
      offer: "Ücretsiz teslimat (sepet ≥ 200 TL)",
      minBasket: 200, incrementalOrders: 360, incrementalRevenue: 108_000,
      crImpactPct: 0.4, roi: 2.6, cost: 41_000, netContribution: 67_000,
      approval: "Otomatik onaylandı",
      rationale: "SubGold segment teslimat ücretinde sepet terkleri yüksek.",
      creative: {
        bannerHeadline: "Çayyolu'nda teslimat bizden",
        bannerSub: "200 TL üzeri sepetlerde ücretsiz teslimat",
        bannerCta: "Sepete Git",
        bannerImage: "Yeşil mahalle + bisikletli kurye",
        pushTitle: "Teslimat bugün bizden",
        pushBody: "Çayyolu MM · 200 TL üzeri alışverişe ücretsiz teslimat.",
        pushEmoji: "🚲",
        inAppCard: "Çayyolu MM · Bugün ücretsiz teslimat aktif.",
        channels: ["Push", "InApp"],
        expectedCtr: 4.9, expectedOpenRate: 17.8,
      },
    },
    revision: { forecastOrders: 9700, actualOrders: 8400, endOfDayProjection: 9100, deviationCount: -1300, deviationPct: -12.5, weatherMatch: true, specialDayMatch: true, campaignMatch: true, expectedCr: 4.1, actualCr: 3.7, expectedUpliftPct: 3.5, actualUpliftPct: 3.0, revisedForecast: 9100, ordersToRecover: 400, comment: "Sepet terki yüksek; ücretsiz teslimat devrede." },
    agentSummary: "GREEN · Ücretsiz teslimat otomatik onaylandı.",
  },
  {
    store: "MMM Karşıyaka", city: "İzmir", hour: "14:00",
    tier: "Silver", reachableUsers: 32_700, activeCustomers: 96_000,
    forecast: fc(9500, 400, -100, 500, 300, 100),
    actual: 9300, gapPct: -7.1, cr: 4.1, crTarget: 4.4,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 18, actualPickingMin: 19, pickingDeviationPct: 5.6, status: "GREEN" },
    courier: { pool: "İzmir", capacityOk: true, deliveryOk: false, etaDeviation: true, ratioOk: true, estDeliveryMin: 33, actualDeliveryMin: 38, etaDeviationPct: 15.2, activeCouriers: 110, orderCount: 9300, courierOrderRatio: 1/85, status: "YELLOW" },
    opsStatus: "YELLOW",
    campaign: {
      type: "Ücretsiz Teslimat",
      offer: "Ücretsiz teslimat (sepet ≥ 300 TL)",
      minBasket: 300, incrementalOrders: 320, incrementalRevenue: 105_000,
      crImpactPct: 0.3, roi: 2.4, cost: 44_000, netContribution: 61_000,
      approval: "İnsan onayı gerekli",
      rationale: "Silver segment sepet terk %18; ETA YELLOW olduğu için insan onayı.",
      creative: {
        bannerHeadline: "Karşıyaka'da teslimat bizden",
        bannerSub: "300 TL üzeri sepetlerde ücretsiz",
        bannerCta: "Sepete Devam",
        bannerImage: "Karşıyaka sahil + yaz tonları",
        pushTitle: "Teslimat bugün bizden",
        pushBody: "Karşıyaka MMM · 300 TL üzeri alışverişe ücretsiz teslimat.",
        pushEmoji: "🚲",
        inAppCard: "Karşıyaka MMM · Bugün ücretsiz teslimat aktif.",
        channels: ["Push", "InApp"],
        expectedCtr: 4.6, expectedOpenRate: 17.2,
      },
    },
    revision: { forecastOrders: 10700, actualOrders: 9300, endOfDayProjection: 10100, deviationCount: -1400, deviationPct: -7.1, weatherMatch: false, specialDayMatch: true, campaignMatch: true, expectedCr: 4.4, actualCr: 4.1, expectedUpliftPct: 3.5, actualUpliftPct: 3.0, revisedForecast: 10100, ordersToRecover: 350, comment: "Hava beklenenden kapalı; teslimat süresi uzadı." },
    agentSummary: "YELLOW · Ücretsiz teslimat insan onayında.",
  },
  {
    store: "MJet Bornova", city: "İzmir", hour: "14:00",
    tier: "SubSilver", reachableUsers: 28_900, activeCustomers: 96_000,
    forecast: fc(7800, 300, -100, 200, 200, 100),
    actual: 7100, gapPct: -10.1, cr: 3.4, crTarget: 4.0,
    picking: { pickingOk: true, staffOk: false, estPickingMin: 20, actualPickingMin: 24, pickingDeviationPct: 20.0, status: "YELLOW" },
    courier: { pool: "İzmir", capacityOk: true, deliveryOk: false, etaDeviation: true, ratioOk: true, estDeliveryMin: 33, actualDeliveryMin: 38, etaDeviationPct: 15.2, activeCouriers: 110, orderCount: 7100, courierOrderRatio: 1/65, status: "YELLOW" },
    opsStatus: "YELLOW",
    campaign: {
      type: "Yok",
      offer: "Kampanya önerilmiyor — picking + ETA YELLOW",
      minBasket: 0, incrementalOrders: 0, incrementalRevenue: 0,
      crImpactPct: 0, roi: 0, cost: 0, netContribution: 0,
      approval: "İnsan onayı gerekli",
      rationale: "Hem picking hem ETA sınırda; kampanya SLA'yı bozabilir.",
    },
    revision: { forecastOrders: 8500, actualOrders: 7100, endOfDayProjection: 7800, deviationCount: -1400, deviationPct: -10.1, weatherMatch: false, specialDayMatch: true, campaignMatch: false, expectedCr: 4.0, actualCr: 3.4, expectedUpliftPct: 0, actualUpliftPct: 0, revisedForecast: 7800, ordersToRecover: 700, comment: "Operasyonel sınır nedeniyle kampanya açılmadı." },
    agentSummary: "YELLOW · Kampanya açılmadı, kapasite önceliği.",
  },
  {
    store: "MMM Nilüfer", city: "Bursa", hour: "14:00",
    tier: "Silver", reachableUsers: 22_400, activeCustomers: 78_000,
    forecast: fc(7800, 300, -100, 200, 200, 100),
    actual: 6300, gapPct: -24.1, cr: 3.4, crTarget: 4.1,
    picking: { pickingOk: false, staffOk: false, estPickingMin: 18, actualPickingMin: 28, pickingDeviationPct: 55.6, status: "RED" },
    courier: { pool: "Bursa", capacityOk: false, deliveryOk: false, etaDeviation: true, ratioOk: false, estDeliveryMin: 32, actualDeliveryMin: 46, etaDeviationPct: 43.8, activeCouriers: 45, orderCount: 6300, courierOrderRatio: 1/140, status: "RED" },
    opsStatus: "RED",
    campaign: {
      type: "Yok",
      offer: "Kampanya engellendi — operasyon RED",
      minBasket: 0, incrementalOrders: 0, incrementalRevenue: 0,
      crImpactPct: 0, roi: 0, cost: 0, netContribution: 0,
      approval: "Engellendi",
      rationale: "Picking RED + kurye 1/140. Önce kapasite + mağaza içi takviye.",
    },
    revision: { forecastOrders: 8500, actualOrders: 6300, endOfDayProjection: 7100, deviationCount: -2200, deviationPct: -24.1, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.1, actualCr: 3.4, expectedUpliftPct: 0, actualUpliftPct: 0, revisedForecast: 7100, ordersToRecover: 1200, comment: "Operasyonel sınır nedeniyle talep absorbe edilemiyor." },
    agentSummary: "RED · Kampanya engellendi, kapasite + mağaza takviyesi.",
  },
  {
    store: "MM Osmangazi", city: "Bursa", hour: "14:00",
    tier: "SubSilver", reachableUsers: 19_800, activeCustomers: 78_000,
    forecast: fc(7000, 200, -100, 300, 200, 100),
    actual: 6200, gapPct: -19.5, cr: 3.5, crTarget: 4.0,
    picking: { pickingOk: true, staffOk: false, estPickingMin: 20, actualPickingMin: 25, pickingDeviationPct: 25.0, status: "YELLOW" },
    courier: { pool: "Bursa", capacityOk: false, deliveryOk: false, etaDeviation: true, ratioOk: false, estDeliveryMin: 32, actualDeliveryMin: 46, etaDeviationPct: 43.8, activeCouriers: 45, orderCount: 6200, courierOrderRatio: 1/138, status: "RED" },
    opsStatus: "RED",
    campaign: {
      type: "Yok",
      offer: "Kampanya engellendi — kurye RED",
      minBasket: 0, incrementalOrders: 0, incrementalRevenue: 0,
      crImpactPct: 0, roi: 0, cost: 0, netContribution: 0,
      approval: "Engellendi",
      rationale: "Kurye havuzu RED; kampanya açılması SLA'yı bozar.",
    },
    revision: { forecastOrders: 7700, actualOrders: 6200, endOfDayProjection: 6800, deviationCount: -1500, deviationPct: -19.5, weatherMatch: true, specialDayMatch: true, campaignMatch: false, expectedCr: 4.0, actualCr: 3.5, expectedUpliftPct: 0, actualUpliftPct: 0, revisedForecast: 6800, ordersToRecover: 900, comment: "Kurye havuzu RED; talep absorbe edilemedi." },
    agentSummary: "RED · Kampanya engellendi.",
  },
  {
    store: "MMM Konyaaltı", city: "Antalya", hour: "14:00",
    tier: "Premium", reachableUsers: 18_600, activeCustomers: 64_000,
    forecast: fc(6800, 300, -100, 300, 200, 100),
    actual: 7200, gapPct: -1.4, cr: 4.6, crTarget: 4.4,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 17, actualPickingMin: 16, pickingDeviationPct: -5.9, status: "GREEN" },
    courier: { pool: "Antalya", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 28, actualDeliveryMin: 27, etaDeviationPct: -3.6, activeCouriers: 90, orderCount: 7200, courierOrderRatio: 1/80, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Ücretsiz Teslimat",
      offer: "Ücretsiz teslimat (sepet ≥ 250 TL)",
      minBasket: 250, incrementalOrders: 220, incrementalRevenue: 72_000,
      crImpactPct: 0.2, roi: 3.4, cost: 18_000, netContribution: 54_000,
      approval: "Otomatik onaylandı",
      rationale: "Premium yaz sepeti; düşük maliyetli ücretsiz teslimat 3.4x ROI.",
      creative: {
        bannerHeadline: "Sıcakta sen serinle, alışverişi biz getirelim",
        bannerSub: "Konyaaltı MMM · 250 TL üzeri ücretsiz teslimat",
        bannerCta: "Sepeti Tamamla",
        bannerImage: "Plaj şezlongu + soğuk meyve tabağı",
        pushTitle: "Sıcakta dışarı çıkma",
        pushBody: "Konyaaltı MMM'den 250 TL üzeri alışverişe ücretsiz teslimat — kapına gelsin.",
        pushEmoji: "☀️",
        inAppCard: "Bugün hava 34°. Sepetin kapına ücretsiz gelsin.",
        channels: ["Push", "InApp", "Banner"],
        expectedCtr: 7.2, expectedOpenRate: 24.6,
      },
    },
    revision: { forecastOrders: 7600, actualOrders: 7200, endOfDayProjection: 7500, deviationCount: -400, deviationPct: -1.4, weatherMatch: true, specialDayMatch: true, campaignMatch: true, expectedCr: 4.4, actualCr: 4.6, expectedUpliftPct: 3.0, actualUpliftPct: 3.2, revisedForecast: 7500, ordersToRecover: 0, comment: "Tüm varsayımlar doğrulandı." },
    agentSummary: "GREEN · Ücretsiz teslimat otomatik onaylandı.",
  },
  {
    store: "MJet Lara", city: "Antalya", hour: "14:00",
    tier: "Gold", reachableUsers: 15_400, activeCustomers: 64_000,
    forecast: fc(5800, 200, -100, 200, 200, 100),
    actual: 5900, gapPct: -2.1, cr: 4.4, crTarget: 4.3,
    picking: { pickingOk: true, staffOk: true, estPickingMin: 19, actualPickingMin: 19, pickingDeviationPct: 0, status: "GREEN" },
    courier: { pool: "Antalya", capacityOk: true, deliveryOk: true, etaDeviation: false, ratioOk: true, estDeliveryMin: 28, actualDeliveryMin: 27, etaDeviationPct: -3.6, activeCouriers: 90, orderCount: 5900, courierOrderRatio: 1/66, status: "GREEN" },
    opsStatus: "GREEN",
    campaign: {
      type: "Kupon", couponTier: "200 TL üzeri 25 TL kupon",
      offer: "25 TL indirim kuponu (3 saatlik)",
      minBasket: 200, incrementalOrders: 180, incrementalRevenue: 56_000,
      crImpactPct: 0.3, roi: 2.7, cost: 21_000, netContribution: 35_000,
      approval: "Otomatik onaylandı",
      rationale: "Gold segment, akşam yoğunluğu öncesi küçük tetikleme.",
      creative: {
        bannerHeadline: "Lara'ya akşam yemeği bizden",
        bannerSub: "200 TL üzeri sepetlerde 25 TL hediye",
        bannerCta: "Sepete Git",
        bannerImage: "Akşam üstü deniz + masa",
        pushTitle: "Akşam alışverişine 25 TL hediye",
        pushBody: "Lara MJet · 200 TL üzeri alışverişe özel.",
        pushEmoji: "🌅",
        inAppCard: "Lara MJet · Bugün 25 TL kupon hazır.",
        channels: ["Push", "InApp"],
        expectedCtr: 5.0, expectedOpenRate: 18.6,
      },
    },
    revision: { forecastOrders: 6400, actualOrders: 5900, endOfDayProjection: 6200, deviationCount: -500, deviationPct: -2.1, weatherMatch: true, specialDayMatch: true, campaignMatch: true, expectedCr: 4.3, actualCr: 4.4, expectedUpliftPct: 2.5, actualUpliftPct: 2.4, revisedForecast: 6200, ordersToRecover: 0, comment: "Stabil seyir, küçük kupon devrede." },
    agentSummary: "GREEN · 200/25 kupon otomatik onaylandı.",
  },
];

export const cities = Array.from(new Set(stores.map((s) => s.city)));

// ---------- Aggregations ----------
export const totals = {
  forecast: stores.reduce((s, r) => s + r.forecast.finalForecast, 0),
  actual: stores.reduce((s, r) => s + r.actual, 0),
  incrementalOrders: stores.reduce((s, r) => s + r.campaign.incrementalOrders, 0),
  incrementalRevenue: stores.reduce((s, r) => s + r.campaign.incrementalRevenue, 0),
  endOfDayProjection: stores.reduce((s, r) => s + r.revision.endOfDayProjection, 0),
  green: stores.filter((r) => r.opsStatus === "GREEN").length,
  yellow: stores.filter((r) => r.opsStatus === "YELLOW").length,
  red: stores.filter((r) => r.opsStatus === "RED").length,
  avgCr: stores.reduce((s, r) => s + r.cr, 0) / stores.length,
  avgRoi: (() => {
    const active = stores.filter((r) => r.campaign.roi > 0);
    return active.length ? active.reduce((s, r) => s + r.campaign.roi, 0) / active.length : 0;
  })(),
};

export const tierStyle: Record<SegmentTier, string> = {
  Premium:   "bg-foreground/10 text-foreground border border-foreground/30",
  Gold:      "bg-primary/15 text-primary border border-primary/40",
  SubGold:   "bg-primary/10 text-primary/80 border border-primary/25",
  Silver:    "bg-muted text-muted-foreground border border-border",
  SubSilver: "bg-muted/60 text-muted-foreground border border-border",
};

export const opsStyle: Record<OpsStatus, string> = {
  GREEN: "bg-success/15 text-success border border-success/30",
  YELLOW: "bg-warning/20 text-warning border border-warning/40",
  RED: "bg-danger/15 text-danger border border-danger/30",
};

export const opsLabel: Record<OpsStatus, string> = {
  GREEN: "Yeşil · uygun",
  YELLOW: "Sarı · dikkat",
  RED: "Kırmızı · risk",
};

export const campaignStyle: Record<CampaignType, string> = {
  Kupon: "bg-primary/15 text-primary border border-primary/40",
  "Ücretsiz Teslimat": "bg-primary/10 text-primary border border-primary/30",
  Yok: "bg-muted text-muted-foreground border border-border",
};

export const approvalStyle: Record<ApprovalStatus, string> = {
  "Otomatik onaylandı": "bg-success/15 text-success border border-success/30",
  "İnsan onayı gerekli": "bg-warning/20 text-warning border border-warning/40",
  Engellendi: "bg-danger/15 text-danger border border-danger/30",
};

export const fmtMoney = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;
export const fmtNum = (n: number) => n.toLocaleString("tr-TR");
export const fmtPct = (n: number, digits = 1) =>
  `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
