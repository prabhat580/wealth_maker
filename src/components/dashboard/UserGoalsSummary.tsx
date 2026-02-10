import { Target, TrendingUp, Calendar, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDashboard, formatCurrency, getGoalIcon } from "@/hooks/useUserDashboard";
import { cn } from "@/lib/utils";

export function UserGoalsSummary() {
  const { goals, isLoading } = useUserDashboard();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-card lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="border-0 shadow-card lg:col-span-2">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
          <p className="text-muted-foreground">
            Complete your onboarding to set up your financial goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your Financial Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          // Calculate progress (for now, showing 0% as no current amount tracked)
          // This would be calculated from actual holdings when integrated
          const progressPercent = 0;
          
          return (
            <div
              key={goal.id}
              className={cn(
                "p-4 rounded-xl border bg-card transition-all hover:shadow-md",
                goal.is_primary && "ring-2 ring-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getGoalIcon(goal.goal_type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{goal.goal_name}</h4>
                      {goal.is_primary && (
                        <Badge variant="default" className="text-xs">Primary</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {goal.timeline_years} years
                      </span>
                      {goal.monthly_sip && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {formatCurrency(goal.monthly_sip)}/mo SIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(goal.target_amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">Target</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Start investing to track your progress toward this goal
                </p>
              </div>

              {/* Recommended Portfolio Preview */}
              {goal.recommended_portfolio && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Recommended: {goal.recommended_portfolio.name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {goal.recommended_portfolio.allocation?.slice(0, 4).map((item: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item.asset}: {item.percentage}%
                      </Badge>
                    ))}
                    {goal.recommended_portfolio.allocation?.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{goal.recommended_portfolio.allocation.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
