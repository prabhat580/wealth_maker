import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

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

interface FunnelChartProps {
  events: FunnelEvent[];
  isLoading: boolean;
}

const FUNNEL_STAGES = [
  { key: 'sessions', label: 'Started Onboarding', color: 'hsl(var(--primary))' },
  { key: 'step_5', label: 'Reached Step 5', color: 'hsl(var(--secondary))' },
  { key: 'profile_view', label: 'Viewed Profile', color: 'hsl(var(--zen))' },
  { key: 'form_start', label: 'Started Signup', color: 'hsl(var(--purpose))' },
  { key: 'form_complete', label: 'Completed Signup', color: 'hsl(var(--success))' },
];

export function FunnelChart({ events, isLoading }: FunnelChartProps) {
  const funnelData = useMemo(() => {
    if (!events.length) return [];

    const sessions = new Set(events.map(e => e.session_id)).size;
    const step5Views = new Set(
      events.filter(e => e.event_type === 'step_view' && (e.step_number || 0) >= 5).map(e => e.session_id)
    ).size;
    const profileViews = events.filter(e => e.event_type === 'profile_view').length;
    const formStarts = events.filter(e => e.event_type === 'form_start').length;
    const formCompletes = events.filter(e => e.event_type === 'form_complete').length;

    return FUNNEL_STAGES.map((stage, index) => {
      let count = 0;
      switch (stage.key) {
        case 'sessions': count = sessions; break;
        case 'step_5': count = step5Views; break;
        case 'profile_view': count = profileViews; break;
        case 'form_start': count = formStarts; break;
        case 'form_complete': count = formCompletes; break;
      }
      
      const prevCount = index === 0 ? sessions : (() => {
        switch (FUNNEL_STAGES[index - 1].key) {
          case 'sessions': return sessions;
          case 'step_5': return step5Views;
          case 'profile_view': return profileViews;
          case 'form_start': return formStarts;
          default: return count;
        }
      })();

      const dropRate = prevCount > 0 ? ((prevCount - count) / prevCount * 100) : 0;

      return {
        name: stage.label,
        count,
        color: stage.color,
        dropRate: dropRate.toFixed(1),
        conversionFromStart: sessions > 0 ? ((count / sessions) * 100).toFixed(1) : '0',
      };
    });
  }, [events]);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Conversion Funnel
        </CardTitle>
        <CardDescription>
          Track user progression through the onboarding journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {funnelData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-foreground">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Count: <span className="font-medium text-foreground">{data.count}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Drop-off: <span className="font-medium text-destructive">{data.dropRate}%</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        From start: <span className="font-medium text-success">{data.conversionFromStart}%</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="count" 
                  position="right" 
                  fill="hsl(var(--foreground))"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Funnel summary */}
        {funnelData.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {funnelData.slice(1).map((stage, index) => (
              <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">{stage.name}</p>
                <p className="text-lg font-bold text-foreground">{stage.conversionFromStart}%</p>
                <p className="text-xs text-destructive">-{stage.dropRate}% drop</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
