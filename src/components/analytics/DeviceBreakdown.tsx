import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
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

interface DeviceBreakdownProps {
  events: FunnelEvent[];
  isLoading: boolean;
}

const DEVICE_COLORS = {
  mobile: 'hsl(var(--primary))',
  desktop: 'hsl(var(--secondary))',
  tablet: 'hsl(var(--zen))',
  unknown: 'hsl(var(--muted-foreground))',
};

const DEVICE_ICONS = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
  unknown: Monitor,
};

export function DeviceBreakdown({ events, isLoading }: DeviceBreakdownProps) {
  const deviceData = useMemo(() => {
    if (!events.length) return { pieData: [], conversionByDevice: [] };

    // Count sessions by device
    const sessionsByDevice: Record<string, Set<string>> = {};
    const conversionsByDevice: Record<string, { sessions: number; conversions: number }> = {};

    events.forEach(e => {
      const device = e.device_type || 'unknown';
      
      if (!sessionsByDevice[device]) sessionsByDevice[device] = new Set();
      sessionsByDevice[device].add(e.session_id);

      if (!conversionsByDevice[device]) {
        conversionsByDevice[device] = { sessions: 0, conversions: 0 };
      }
    });

    // Count unique sessions and conversions per device
    Object.keys(sessionsByDevice).forEach(device => {
      conversionsByDevice[device].sessions = sessionsByDevice[device].size;
    });

    events
      .filter(e => e.event_type === 'form_complete')
      .forEach(e => {
        const device = e.device_type || 'unknown';
        if (conversionsByDevice[device]) {
          conversionsByDevice[device].conversions++;
        }
      });

    const totalSessions = Object.values(sessionsByDevice).reduce((sum, set) => sum + set.size, 0);

    const pieData = Object.entries(sessionsByDevice).map(([device, sessions]) => ({
      name: device.charAt(0).toUpperCase() + device.slice(1),
      value: sessions.size,
      percentage: totalSessions > 0 ? ((sessions.size / totalSessions) * 100).toFixed(1) : '0',
      color: DEVICE_COLORS[device as keyof typeof DEVICE_COLORS] || DEVICE_COLORS.unknown,
    }));

    const conversionByDevice = Object.entries(conversionsByDevice).map(([device, data]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      deviceKey: device,
      sessions: data.sessions,
      conversions: data.conversions,
      rate: data.sessions > 0 ? ((data.conversions / data.sessions) * 100).toFixed(1) : '0',
    }));

    return { pieData, conversionByDevice };
  }, [events]);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { pieData, conversionByDevice } = deviceData;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Device Distribution */}
      <Card className="border-0 shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>Sessions by device type</CardDescription>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No device data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Sessions: <span className="font-medium text-foreground">{data.value}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Share: <span className="font-medium text-primary">{data.percentage}%</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Conversion by Device */}
      <Card className="border-0 shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle>Conversion by Device</CardTitle>
          <CardDescription>Signup completion rate per device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversionByDevice.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No conversion data available
            </div>
          ) : (
            conversionByDevice.map((device, index) => {
              const Icon = DEVICE_ICONS[device.deviceKey as keyof typeof DEVICE_ICONS] || Monitor;
              const color = DEVICE_COLORS[device.deviceKey as keyof typeof DEVICE_COLORS] || DEVICE_COLORS.unknown;
              
              return (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{device.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.sessions} sessions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{device.rate}%</p>
                      <p className="text-xs text-muted-foreground">{device.conversions} signups</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${device.rate}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
