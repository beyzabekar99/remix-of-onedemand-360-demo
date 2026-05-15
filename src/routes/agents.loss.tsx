import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts";
import { AlertTriangle, Truck, Megaphone, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/agents/loss")({
  component: LossPage,
});

// ---------- Mock data ----------

type Category = "Picking" | "Kurye" | "Kampanya" | "Talep";
type Priority = "Yüksek" | "Orta" | "Düşük";

const AVG_BASKET = 750; // TL

const distribution: { key: Category; label: string; orders: number; share: number; color: string; owner: string }[] = [
  { key: "Picking", label: "Picking Kaynaklı", orders: 89, share: 36, color: "#dc2626", owner: "Mağaza Operasyon" },
  { key: "Kurye", label: "Kurye Kaynaklı", orders: 112, share: 45, color: "#f97316", owner: "Kurye Planlama" },
  { key: "Kampanya", label: "Kampanya Kaynaklı", orders: 31, share: 13, color: "#eab308", owner: "CRM / Kampanya" },
  { key: "Talep", label: "Talep Bariyeri", orders: 15, share: 6, color: "#6b7280", owner: "Büyüme / Ürün" },
];

const totalOrders = distribution.reduce((s, d) => s + d.orders, 0);
const totalRevenue = totalOrders * AVG_BASKET;

const pickingRows = [
  { store: "M0145", region: "İstanbul Avrupa", kpi: "Toplama süresi", value: "18 dk", threshold: "12 dk", deviation: "+%50", lostOrders: 45, owner: "Mağaza Op.", suggestion: "Pik saatte +2 danışman, sepet limitini geçici düşür", priority: "Yüksek" as Priority },
  { store: "M0234", region: "İstanbul Anadolu", kpi: "Danışman kapasitesi", value: "%87", threshold: "%90", deviation: "-3 puan", lostOrders: 22, owner: "Mağaza Op.", suggestion: "Vardiya planını revize et, esnek personel devreye al", priority: "Orta" as Priority },
  { store: "M0678", region: "Ankara", kpi: "Mağaza içi SLA", value: "%91", threshold: "%95", deviation: "-4 puan", lostOrders: 22, owner: "Mağaza Op.", suggestion: "Reyon yerleşimi ve rota optimizasyonu çalışılmalı", priority: "Orta" as Priority },
];

const courierRows = [
  { pool: "H001", region: "İstanbul Avrupa", kpi: "Kurye kapasitesi", value: "%78", threshold: "%90", active: 42, orders: 540, ratio: "0.08", lostOrders: 58, owner: "Kurye Planlama", suggestion: "Pik 2 saat için +12 kurye çağrısı", priority: "Yüksek" as Priority },
  { pool: "H004", region: "Ankara", kpi: "ETA sapması", value: "%22", threshold: "%10", active: 28, orders: 310, ratio: "0.09", lostOrders: 34, owner: "Kurye Planlama", suggestion: "Bölge segmentasyonunu daralt, çoklu sipariş kuralını gevşet", priority: "Yüksek" as Priority },
  { pool: "H009", region: "İzmir", kpi: "Aktif kurye / sipariş oranı", value: "0.08", threshold: "0.12", active: 18, orders: 225, ratio: "0.08", lostOrders: 20, owner: "Kurye Planlama", suggestion: "Yedek kurye havuzunu aktive et", priority: "Orta" as Priority },
];

const campaignRows = [
  { region: "İstanbul Anadolu", type: "Kupon", segment: "SubGold", offer: "250 TL üzeri 40 TL", expectedUplift: "%8", actualUplift: "%3", cr: "%14", roi: 0.7, lostOrders: 18, owner: "CRM / Kampanya", suggestion: "Bareme 300 TL üzeri 50 TL'ye taşı, segmenti Gold'a daralt", priority: "Yüksek" as Priority },
  { region: "İzmir", type: "Ücretsiz Teslimat", segment: "Silver", offer: "Tüm sepetler", expectedUplift: "%9", actualUplift: "%3", cr: "%12", roi: 0.9, lostOrders: 13, owner: "CRM / Kampanya", suggestion: "Min sepet 200 TL kuralı ekle, Premium segmente yönlendir", priority: "Orta" as Priority },
];

const demandRows = [
  { region: "Bursa", activeCustomers: "24.500", cr: "%14", expectedCr: "%18", crGap: "-4 puan", forecast: 980, actual: 920, lostOrders: 9, owner: "Büyüme / Ürün", rootCause: "Aktif müşteri yüksek, CR düşük", suggestion: "Şikayet analizi + ürün çeşitliliği denetimi başlat", priority: "Orta" as Priority },
  { region: "Antalya", activeCustomers: "15.200", cr: "%16", expectedCr: "%17", crGap: "-1 puan", forecast: 640, actual: 605, lostOrders: 6, owner: "Büyüme / Ürün", rootCause: "Operasyon ve kampanya uygun ama büyüme yok", suggestion: "Fiyat rekabeti ve assortment analizi yap", priority: "Düşük" as Priority },
];

// ---------- Helpers ----------

const fmtTL = (n: number) => n.toLocaleString("tr-TR") + " TL";
const fmtN = (n: number) => n.toLocaleString("tr-TR");

function PriorityBadge({ p }: { p: Priority }) {
  const map: Record<Priority, string> = {
    Yüksek: "bg-red-100 text-red-700 border-red-200",
    Orta: "bg-orange-100 text-orange-700 border-orange-200",
    Düşük: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[p]}`}>{p}</span>;
}

function CategoryBadge({ c }: { c: Category }) {
  const map: Record<Category, string> = {
    Picking: "bg-red-100 text-red-700 border-red-200",
    Kurye: "bg-orange-100 text-orange-700 border-orange-200",
    Kampanya: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Talep: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const label: Record<Category, string> = {
    Picking: "Picking",
    Kurye: "Kurye",
    Kampanya: "Kampanya",
    Talep: "Talep Bariyeri",
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[c]}`}>{label[c]}</span>;
}

function Kpi({ label, value, hint, accent, highlight }: { label: string; value: string; hint?: string; accent?: string; highlight?: boolean }) {
  return (
    <Card
      className={`relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(237,118,37,0.45)] ${highlight ? "border-primary/40" : ""}`}
    >
      {highlight && (
        <div
          aria-hidden
          className="absolute inset-0 -z-0 opacity-80"
          style={{
            background:
              "radial-gradient(180px circle at 100% 0%, rgba(237,118,37,0.18), transparent 60%)",
          }}
        />
      )}
      <CardContent className="relative p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`mt-1 text-xl font-semibold ${accent ?? ""}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

// ---------- Page ----------

function LossPage() {
  const biggest = [...distribution].sort((a, b) => b.orders - a.orders)[0];

  const financial = distribution.map((d) => ({
    ...d,
    revenue: d.orders * AVG_BASKET,
    extraOrderPotential: Math.round(d.orders * 0.85),
    extraRevenuePotential: Math.round(d.orders * 0.85) * AVG_BASKET,
    priority: d.orders >= 100 ? "Yüksek" : d.orders >= 50 ? "Orta" : "Düşük",
  }));

  return (
    <AppShell>
      <PageHeader
        title="Loss & Root Cause Agent"
        subtitle="Kayıp sipariş ve ciro etkisini kök neden bazında sınıflandırır, aksiyon sahibini belirler."
      />

      {/* Agent açıklama */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="p-4 flex gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Loss & Root Cause Agent, hedeflenen sipariş ile gerçekleşen veya projekte sipariş arasındaki farkı analiz eder.
            Kayıpları <b>Picking</b>, <b>Kurye</b>, <b>Kampanya</b> ve <b>Talep bariyeri</b> olarak sınıflandırır.
            Her kök neden için kaçan sipariş ve kaçan ciro etkisini hesaplar, aksiyon sahibini belirler ve bu öğrenimleri
            diğer agent'lara geri besler.
          </p>
        </CardContent>
      </Card>

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <Kpi label="Toplam kaçan sipariş" value={fmtN(totalOrders)} accent="text-red-600" highlight />
        <Kpi label="Toplam kaçan ciro" value={fmtTL(totalRevenue)} accent="text-red-600" highlight />
        <Kpi label="En büyük kayıp nedeni" value={biggest.label} hint={`${biggest.orders} sipariş · %${biggest.share}`} highlight />
        <Kpi label="Picking kaynaklı" value="89 sipariş" hint="Mağaza Operasyon" />
        <Kpi label="Kurye kaynaklı" value="112 sipariş" hint="Kurye Planlama" />
        <Kpi label="Kampanya kaynaklı" value="31 sipariş" hint="CRM / Kampanya" />
        <Kpi label="Talep bariyeri" value="15 sipariş" hint="Büyüme / Ürün" />
        <Kpi label="Etkilenen bölge" value="5" />
        <Kpi label="Etkilenen mağaza" value="3" />
        <Kpi label="Etkilenen kurye havuzu" value="3" />
      </div>

      {/* Dağılım grafiği + tablo */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Kayıp Dağılımı</CardTitle>
            <CardDescription>Kök neden kategorisine göre kaçan sipariş payı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="orders"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {distribution.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                  <RTooltip formatter={(v: number) => `${v} sipariş`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detay Dağılım Tablosu</CardTitle>
            <CardDescription>Kategori bazlı sipariş, ciro ve aksiyon sahibi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Kaçan sipariş</TableHead>
                  <TableHead className="text-right">Pay</TableHead>
                  <TableHead className="text-right">Kaçan ciro</TableHead>
                  <TableHead>Aksiyon sahibi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distribution.map((d) => (
                  <TableRow key={d.key}>
                    <TableCell><CategoryBadge c={d.key} /></TableCell>
                    <TableCell className="text-right">{d.orders}</TableCell>
                    <TableCell className="text-right">%{d.share}</TableCell>
                    <TableCell className="text-right">{fmtTL(d.orders * AVG_BASKET)}</TableCell>
                    <TableCell>{d.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Kök Neden Sınıflandırma Kartları */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle>A · Picking Kaynaklı Engeller</CardTitle>
            </div>
            <CardDescription>Mağaza bazlı · Aksiyon sahibi: Mağaza Operasyon ekibi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Toplama süresi SLA'yı aşıyor</li>
              <li>Alışveriş danışmanı kapasitesi yetersiz</li>
              <li>Mağaza içi SLA ihlali</li>
              <li>Tahmini ile gerçekleşen toplama süresi arasında yüksek sapma</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-600" />
              <CardTitle>B · Kurye Kaynaklı Engeller</CardTitle>
            </div>
            <CardDescription>Havuz / Bölge bazlı · Aksiyon sahibi: Kurye Planlama ekibi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Kurye havuzu kapasitesi yetersiz</li>
              <li>Ortalama teslimat süresi yüksek</li>
              <li>ETA sapması kritik seviyede</li>
              <li>Aktif kurye / sipariş oranı düşük</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-yellow-600" />
              <CardTitle>C · Kampanya Kaynaklı Engeller</CardTitle>
            </div>
            <CardDescription>Bölge bazlı · Aksiyon sahibi: CRM / Kampanya ekibi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>ROI negatif olduğu için kampanya açılmadı</li>
              <li>Tüm kampanya tipleri uplift açısından yetersiz kaldı</li>
              <li>Segment ulaşılabilirliği düşük</li>
              <li>Açılan kampanya etkisiz kaldı</li>
              <li>Kupon baremi hedef segment için uygun değil</li>
              <li>Ücretsiz teslimat beklenen CR artışını yaratmadı</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <CardTitle>D · Talep Bariyeri</CardTitle>
            </div>
            <CardDescription>Bölge bazlı · Aksiyon sahibi: Büyüme / Ürün ekibi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Operasyon KPI'ları uygun ve kampanya yeterli olmasına rağmen beklenen büyüme gerçekleşmediyse talep
              bariyeri olarak sınıflandırılır.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Müşteri şikayet analizi başlatılmalı</li>
              <li>Ürün çeşitliliği yetersiz olabilir</li>
              <li>Fiyat rekabeti sorunu olabilir</li>
              <li>Müşteri deneyimi sorunu olabilir</li>
              <li>Bölgesel talep potansiyeli beklenenden düşük</li>
              <li>Aktif müşteri yüksek ama CR düşük</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Finansal Etki */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Kaçan Sipariş Hesabı</CardTitle>
            <CardDescription>
              Formül: <code className="bg-muted px-1 py-0.5 rounded">Kaçan sipariş = Hedef sipariş − Gerçekleşen / projekte sipariş</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Operasyonel engel olmasaydı, kampanya uygun çalışsaydı veya talep bariyeri çözülseydi ne kadar ek sipariş
            gelebileceği kök neden bazında hesaplanır.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kaçan Ciro Hesabı</CardTitle>
            <CardDescription>
              Formül: <code className="bg-muted px-1 py-0.5 rounded">Kaçan ciro = Kaçan sipariş × Ortalama sepet tutarı</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            KPI düzelse açılacak ek sipariş ve ciro potansiyeli bölge, mağaza ve kurye havuzu bazında raporlanır.
            Ortalama sepet tutarı: <b>{fmtTL(AVG_BASKET)}</b>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Finansal Etki Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kök neden</TableHead>
                <TableHead className="text-right">Kaçan sipariş</TableHead>
                <TableHead className="text-right">Ort. sepet</TableHead>
                <TableHead className="text-right">Kaçan ciro</TableHead>
                <TableHead className="text-right">Ek sipariş potansiyeli</TableHead>
                <TableHead className="text-right">Ek ciro potansiyeli</TableHead>
                <TableHead>Öncelik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financial.map((f) => (
                <TableRow key={f.key}>
                  <TableCell><CategoryBadge c={f.key} /></TableCell>
                  <TableCell className="text-right">{f.orders}</TableCell>
                  <TableCell className="text-right">{fmtTL(AVG_BASKET)}</TableCell>
                  <TableCell className="text-right">{fmtTL(f.revenue)}</TableCell>
                  <TableCell className="text-right">{f.extraOrderPotential}</TableCell>
                  <TableCell className="text-right">{fmtTL(f.extraRevenuePotential)}</TableCell>
                  <TableCell><PriorityBadge p={f.priority as Priority} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detay Tablosu - Sekmeli */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detay Tablosu</CardTitle>
          <CardDescription>Kök neden kategorisine göre filtrelenebilir detaylar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="picking">
            <TabsList>
              <TabsTrigger value="picking">Picking Kaynaklı</TabsTrigger>
              <TabsTrigger value="kurye">Kurye Kaynaklı</TabsTrigger>
              <TabsTrigger value="kampanya">Kampanya Kaynaklı</TabsTrigger>
              <TabsTrigger value="talep">Talep Bariyeri</TabsTrigger>
            </TabsList>

            <TabsContent value="picking">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mağaza</TableHead>
                    <TableHead>Bölge</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Değer</TableHead>
                    <TableHead>Eşik</TableHead>
                    <TableHead>Sapma</TableHead>
                    <TableHead className="text-right">Kaçan sipariş</TableHead>
                    <TableHead className="text-right">Kaçan ciro</TableHead>
                    <TableHead>Aksiyon sahibi</TableHead>
                    <TableHead>Agent önerisi</TableHead>
                    <TableHead>Öncelik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickingRows.map((r) => (
                    <TableRow key={r.store}>
                      <TableCell className="font-medium">{r.store}</TableCell>
                      <TableCell>{r.region}</TableCell>
                      <TableCell>{r.kpi}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell>{r.threshold}</TableCell>
                      <TableCell className="text-red-600">{r.deviation}</TableCell>
                      <TableCell className="text-right">{r.lostOrders}</TableCell>
                      <TableCell className="text-right">{fmtTL(r.lostOrders * AVG_BASKET)}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs">{r.suggestion}</TableCell>
                      <TableCell><PriorityBadge p={r.priority} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="kurye">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Havuz</TableHead>
                    <TableHead>Bölge</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Değer</TableHead>
                    <TableHead>Eşik</TableHead>
                    <TableHead className="text-right">Aktif kurye</TableHead>
                    <TableHead className="text-right">Sipariş</TableHead>
                    <TableHead className="text-right">Oran</TableHead>
                    <TableHead className="text-right">Kaçan sipariş</TableHead>
                    <TableHead className="text-right">Kaçan ciro</TableHead>
                    <TableHead>Aksiyon sahibi</TableHead>
                    <TableHead>Agent önerisi</TableHead>
                    <TableHead>Öncelik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courierRows.map((r) => (
                    <TableRow key={r.pool}>
                      <TableCell className="font-medium">{r.pool}</TableCell>
                      <TableCell>{r.region}</TableCell>
                      <TableCell>{r.kpi}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell>{r.threshold}</TableCell>
                      <TableCell className="text-right">{r.active}</TableCell>
                      <TableCell className="text-right">{r.orders}</TableCell>
                      <TableCell className="text-right">{r.ratio}</TableCell>
                      <TableCell className="text-right">{r.lostOrders}</TableCell>
                      <TableCell className="text-right">{fmtTL(r.lostOrders * AVG_BASKET)}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs">{r.suggestion}</TableCell>
                      <TableCell><PriorityBadge p={r.priority} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="kampanya">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bölge</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Offer / Barem</TableHead>
                    <TableHead>Beklenen uplift</TableHead>
                    <TableHead>Gerçekleşen</TableHead>
                    <TableHead>CR</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Kaçan sipariş</TableHead>
                    <TableHead className="text-right">Kaçan ciro</TableHead>
                    <TableHead>Aksiyon sahibi</TableHead>
                    <TableHead>Agent önerisi</TableHead>
                    <TableHead>Öncelik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignRows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.region}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.segment}</TableCell>
                      <TableCell>{r.offer}</TableCell>
                      <TableCell>{r.expectedUplift}</TableCell>
                      <TableCell className="text-red-600">{r.actualUplift}</TableCell>
                      <TableCell>{r.cr}</TableCell>
                      <TableCell className={`text-right ${r.roi < 1 ? "text-red-600" : ""}`}>{r.roi.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{r.lostOrders}</TableCell>
                      <TableCell className="text-right">{fmtTL(r.lostOrders * AVG_BASKET)}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs">{r.suggestion}</TableCell>
                      <TableCell><PriorityBadge p={r.priority} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="talep">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bölge</TableHead>
                    <TableHead className="text-right">Aktif müşteri</TableHead>
                    <TableHead>CR</TableHead>
                    <TableHead>Beklenen CR</TableHead>
                    <TableHead>CR sapması</TableHead>
                    <TableHead className="text-right">Forecast</TableHead>
                    <TableHead className="text-right">Gerçekleşen</TableHead>
                    <TableHead className="text-right">Kaçan sipariş</TableHead>
                    <TableHead className="text-right">Kaçan ciro</TableHead>
                    <TableHead>Olası kök neden</TableHead>
                    <TableHead>Aksiyon sahibi</TableHead>
                    <TableHead>Agent önerisi</TableHead>
                    <TableHead>Öncelik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandRows.map((r) => (
                    <TableRow key={r.region}>
                      <TableCell className="font-medium">{r.region}</TableCell>
                      <TableCell className="text-right">{r.activeCustomers}</TableCell>
                      <TableCell>{r.cr}</TableCell>
                      <TableCell>{r.expectedCr}</TableCell>
                      <TableCell className="text-red-600">{r.crGap}</TableCell>
                      <TableCell className="text-right">{r.forecast}</TableCell>
                      <TableCell className="text-right">{r.actual}</TableCell>
                      <TableCell className="text-right">{r.lostOrders}</TableCell>
                      <TableCell className="text-right">{fmtTL(r.lostOrders * AVG_BASKET)}</TableCell>
                      <TableCell className="text-xs">{r.rootCause}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs">{r.suggestion}</TableCell>
                      <TableCell><PriorityBadge p={r.priority} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Öğrenim Geri Beslemesi */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Öğrenim Geri Beslemesi</CardTitle>
          </div>
          <CardDescription>
            Loss & Root Cause Agent'ın Forecast, Campaign ve Execution Agent'lara aktardığı öğrenimler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><Badge variant="outline">Campaign</Badge>Kurye kapasitesi yetersiz olan bölgelerde kampanya önerileri daha konservatif yapılmalı.</li>
            <li className="flex gap-2"><Badge variant="outline">Campaign</Badge>Toplama süresi SLA'yı aşan mağazalarda ücretsiz teslimat kampanyası önerilmemeli.</li>
            <li className="flex gap-2"><Badge variant="outline">Campaign</Badge>ROI negatif çıkan kupon baremleri Campaign Agent tarafından tekrar önerilmemeli.</li>
            <li className="flex gap-2"><Badge variant="outline">Growth</Badge>Talep bariyeri oluşan bölgelerde kampanya yerine ürün çeşitliliği, fiyat rekabeti veya müşteri deneyimi analizi önerilmeli.</li>
            <li className="flex gap-2"><Badge variant="outline">Forecast</Badge>Kampanya beklenen uplift'i yaratmadıysa forecast modelindeki kampanya etkisi katsayısı revize edilmeli.</li>
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}
