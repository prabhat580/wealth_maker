import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Holding } from "@/data/portfolioData";

interface HoldingsTableProps {
  holdings: Holding[];
  showCategory?: boolean;
  showUnits?: boolean;
  showMaturity?: boolean;
  showInterestRate?: boolean;
  showPremium?: boolean;
}

const formatCurrency = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function HoldingsTable({
  holdings,
  showCategory = false,
  showUnits = false,
  showMaturity = false,
  showInterestRate = false,
  showPremium = false,
}: HoldingsTableProps) {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Holdings Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">
                  Name
                </TableHead>
                {showCategory && (
                  <TableHead className="text-muted-foreground font-medium">
                    Category
                  </TableHead>
                )}
                {showUnits && (
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Units
                  </TableHead>
                )}
                {showMaturity && (
                  <TableHead className="text-muted-foreground font-medium">
                    Maturity
                  </TableHead>
                )}
                {showInterestRate && (
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Interest
                  </TableHead>
                )}
                {showPremium && (
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Premium
                  </TableHead>
                )}
                <TableHead className="text-muted-foreground font-medium text-right">
                  Invested
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Current
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Returns
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const isPositive = holding.returns >= 0;
                return (
                  <TableRow
                    key={holding.id}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      {holding.name}
                    </TableCell>
                    {showCategory && (
                      <TableCell className="text-muted-foreground">
                        {holding.category || "-"}
                      </TableCell>
                    )}
                    {showUnits && (
                      <TableCell className="text-right text-muted-foreground">
                        {holding.units?.toLocaleString("en-IN") || "-"}
                      </TableCell>
                    )}
                    {showMaturity && (
                      <TableCell className="text-muted-foreground">
                        {holding.maturityDate
                          ? new Date(holding.maturityDate).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : "-"}
                      </TableCell>
                    )}
                    {showInterestRate && (
                      <TableCell className="text-right text-muted-foreground">
                        {holding.interestRate
                          ? `${holding.interestRate}%`
                          : "-"}
                      </TableCell>
                    )}
                    {showPremium && (
                      <TableCell className="text-right text-muted-foreground">
                        {holding.premium
                          ? formatCurrency(holding.premium)
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(holding.investedAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(holding.currentValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={cn(
                          "flex items-center justify-end gap-1 font-semibold",
                          isPositive ? "text-success" : "text-destructive"
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {formatCurrency(Math.abs(holding.returns))} (
                          {isPositive ? "+" : ""}
                          {holding.returnsPercentage.toFixed(1)}%)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
