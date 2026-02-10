import { MainLayout } from "@/components/layout/MainLayout";
import { UserWelcome } from "@/components/dashboard/UserWelcome";
import { UserGoalsSummary } from "@/components/dashboard/UserGoalsSummary";
import { EmptyPortfolioState } from "@/components/dashboard/EmptyPortfolioState";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: dashboardLoading } = useUserDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dashboardLoading) {
    return (
      <MainLayout
        title="Portfolio Dashboard"
        subtitle="Loading your wealth overview..."
      >
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const userName = profile?.full_name || 'Investor';

  return (
    <MainLayout
      title="Portfolio Dashboard"
      subtitle={`Welcome, ${userName}`}
    >
      <div className="space-y-6">
        {/* User Welcome Card */}
        <UserWelcome />

        {/* Goals and Allocation Grid */}
        <div id="goals-allocation" className="grid gap-6 lg:grid-cols-3">
          {/* User Goals Summary - Spans 2 columns */}
          <UserGoalsSummary />

          {/* Recommended Asset Allocation */}
          <AssetAllocationChart />
        </div>

        {/* Empty Portfolio State - CTA to start investing */}
        <EmptyPortfolioState />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
