import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  pan: string | null;
}

export interface UserGoal {
  id: string;
  goal_name: string;
  goal_type: string;
  target_amount: number;
  timeline_years: number;
  monthly_sip: number | null;
  is_primary: boolean | null;
  status: string | null;
  recommended_portfolio: any;
  created_at: string;
}

export interface InvestorProfile {
  id: string;
  profile_type: string;
  japanese_name: string | null;
  tagline: string | null;
  confidence: number;
  scores: Record<string, number> | any;
}

export interface UserDashboardData {
  profile: UserProfile | null;
  goals: UserGoal[];
  investorProfile: InvestorProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserDashboard(): UserDashboardData {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all user data in parallel
        const [profileRes, goalsRes, investorProfileRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', user.id)
            .order('is_primary', { ascending: false }),
          supabase
            .from('investor_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (goalsRes.error) throw goalsRes.error;
        if (investorProfileRes.error) throw investorProfileRes.error;

        setProfile(profileRes.data);
        setGoals(goalsRes.data || []);
        setInvestorProfile(investorProfileRes.data);
      } catch (err) {
        console.error('Error fetching user dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  return {
    profile,
    goals,
    investorProfile,
    isLoading,
    error,
  };
}

// Helper function to format currency in Indian format
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Get goal icon based on goal type
export function getGoalIcon(goalType: string): string {
  const icons: Record<string, string> = {
    retirement: '🏖️',
    'child-education': '🎓',
    'home-purchase': '🏠',
    marriage: '💒',
    'wealth-creation': '💰',
    emergency: '🛡️',
    travel: '✈️',
    business: '💼',
    sabbatical: '🌴',
  };
  return icons[goalType] || '🎯';
}

// Get profile display info
export function getProfileInfo(profileType: string): { name: string; color: string } {
  const profiles: Record<string, { name: string; color: string }> = {
    'conservative-saver': { name: 'Conservative Saver', color: 'text-blue-600' },
    'balanced-investor': { name: 'Balanced Investor', color: 'text-green-600' },
    'growth-seeker': { name: 'Growth Seeker', color: 'text-orange-600' },
    'tax-optimizer': { name: 'Tax Optimizer', color: 'text-purple-600' },
    'wealth-builder': { name: 'Wealth Builder', color: 'text-amber-600' },
    'income-seeker': { name: 'Income Seeker', color: 'text-teal-600' },
  };
  return profiles[profileType] || { name: profileType, color: 'text-foreground' };
}
