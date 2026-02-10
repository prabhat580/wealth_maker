import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { sampleGoalProgress, financialGoals } from '@/data/goalsAndModels';
import { Target, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoalTracker() {
  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const years = Math.floor((target.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((target.getTime() - now.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    
    if (years > 0) {
      return `${years}y ${months}m left`;
    }
    return `${months} months left`;
  };

  return (
    <Card className="border-border col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-heading">
          <Target className="w-5 h-5 text-primary" />
          Goal Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleGoalProgress.map((goal, index) => {
            const goalInfo = financialGoals[goal.goalType];
            
            return (
              <div 
                key={goal.goalId}
                className={cn(
                  "p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goalInfo.icon}</span>
                    <div>
                      <h4 className="font-medium text-foreground">{goal.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {getTimeRemaining(goal.targetDate)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      goal.onTrack 
                        ? "border-green-500 text-green-600 dark:text-green-400" 
                        : "border-destructive text-destructive"
                    )}
                  >
                    {goal.onTrack ? (
                      <><TrendingUp className="w-3 h-3 mr-1" /> On Track</>
                    ) : (
                      <><TrendingDown className="w-3 h-3 mr-1" /> Behind</>
                    )}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{goal.progressPercentage}%</span>
                  </div>
                  <Progress 
                    value={goal.progressPercentage} 
                    className="h-2"
                  />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="text-sm font-medium text-foreground">{formatAmount(goal.currentAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-sm font-medium text-foreground">{formatAmount(goal.targetAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Monthly SIP</p>
                    <p className="text-sm font-medium text-primary">{formatAmount(goal.monthlyContribution)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Goals Value</span>
            <span className="font-semibold text-foreground">
              {formatAmount(sampleGoalProgress.reduce((acc, g) => acc + g.currentAmount, 0))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Monthly Contributions</span>
            <span className="font-semibold text-primary">
              {formatAmount(sampleGoalProgress.reduce((acc, g) => acc + g.monthlyContribution, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
