import { TrendingUp, TrendingDown, IndianRupee, Wallet } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AssetClass } from "@/data/portfolioData";

interface AssetSummaryCardProps {
  asset: AssetClass;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function AssetSummaryCard({ asset }: AssetSummaryCardProps) {
  const isPositive = asset.returns >= 0;
  const IconComponent = (Icons as any)[asset.icon] || Icons.Wallet;

  const stats = [
    {
      label: "Total Invested",
      value: formatCurrency(asset.totalInvested),
      icon: Wallet,
    },
    {
      label: "Current Value",
      value: formatCurrency(asset.currentValue),
      icon: IndianRupee,
    },
    {
      label: "Total Returns",
      value: `${isPositive ? "+" : ""}${formatCurrency(Math.abs(asset.returns))}`,
      subtitle: `${isPositive ? "+" : ""}${asset.returnsPercentage.toFixed(1)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      isPositive,
    },
  ];

  return (
    <Card
      className="relative overflow-hidden border-0 shadow-card animate-slide-up"
      style={{
        background: `linear-gradient(135deg, ${asset.color}15 0%, ${asset.color}05 100%)`,
      }}
    >
      {/* Decorative element */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
        style={{ backgroundColor: asset.color }}
      />

      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${asset.color}20` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: asset.color }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {asset.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {asset.holdings.length} holdings
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    stat.isPositive !== undefined
                      ? stat.isPositive
                        ? "text-success"
                        : "text-destructive"
                      : "text-foreground"
                  )}
                >
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat.isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    ({stat.subtitle})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
