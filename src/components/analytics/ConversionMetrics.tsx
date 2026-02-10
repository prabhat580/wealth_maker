import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users, Target, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunnelStats {
  totalSessions: number;
  completedOnboarding: number;
  startedForm: number;
  completedForm: number;
  conversionRate: number;
  avgTimeToComplete: number;
  dropOffStep: string;
  topDevice: string;
}

interface ConversionMetricsProps {
  stats: FunnelStats | null;
  isLoading: boolean;
}

export function ConversionMetrics({ stats, isLoading }: ConversionMetricsProps) {
  const metrics = [
    {
      label: 'Total Sessions',
      value: stats?.totalSessions || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Viewed Profile',
      value: stats?.completedOnboarding || 0,
      icon: Target,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      subtext: stats ? `${((stats.completedOnboarding / stats.totalSessions) * 100 || 0).toFixed(1)}% of sessions` : '',
    },
    {
      label: 'Started Signup',
      value: stats?.startedForm || 0,
      icon: TrendingUp,
      color: 'text-zen',
      bgColor: 'bg-zen/10',
      subtext: stats ? `${((stats.startedForm / stats.completedOnboarding) * 100 || 0).toFixed(1)}% of profile views` : '',
    },
    {
      label: 'Completed Signup',
      value: stats?.completedForm || 0,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      subtext: stats ? `${stats.conversionRate.toFixed(1)}% overall conversion` : '',
    },
    {
      label: 'Biggest Drop-off',
      value: stats?.dropOffStep || '-',
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      isText: true,
    },
    {
      label: 'Top Device',
      value: stats?.topDevice || '-',
      icon: Smartphone,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-sm bg-card/80">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", metric.bgColor)}>
                    <metric.icon className={cn("w-4 h-4", metric.color)} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className={cn(
                  "font-bold",
                  metric.isText ? "text-lg capitalize" : "text-2xl"
                )}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
                {metric.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
