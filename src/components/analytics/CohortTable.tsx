import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfDay, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface CohortTableProps {
  events: FunnelEvent[];
  isLoading: boolean;
}

interface CohortData {
  date: string;
  sessions: number;
  profileViews: number;
  formStarts: number;
  signups: number;
  conversionRate: number;
}

export function CohortTable({ events, isLoading }: CohortTableProps) {
  const cohortData = useMemo(() => {
    if (!events.length) return [];

    // Group events by date
    const eventsByDate: Record<string, FunnelEvent[]> = {};
    
    events.forEach(e => {
      const date = format(new Date(e.created_at), 'yyyy-MM-dd');
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date].push(e);
    });

    // Calculate metrics per cohort (day)
    const cohorts: CohortData[] = Object.entries(eventsByDate)
      .map(([date, dayEvents]) => {
        const sessions = new Set(dayEvents.map(e => e.session_id)).size;
        const profileViews = dayEvents.filter(e => e.event_type === 'profile_view').length;
        const formStarts = dayEvents.filter(e => e.event_type === 'form_start').length;
        const signups = dayEvents.filter(e => e.event_type === 'form_complete').length;
        
        return {
          date,
          sessions,
          profileViews,
          formStarts,
          signups,
          conversionRate: sessions > 0 ? (signups / sessions) * 100 : 0,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14); // Last 14 days

    return cohorts;
  }, [events]);

  const getConversionColor = (rate: number) => {
    if (rate >= 10) return 'bg-success/20 text-success';
    if (rate >= 5) return 'bg-zen/20 text-zen';
    if (rate >= 2) return 'bg-secondary/20 text-secondary';
    return 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-card/80">
      <CardHeader>
        <CardTitle>Daily Cohort Analysis</CardTitle>
        <CardDescription>
          Track conversion performance by acquisition date
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cohortData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No cohort data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="text-center">Sessions</TableHead>
                  <TableHead className="text-center">Profile Views</TableHead>
                  <TableHead className="text-center">Form Starts</TableHead>
                  <TableHead className="text-center">Signups</TableHead>
                  <TableHead className="text-center">Conv. Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortData.map((cohort, index) => (
                  <TableRow key={cohort.date}>
                    <TableCell className="font-medium">
                      {format(new Date(cohort.date), 'MMM d, yyyy')}
                      {index === 0 && (
                        <Badge variant="outline" className="ml-2 text-xs">Today</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{cohort.sessions}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-foreground">{cohort.profileViews}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({cohort.sessions > 0 ? ((cohort.profileViews / cohort.sessions) * 100).toFixed(0) : 0}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-foreground">{cohort.formStarts}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({cohort.profileViews > 0 ? ((cohort.formStarts / cohort.profileViews) * 100).toFixed(0) : 0}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium text-success">
                      {cohort.signups}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("font-medium", getConversionColor(cohort.conversionRate))}>
                        {cohort.conversionRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary stats */}
        {cohortData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {cohortData.reduce((sum, c) => sum + c.sessions, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {cohortData.reduce((sum, c) => sum + c.signups, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Signups</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {(() => {
                  const totalSessions = cohortData.reduce((sum, c) => sum + c.sessions, 0);
                  const totalSignups = cohortData.reduce((sum, c) => sum + c.signups, 0);
                  return totalSessions > 0 ? ((totalSignups / totalSessions) * 100).toFixed(1) : '0';
                })()}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Conversion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {Math.max(...cohortData.map(c => c.conversionRate)).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Best Day</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
