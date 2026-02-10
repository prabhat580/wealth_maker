import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AssetClass } from "@/data/portfolioData";

interface AssetClassCardProps {
  asset: AssetClass;
  index: number;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const getHref = (id: string) => {
  const routes: Record<string, string> = {
    "mutual-funds": "/mutual-funds",
    stocks: "/stocks",
    "fixed-deposits": "/fixed-deposits",
    insurance: "/insurance",
    bonds: "/bonds",
    "unlisted-equity": "/unlisted-equity",
    "ncd-mld": "/ncd-mld",
  };
  return routes[id] || "/";
};

export function AssetClassCard({ asset, index }: AssetClassCardProps) {
  const isPositive = asset.returns >= 0;
  const IconComponent = (Icons as any)[asset.icon] || Icons.Wallet;

  return (
    <Link to={getHref(asset.id)}>
      <Card
        className={cn(
          "group relative overflow-hidden border-0 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up opacity-0 cursor-pointer",
          `stagger-${(index % 4) + 1}`
        )}
      >
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-2"
          style={{ backgroundColor: asset.color }}
        />

        <CardHeader className="pb-2 pl-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${asset.color}20` }}
              >
                <IconComponent
                  className="h-5 w-5"
                  style={{ color: asset.color }}
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{asset.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {asset.holdings.length} holdings
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
          </div>
        </CardHeader>

        <CardContent className="pl-5">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(asset.currentValue)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(asset.totalInvested)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Returns</p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {asset.returnsPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
