import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentFlow } from "@/components/AgentFlow";
import { TechStackFlow } from "@/components/TechStackFlow";
import {
  Brain,
  GitBranch,
  PlayCircle,
  Megaphone,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Database,
  Cloud,
  CalendarDays,
  Users,
  Truck,
  ShoppingBasket,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

const agents = [
  {
    to: "/agents/forecast",
    icon: Brain,
    name: "Forecast Agent",
    role: "Talep tahmini üretir",
    detail:
      "Baz sipariş, aktif müşteri, dönüşüm oranı, kampanya etkisi, hava durumu ve özel gün katsayılarını birleştirip mağaza bazında günlük forecast üretir.",
    color: "from-[#FFB066] to-[#ED7625]",
  },
  {
    to: "/agents/revision",
    icon: GitBranch,
    name: "Revision Agent",
    role: "Forecast'i gün içinde günceller",
    detail:
      "Varsayım vs gerçekleşen sapmalarını izler (hava, kampanya, kurye), gün sonu projeksiyonunu revize edip toparlanma planı üretir.",
    color: "from-[#FFB066] to-[#ED7625]",
  },
  {
    to: "/agents/execution",
    icon: PlayCircle,
    name: "Execution Agent",
    role: "Operasyonel guardrail uygular",
    detail:
      "Picking ve kurye kapasitesine göre mağaza bazında YEŞİL / SARI / KIRMIZI durumu hesaplar, kampanya açılıp açılamayacağına karar verir.",
    color: "from-[#F39455] to-[#ED7625]",
  },
  {
    to: "/agents/campaign",
    icon: Megaphone,
    name: "Campaign Agent",
    role: "Doğru aksiyonu önerir",
    detail:
      "Segment bazlı dönüşüm açığını ve ROI projeksiyonunu hesaplar, ücretsiz teslimat veya kupon önerir; uygunluğa göre otomatik veya onaylı yayına alır.",
    color: "from-[#ED7625] to-[#B8470F]",
  },
  {
    to: "/agents/creative",
    icon: Sparkles,
    name: "Creative Agent",
    role: "Yaratıcı üretimi otomatikleştirir",
    detail:
      "Aktif kampanyalara özel banner, push ve in-app metni üretir; CTR / Open Rate beklentisini gösterir, görselleri PNG ve SVG olarak indirilebilir kılar.",
    color: "from-[#ED7625] to-[#B8470F]",
  },
  {
    to: "/agents/loss",
    icon: AlertTriangle,
    name: "Loss & Root Cause Agent",
    role: "Kayıp nedenini sınıflandırır",
    detail:
      "Hedef ile gerçekleşen arasındaki farkı Picking, Kurye, Kampanya ve Talep Bariyeri olarak sınıflandırır; kaçan sipariş ve cironun aksiyon sahibini belirler, öğrenimi diğer agent'lara geri besler.",
    color: "from-[#B8470F] to-[#ED7625]",
  },
];

const inputs = [
  { icon: Database, label: "Sipariş & ciro tarihçesi", hint: "Mağaza × saat × segment" },
  { icon: Users, label: "Aktif müşteri & CR", hint: "Segment bazlı (Premium → SubSilver)" },
  { icon: Cloud, label: "Hava durumu sinyali", hint: "Yağış, sıcaklık, rüzgâr" },
  { icon: CalendarDays, label: "Özel gün takvimi", hint: "Bayram, maaş, okul, lansman" },
  { icon: Truck, label: "Kurye havuzu KPI'ları", hint: "Aktif kurye, ETA, kapasite" },
  { icon: ShoppingBasket, label: "Mağaza picking KPI'ları", hint: "Toplama süresi, danışman, SLA" },
];

const principles = [
  {
    title: "Veriden aksiyona kapalı döngü",
    body: "Her agent diğerinin çıktısını input olarak kullanır. Loss & Root Cause çıktısı geri besleme olarak Forecast ve Campaign'e döner.",
  },
  {
    title: "Guardrail önce, kampanya sonra",
    body: "Operasyon kapasitesi yetersizken kampanya açılmaz. Önce Execution YEŞİL der, sonra Campaign tetiklenir.",
  },
  {
    title: "ROI temelli karar",
    body: "Kampanya yalnızca beklenen uplift × sepet > kampanya maliyeti olduğunda önerilir. ROI negatifse kampanya tipi değiştirilir veya açılmaz.",
  },
  {
    title: "Segment bazlı hassasiyet",
    body: "Aksiyonlar mağaza segmenti (Premium / Gold / SubGold / Silver / SubSilver) ve ulaşılabilir kullanıcı sayısı üzerinden boyutlandırılır.",
  },
];

function HowItWorksPage() {
  return (
    <AppShell>
      <PageHeader
        title="Nasıl Çalışır"
        subtitle="OneDemand 360, talep tahmininden kampanyaya, operasyon guardrail'inden kayıp analizine kadar tüm zinciri altı uzman agent ile orkestre eder."
      />

      {/* Hero gradient card */}
      <Card className="mb-8 overflow-hidden border-0 shadow-[0_20px_60px_-20px_rgba(237,118,37,0.45)]">
        <div
          className="relative p-8 text-white"
          style={{
            background:
              "linear-gradient(135deg, #ED7625 0%, #F39455 45%, #B8470F 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(500px circle at 80% 20%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(400px circle at 10% 90%, rgba(0,0,0,0.25), transparent 50%)",
            }}
          />
          <div className="relative">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur">
              Orkestrasyon Mimarisi
            </Badge>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold leading-tight max-w-3xl">
              Talep sinyali yakala · Kapasiteyi koru · ROI'li kampanyayı tetikle ·
              Kaybı öğren
            </h2>
            <p className="mt-3 text-white/85 max-w-2xl text-sm">
              Günlük ~140.000 grocery siparişi, 13 mağaza, 5 şehir ve 5 segment için
              dakikalık karar döngüsü.
            </p>
          </div>
        </div>
      </Card>

      {/* Animated agent flow diagram */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Karar Akışı</h3>
        <AgentFlow />
      </div>

      {/* Tech stack stepper */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Teknoloji Seti</h3>
        <TechStackFlow />
      </div>

      {/* Inputs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Girdi Sinyalleri</CardTitle>
          <CardDescription>
            Forecast ve Revision Agent'larının kullandığı sinyaller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inputs.map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 bg-gradient-to-br from-background to-muted/40"
              >
                <div className="h-9 w-9 rounded-md bg-gradient-to-br from-[#FFB066] to-[#ED7625] flex items-center justify-center text-white shrink-0">
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.hint}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Agent Detayları</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {agents.map((a) => (
            <Card key={a.to} className="overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${a.color}`} />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-[0_6px_18px_-6px_rgba(237,118,37,0.6)]`}
                  >
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{a.name}</CardTitle>
                    <CardDescription>{a.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.detail}</p>
                <Link
                  to={a.to}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Ekrana git <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Principles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tasarım Prensipleri</CardTitle>
          <CardDescription>OneDemand 360'ı yöneten dört temel kural</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="rounded-lg border border-border/60 p-4 bg-gradient-to-br from-background to-muted/40"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary">0{i + 1}</span>
                  <div className="text-sm font-semibold">{p.title}</div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
