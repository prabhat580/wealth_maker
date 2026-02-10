import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine, CartesianGrid } from 'recharts';
import { TrendingUp, Calendar, Target, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CashFlowProjectionProps {
  goalName: string;
  targetAmount: number;
  timelineYears: number;
  monthlySIP: number;
  expectedReturn: number; // Annual return percentage
  initialInvestment?: number;
}

interface ProjectionDataPoint {
  year: number;
  month: number;
  label: string;
  invested: number;
  corpus: number;
  returns: number;
}

export function CashFlowProjection({
  goalName,
  targetAmount,
  timelineYears,
  monthlySIP,
  expectedReturn,
  initialInvestment = 0,
}: CashFlowProjectionProps) {
  // Generate projection data for each year
  const generateProjectionData = (): ProjectionDataPoint[] => {
    const data: ProjectionDataPoint[] = [];
    const monthlyReturn = expectedReturn / 100 / 12;
    
    let totalInvested = initialInvestment;
    let currentCorpus = initialInvestment;
    
    // Add starting point
    data.push({
      year: 0,
      month: 0,
      label: 'Start',
      invested: totalInvested,
      corpus: currentCorpus,
      returns: 0,
    });
    
    // Calculate for each year
    for (let year = 1; year <= timelineYears; year++) {
      // Compound monthly for the year
      for (let month = 1; month <= 12; month++) {
        currentCorpus = (currentCorpus + monthlySIP) * (1 + monthlyReturn);
        totalInvested += monthlySIP;
      }
      
      data.push({
        year,
        month: year * 12,
        label: `Year ${year}`,
        invested: Math.round(totalInvested),
        corpus: Math.round(currentCorpus),
        returns: Math.round(currentCorpus - totalInvested),
      });
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  const finalCorpus = projectionData[projectionData.length - 1]?.corpus || 0;
  const totalInvested = projectionData[projectionData.length - 1]?.invested || 0;
  const totalReturns = finalCorpus - totalInvested;
  const wealthMultiplier = totalInvested > 0 ? (finalCorpus / totalInvested).toFixed(1) : '0';

  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const chartConfig = {
    corpus: {
      label: "Total Corpus",
      color: "hsl(var(--primary))",
    },
    invested: {
      label: "Amount Invested",
      color: "hsl(var(--muted-foreground))",
    },
  };

  // Key milestones
  const milestones = [
    { year: Math.floor(timelineYears / 4), label: '25%' },
    { year: Math.floor(timelineYears / 2), label: '50%' },
    { year: Math.floor(timelineYears * 0.75), label: '75%' },
  ].filter(m => m.year > 0 && m.year < timelineYears);

  return (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg font-heading">
          <TrendingUp className="w-5 h-5 text-primary" />
          Cash Flow Projection
          <span className="text-sm font-normal text-muted-foreground ml-2">
            for {goalName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Coins className="w-3 h-3" />
              Monthly SIP
            </div>
            <p className="text-lg font-semibold text-primary">{formatAmount(monthlySIP)}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              Timeline
            </div>
            <p className="text-lg font-semibold text-foreground">{timelineYears} years</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              Total Investment
            </div>
            <p className="text-lg font-semibold text-foreground">{formatAmount(totalInvested)}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Target className="w-3 h-3" />
              Expected Corpus
            </div>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatAmount(finalCorpus)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              data={projectionData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <defs>
                <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(value) => formatAmount(value)}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={60}
                className="text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span className="font-medium">
                        {name === 'corpus' ? 'Total Corpus' : 'Invested'}: {formatAmount(Number(value))}
                      </span>
                    )}
                  />
                }
              />
              {/* Target line */}
              <ReferenceLine
                y={targetAmount}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Target: ${formatAmount(targetAmount)}`,
                  position: 'right',
                  fill: 'hsl(var(--destructive))',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                fill="url(#investedGradient)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="corpus"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#corpusGradient)"
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Legend & Insights */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Total Corpus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Amount Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-destructive" style={{ borderStyle: 'dashed' }} />
              <span className="text-muted-foreground">Target Goal</span>
            </div>
          </div>
          
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20"
          )}>
            {wealthMultiplier}x wealth multiplier • {formatAmount(totalReturns)} in returns
          </div>
        </div>

        {/* Year-by-Year Breakdown */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Year-by-Year Breakdown</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {projectionData.slice(1).map((point, index) => (
              <div
                key={point.year}
                className={cn(
                  "p-2 rounded-lg border text-center transition-colors",
                  point.corpus >= targetAmount 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-muted/30 border-border hover:bg-muted/50"
                )}
              >
                <p className="text-xs text-muted-foreground">Year {point.year}</p>
                <p className={cn(
                  "text-sm font-semibold",
                  point.corpus >= targetAmount ? "text-green-600 dark:text-green-400" : "text-foreground"
                )}>
                  {formatAmount(point.corpus)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  +{formatAmount(point.returns)} returns
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          *Projections are based on assumed {expectedReturn}% annual returns and are for illustration purposes only. 
          Actual returns may vary based on market conditions.
        </p>
      </CardContent>
    </Card>
  );
}
