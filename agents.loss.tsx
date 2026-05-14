import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtMoney, fmtNum, stores } from "@/lib/demo-data";
import {
  AlertTriangle,
  ArrowRight,
  Megaphone,
  ShieldAlert,
  Truck,
  Users,
} from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";

export const Route = createFileRoute("/agents/loss")({
  component: LossPage,
});

type Category = "Picking" | "Courier" | "Campaign" | "Demand";
type LossRow = {
  campaignLoss: number;
  courierLoss: number;
  demandLoss: number;
  pickingLoss: number;
  recoverable: number;
  store: (typeof stores)[number];
};

const AVG_BASKET = 720;
const COLORS: Record<Category, string> = {
  Picking: "#b8470f",
  Courier: "#ed7625",
  Campaign: "#f5a261",
  Demand: "#6b7280",
};

function LossPage() {
  const analytics = useMemo(() => buildLossAnalytics(), []);

  return (
    <AppShell>
      <PageHeader
        title="Loss Feedback Agent"
        subtitle="The recovery loop is no longer mocked: loss attribution is now derived directly from live store demand, guardrail and campaign signals."
      />

      <section className="rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white p-5 shadow-[0_24px_40px_-30px_rgba(237,118,37,0.4)]">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary/75">
              Handoff back into the system
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {fmtNum(analytics.totalOrders)} recoverable orders are being classified before the next forecast cycle.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Instead of standalone mock tables, this screen now traces store-level demand loss into operational, courier, campaign and pure demand barriers so Forecast, Execution and Campaign can learn from the same source of truth.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <TopMetric label="Recoverable value" value={fmtMoney(analytics.totalRevenue)} />
            <TopMetric label="Largest barrier" value={analytics.primaryBarrier} />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <StatCard label="Picking-attributed" value={fmtNum(analytics.byCategory.Picking.orders)} hint="Store operations" tone="danger" />
        <StatCard label="Courier-attributed" value={fmtNum(analytics.byCategory.Courier.orders)} hint="Fleet planning" tone="warning" />
        <StatCard label="Campaign-attributed" value={fmtNum(analytics.byCategory.Campaign.orders)} hint="Offer and approval logic" tone="default" />
        <StatCard label="Demand barrier" value={fmtNum(analytics.byCategory.Demand.orders)} hint="Product and growth signal" tone="default" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[28px] border-border/70 shadow-[0_22px_38px_-32px_rgba(15,23,42,0.38)]">
          <CardHeader>
            <CardTitle>Loss distribution</CardTitle>
            <CardDescription>Derived from `ordersToRecover`, operational status and campaign logic.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.distribution}
                    dataKey="orders"
                    nameKey="label"
                    innerRadius={64}
                    outerRadius={104}
                    paddingAngle={3}
                  >
                    {analytics.distribution.map((item) => (
                      <Cell key={item.key} fill={item.color} />
                    ))}
                  </Pie>
                  <RTooltip formatter={(value: number) => `${fmtNum(value)} orders`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/70 shadow-[0_22px_38px_-32px_rgba(15,23,42,0.38)]">
          <CardHeader>
            <CardTitle>Closed-loop feedback</CardTitle>
            <CardDescription>How each barrier informs the next agent in the sequence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.feedback.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{item.title}</div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary">
                  {item.owner}
                  <ArrowRight className="h-3 w-3" />
                  {item.nextAgent}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DerivedTable
          description="Stores where in-store operations explain most of the recovery gap."
          icon={StoreIcon}
          rows={analytics.storeRows}
          title="Store operations barriers"
          valueLabel="Picking pressure"
        />
        <DerivedTable
          description="Stores where courier pool or ETA prevents safe demand stimulation."
          icon={Truck}
          rows={analytics.courierRows}
          title="Courier barriers"
          valueLabel="Courier pressure"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <DerivedTable
          description="Where offer strategy or approval frictions explain the remaining gap."
          icon={Megaphone}
          rows={analytics.campaignRows}
          title="Campaign barriers"
          valueLabel="Campaign pressure"
        />
        <DerivedTable
          description="Stores with residual demand loss after operations and campaigns are considered."
          icon={Users}
          rows={analytics.demandRows}
          title="Demand barriers"
          valueLabel="Demand pressure"
        />
      </div>
    </AppShell>
  );
}

function buildLossAnalytics() {
  const rows = stores.map((store) => {
    const recoverable = Math.max(store.revision.ordersToRecover, 0);
    const pickingWeight = store.picking.status === "RED" ? 0.45 : store.picking.status === "YELLOW" ? 0.25 : 0.08;
    const courierWeight = store.courier.status === "RED" ? 0.48 : store.courier.status === "YELLOW" ? 0.28 : 0.1;
    const campaignWeight =
      store.campaign.approval === "Engellendi"
        ? 0.24
        : store.campaign.approval === "İnsan onayı gerekli"
          ? 0.18
          : store.campaign.type === "Yok"
            ? 0.15
            : 0.08;
    const demandWeight = Math.max(0.08, 1 - (pickingWeight + courierWeight + campaignWeight));
    const totalWeight = pickingWeight + courierWeight + campaignWeight + demandWeight;

    const pickingLoss = Math.round((recoverable * pickingWeight) / totalWeight);
    const courierLoss = Math.round((recoverable * courierWeight) / totalWeight);
    const campaignLoss = Math.round((recoverable * campaignWeight) / totalWeight);
    const demandLoss = Math.max(0, recoverable - pickingLoss - courierLoss - campaignLoss);

    return {
      campaignLoss,
      courierLoss,
      demandLoss,
      pickingLoss,
      recoverable,
      store,
    };
  });

  const byCategory = {
    Picking: aggregateCategory(rows, "pickingLoss"),
    Courier: aggregateCategory(rows, "courierLoss"),
    Campaign: aggregateCategory(rows, "campaignLoss"),
    Demand: aggregateCategory(rows, "demandLoss"),
  };

  const distribution = (Object.keys(byCategory) as Category[]).map((key) => ({
    color: COLORS[key],
    key,
    label: key,
    orders: byCategory[key].orders,
  }));

  const totalOrders = distribution.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = totalOrders * AVG_BASKET;
  const primaryBarrier = [...distribution].sort((a, b) => b.orders - a.orders)[0]?.label ?? "—";

  return {
    byCategory,
    campaignRows: rankedRows(rows, "campaignLoss"),
    courierRows: rankedRows(rows, "courierLoss"),
    demandRows: rankedRows(rows, "demandLoss"),
    distribution,
    feedback: [
      {
        body: "Store staffing and picking duration are fed back to Execution so demand is not reopened before operational health is restored.",
        icon: ShieldAlert,
        nextAgent: "Execution Agent",
        owner: "Store operations",
        title: "Picking issues tighten guardrails",
      },
      {
        body: "Courier pool stress is sent back to Revision and Execution to cap the demand curve and rebalance ETA assumptions.",
        icon: Truck,
        nextAgent: "Revision + Execution",
        owner: "Fleet planning",
        title: "Courier pressure rewrites delivery assumptions",
      },
      {
        body: "Offer misses and approval delays inform Campaign Agent on which mechanic, segment and threshold should be tested next.",
        icon: Megaphone,
        nextAgent: "Campaign Agent",
        owner: "CRM / growth",
        title: "Campaign misses refine the next offer",
      },
      {
        body: "Residual unexplained loss returns to Forecast as a demand-side barrier, improving baseline and CR assumptions for the next cycle.",
        icon: Users,
        nextAgent: "Forecast Agent",
        owner: "Product / growth",
        title: "Demand barriers close the learning loop",
      },
    ],
    primaryBarrier,
    storeRows: rankedRows(rows, "pickingLoss"),
    totalOrders,
    totalRevenue,
  };
}

function aggregateCategory(
  rows: LossRow[],
  key: "pickingLoss" | "courierLoss" | "campaignLoss" | "demandLoss"
) {
  return {
    orders: rows.reduce((sum, row) => sum + row[key], 0),
  };
}

function rankedRows(
  rows: LossRow[],
  key: "pickingLoss" | "courierLoss" | "campaignLoss" | "demandLoss"
) {
  return rows
    .map((row) => ({
      city: row.store.city,
      comment: row.store.revision.comment,
      orders: row[key],
      rationale: row.store.campaign.rationale,
      status: row.store.opsStatus,
      store: row.store.store,
      totalRecoverable: row.recoverable,
    }))
    .filter((row) => row.orders > 0)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
}

function DerivedTable({
  description,
  icon: Icon,
  rows,
  title,
  valueLabel,
}: {
  description: string;
  icon: any;
  rows: Array<{
    city: string;
    comment: string;
    orders: number;
    rationale: string;
    status: string;
    store: string;
    totalRecoverable: number;
  }>;
  title: string;
  valueLabel: string;
}) {
  return (
    <Card className="rounded-[28px] border-border/70 shadow-[0_22px_38px_-32px_rgba(15,23,42,0.38)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">{valueLabel}</TableHead>
              <TableHead className="text-right">Recoverable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${title}-${row.store}`}>
                <TableCell>
                  <div className="font-medium text-foreground">{row.store}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{row.city}</div>
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtNum(row.orders)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtNum(row.totalRecoverable)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 space-y-3">
          {rows.slice(0, 3).map((row) => (
            <div key={`${row.store}-note`} className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="text-sm font-semibold text-foreground">{row.store}</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">{row.rationale}</div>
              <div className="mt-2 text-xs leading-5 text-muted-foreground">{row.comment}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  hint,
  label,
  tone,
  value,
}: {
  hint: string;
  label: string;
  tone: "danger" | "warning" | "default";
  value: string;
}) {
  const toneClass = {
    danger: "text-danger",
    warning: "text-warning",
    default: "text-foreground",
  }[tone];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-[0_20px_34px_-30px_rgba(15,23,42,0.38)]">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
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
