import { TrendingUp, TrendingDown, IndianRupee, Percent, ArrowUpRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getTotalPortfolioValue,
  getTotalInvested,
  getTotalReturns,
  getOverallReturnsPercentage,
} from "@/data/portfolioData";
import { sampleGoalProgress, financialGoals } from "@/data/goalsAndModels";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function PortfolioSummary() {
  const totalValue = getTotalPortfolioValue();
  const totalInvested = getTotalInvested();
  const totalReturns = getTotalReturns();
  const returnsPercentage = parseFloat(getOverallReturnsPercentage());
  const isPositive = totalReturns >= 0;

  // Get primary goal (first goal as the main one)
  const primaryGoal = sampleGoalProgress[0];
  const primaryGoalInfo = primaryGoal ? financialGoals[primaryGoal.goalType] : null;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const summaryCards = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(totalValue),
      icon: IndianRupee,
      highlight: true,
      scrollTo: "asset-classes",
    },
    {
      title: "Total Invested",
      value: formatCurrency(totalInvested),
      icon: ArrowUpRight,
      scrollTo: "asset-classes",
    },
    {
      title: "Total Returns",
      value: formatCurrency(Math.abs(totalReturns)),
      subtitle: `${isPositive ? "+" : "-"}${returnsPercentage}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      isPositive,
      scrollTo: "holdings-activity",
    },
    {
      title: "XIRR",
      value: "22.4%",
      subtitle: "Annual Return",
      icon: Percent,
      isPositive: true,
      scrollTo: "holdings-activity",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {summaryCards.map((card, index) => (
        <Card
          key={card.title}
          onClick={() => scrollToSection(card.scrollTo)}
          className={cn(
            "relative overflow-hidden border-0 shadow-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-up opacity-0 cursor-pointer",
            card.highlight && "bg-gradient-to-br from-primary to-accent text-primary-foreground",
            `stagger-${index + 1}`
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    card.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {card.title}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    card.highlight ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {card.value}
                </p>
                {card.subtitle && (
                  <p
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      card.isPositive !== undefined
                        ? card.isPositive
                          ? "text-success"
                          : "text-destructive"
                        : card.highlight
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {card.isPositive !== undefined && (
                      card.isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )
                    )}
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  card.highlight
                    ? "bg-primary-foreground/10"
                    : card.isPositive !== undefined
                    ? card.isPositive
                      ? "bg-success/10"
                      : "bg-destructive/10"
                    : "bg-muted"
                )}
              >
                <card.icon
                  className={cn(
                    "h-6 w-6",
                    card.highlight
                      ? "text-primary-foreground"
                      : card.isPositive !== undefined
                      ? card.isPositive
                        ? "text-success"
                        : "text-destructive"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Primary Goal Summary Card */}
      {primaryGoal && primaryGoalInfo && (
        <Card
          onClick={() => scrollToSection("goals-allocation")}
          className={cn(
            "relative overflow-hidden border-0 shadow-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-up opacity-0 cursor-pointer",
            "bg-gradient-to-br from-secondary/80 to-secondary",
            "stagger-5"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  Primary Goal
                </p>
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="text-xl">{primaryGoalInfo.icon}</span>
                  {primaryGoal.name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatCurrency(primaryGoal.currentAmount)} saved
                </span>
                <span className="font-medium text-foreground">
                  {primaryGoal.progressPercentage}%
                </span>
              </div>
              <Progress value={primaryGoal.progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Target: {formatCurrency(primaryGoal.targetAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
