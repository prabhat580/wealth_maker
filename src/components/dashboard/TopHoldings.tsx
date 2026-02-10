import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioData } from "@/data/portfolioData";
import { cn } from "@/lib/utils";

interface TopHolding {
  name: string;
  assetClass: string;
  currentValue: number;
  returnsPercentage: number;
  color: string;
}

const formatCurrency = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function TopHoldings() {
  // Get all holdings with their asset class info
  const allHoldings: TopHolding[] = portfolioData.flatMap((asset) =>
    asset.holdings.map((holding) => ({
      name: holding.name,
      assetClass: asset.name,
      currentValue: holding.currentValue,
      returnsPercentage: holding.returnsPercentage,
      color: asset.color,
    }))
  );

  // Sort by current value and take top 5
  const topHoldings = allHoldings
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-card animate-slide-up opacity-0 stagger-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topHoldings.map((holding, index) => {
            const isPositive = holding.returnsPercentage >= 0;
            return (
              <div
                key={index}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                    style={{ backgroundColor: holding.color }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">
                      {holding.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {holding.assetClass}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {formatCurrency(holding.currentValue)}
                  </p>
                  <p
                    className={cn(
                      "flex items-center justify-end gap-1 text-xs font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {isPositive ? "+" : ""}
                    {holding.returnsPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
