import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ContributionCategory, Currency } from "../backend.d";
import {
  useContributionTotal,
  useContributionsByCategory,
} from "../hooks/useQueries";
import { formatAmount } from "../utils/formatters";

export function FinancialOverview() {
  const { data: irayidiTotal = 0 } = useContributionTotal(
    ContributionCategory.Irayidi,
  );
  const { data: zakatTotal = 0 } = useContributionTotal(
    ContributionCategory.ZakatulFitr,
  );
  const { data: musabakaTotal = 0 } = useContributionTotal(
    ContributionCategory.Musabaka,
  );
  const { data: allContributions = [] } = useContributionsByCategory(
    ContributionCategory.Musabaka,
  );
  const { data: irayidiContributions = [] } = useContributionsByCategory(
    ContributionCategory.Irayidi,
  );

  const chartData = [
    { name: "Irayidi", amount: irayidiTotal, fill: "#0F5B3A" },
    { name: "Zakatul Fitr", amount: zakatTotal, fill: "#B8944E" },
    { name: "Musabaka", amount: musabakaTotal, fill: "#1a7a50" },
  ];

  const allDonors = [...allContributions, ...irayidiContributions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Financial Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Transparency in every contribution
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="rounded-2xl shadow-card">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: "#0F5B3A" }}>
                Contributions by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v: number) => [
                      formatAmount(v, Currency.RWF),
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="rounded-2xl shadow-card">
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: "#0F5B3A" }}>
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allDonors.length === 0 ? (
                <p
                  className="text-muted-foreground text-sm text-center py-4"
                  data-ocid="contributors.empty_state"
                >
                  No contributions yet
                </p>
              ) : (
                allDonors.map((c, i) => (
                  <div
                    key={`${c.donorName}-${c.amount}`}
                    className="flex items-center gap-3"
                    data-ocid={`contributors.item.${i + 1}`}
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback
                        style={{
                          backgroundColor: i % 2 === 0 ? "#E8F5EE" : "#FEF3E2",
                          color: i % 2 === 0 ? "#0F5B3A" : "#B8944E",
                        }}
                      >
                        {c.donorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {c.donorName}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#0F5B3A" }}
                    >
                      {formatAmount(c.amount, Currency.RWF)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
