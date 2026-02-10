import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface FunnelEvent {
  id: string;
  session_id: string;
  event_type: string;
  step_number: number | null;
  step_name: string | null;
  metadata: any;
  device_type: string | null;
  referrer: string | null;
  created_at: string;
}

interface DropOffChartProps {
  events: FunnelEvent[];
  isLoading: boolean;
}

export function DropOffChart({ events, isLoading }: DropOffChartProps) {
  const dropOffData = useMemo(() => {
    if (!events.length) return { chartData: [], insights: [] };

    // Count unique sessions per step
    const stepSessions: Record<number, Set<string>> = {};
    events
      .filter(e => e.event_type === 'step_view' && e.step_number)
      .forEach(e => {
        const step = e.step_number!;
        if (!stepSessions[step]) stepSessions[step] = new Set();
        stepSessions[step].add(e.session_id);
      });

    const steps = Object.keys(stepSessions).map(Number).sort((a, b) => a - b);
    if (steps.length === 0) return { chartData: [], insights: [] };

    const baseCount = stepSessions[steps[0]]?.size || 0;

    const chartData = steps.map(step => {
      const count = stepSessions[step]?.size || 0;
      const retention = baseCount > 0 ? (count / baseCount) * 100 : 0;
      return {
        step: `Q${step}`,
        stepNumber: step,
        users: count,
        retention: Math.round(retention),
      };
    });

    // Find drop-off insights
    const insights: { step: number; dropRate: number; severity: 'high' | 'medium' | 'low' }[] = [];
    for (let i = 1; i < chartData.length; i++) {
      const prev = chartData[i - 1].users;
      const curr = chartData[i].users;
      const dropRate = prev > 0 ? ((prev - curr) / prev) * 100 : 0;
      
      if (dropRate > 30) {
        insights.push({ step: chartData[i].stepNumber, dropRate, severity: 'high' });
      } else if (dropRate > 20) {
        insights.push({ step: chartData[i].stepNumber, dropRate, severity: 'medium' });
      } else if (dropRate > 15) {
        insights.push({ step: chartData[i].stepNumber, dropRate, severity: 'low' });
      }
    }

    return { chartData, insights: insights.sort((a, b) => b.dropRate - a.dropRate).slice(0, 3) };
  }, [events]);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { chartData, insights } = dropOffData;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main chart */}
      <Card className="border-0 shadow-lg bg-card/80 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            Drop-off by Question
          </CardTitle>
          <CardDescription>
            User retention rate through each onboarding question
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No step data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="step" tick={{ fontSize: 12 }} />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-foreground">Question {data.stepNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Users: <span className="font-medium text-foreground">{data.users}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Retention: <span className="font-medium text-primary">{data.retention}%</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRetention)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Insights panel */}
      <Card className="border-0 shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Drop-off Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No significant drop-offs detected. Great job! 🎉
            </p>
          ) : (
            insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  insight.severity === 'high' 
                    ? 'border-destructive/30 bg-destructive/5' 
                    : insight.severity === 'medium'
                    ? 'border-warning/30 bg-warning/5'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">Question {insight.step}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      insight.severity === 'high' 
                        ? 'border-destructive text-destructive' 
                        : insight.severity === 'medium'
                        ? 'border-warning text-warning'
                        : 'border-muted-foreground'
                    }
                  >
                    {insight.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-destructive">{insight.dropRate.toFixed(1)}%</span> of users drop off here
                </p>
              </div>
            ))
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Questions with &gt;20% drop-off may need simplification or better context.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
