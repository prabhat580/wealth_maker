import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw
} from 'lucide-react';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { DropOffChart } from '@/components/analytics/DropOffChart';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { ConversionMetrics } from '@/components/analytics/ConversionMetrics';
import { CohortTable } from '@/components/analytics/CohortTable';

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

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch analytics data
  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user, dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      switch (dateRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      const { data, error } = await supabase
        .from('funnel_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEvents(data || []);
      calculateStats(data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: FunnelEvent[]) => {
    const sessions = new Set(data.map(e => e.session_id));
    const totalSessions = sessions.size;

    // Count events by type
    const profileViews = data.filter(e => e.event_type === 'profile_view').length;
    const formStarts = data.filter(e => e.event_type === 'form_start').length;
    const formCompletes = data.filter(e => e.event_type === 'form_complete').length;

    // Device breakdown
    const devices = data.reduce((acc, e) => {
      const device = e.device_type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topDevice = Object.entries(devices).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    // Find biggest drop-off
    const stepCounts = data
      .filter(e => e.event_type === 'step_view')
      .reduce((acc, e) => {
        const step = e.step_number || 0;
        acc[step] = (acc[step] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
    
    let maxDrop = 0;
    let dropOffStep = 'Step 1';
    const sortedSteps = Object.keys(stepCounts).map(Number).sort((a, b) => a - b);
    for (let i = 1; i < sortedSteps.length; i++) {
      const prev = stepCounts[sortedSteps[i - 1]];
      const curr = stepCounts[sortedSteps[i]];
      const drop = prev - curr;
      if (drop > maxDrop) {
        maxDrop = drop;
        dropOffStep = `Step ${sortedSteps[i]}`;
      }
    }

    setStats({
      totalSessions,
      completedOnboarding: profileViews,
      startedForm: formStarts,
      completedForm: formCompletes,
      conversionRate: totalSessions > 0 ? (formCompletes / totalSessions) * 100 : 0,
      avgTimeToComplete: 0, // Would need timestamps comparison
      dropOffStep,
      topDevice,
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl text-foreground">Funnel Analytics</h1>
                <p className="text-sm text-muted-foreground">Conversion insights & drop-off analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={fetchAnalytics} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <ConversionMetrics stats={stats} isLoading={isLoading} />

        {/* Tabs for different views */}
        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="funnel" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Funnel
            </TabsTrigger>
            <TabsTrigger value="dropoff" className="gap-2">
              <TrendingDown className="w-4 h-4" />
              Drop-off
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2">
              <Smartphone className="w-4 h-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="gap-2">
              <Users className="w-4 h-4" />
              Cohorts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            <FunnelChart events={events} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="dropoff" className="space-y-6">
            <DropOffChart events={events} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <DeviceBreakdown events={events} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="cohorts" className="space-y-6">
            <CohortTable events={events} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {/* Last refresh indicator */}
        <div className="text-center text-xs text-muted-foreground">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </main>
    </div>
  );
}
