import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerProfileType, customerProfiles } from '@/data/customerProfiles';
import { OnboardingAnswer } from '@/data/customerProfiles';
import { 
  TrendingUp, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileInsightsProps {
  profileType: CustomerProfileType;
  answers: OnboardingAnswer[];
  targetAmount: number;
  timelineYears: number;
  monthlySIP: number;
}

// Profile-specific actionable tips
const profileActionableTips: Record<CustomerProfileType, string[]> = {
  'conservative-saver': [
    "Consider allocating a small portion (10-15%) to equity for long-term goals to beat inflation",
    "Ladder your FDs across different maturities to capture rate changes",
    "Review inflation-adjusted returns annually to ensure your wealth is growing in real terms"
  ],
  'balanced-investor': [
    "Set calendar reminders for semi-annual portfolio rebalancing",
    "Use Systematic Transfer Plans (STP) for lump sum investments to average out risk",
    "Keep 6 months of expenses in liquid funds separately from your investments"
  ],
  'growth-seeker': [
    "Maintain at least 10-15% in debt instruments for rebalancing during market dips",
    "Avoid timing the market – stay invested via SIPs for rupee cost averaging",
    "Have a separate conservative bucket for any short-term needs (2-3 years)"
  ],
  'tax-optimizer': [
    "Complete tax-saving investments early in the financial year for maximum compounding",
    "Diversify ELSS investments across 2-3 fund houses to reduce concentration risk",
    "Consider NPS for additional ₹50,000 deduction under Section 80CCD(1B)"
  ],
  'wealth-builder': [
    "Increase your SIP amount by 10% annually as your income grows",
    "Set up goal-specific folios for better tracking and accountability",
    "Review asset allocation annually, not daily NAVs – focus on long-term trajectory"
  ],
  'income-seeker': [
    "Create a dividend calendar to track and plan for predictable income flows",
    "Consider SWP from balanced funds for tax-efficient regular income",
    "Maintain 2 years' expenses in liquid instruments as a safety buffer"
  ]
};

// Format currency in Indian format
const formatIndianCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount}`;
};

// Profile return expectations
const profileReturns: Record<CustomerProfileType, { min: number; max: number }> = {
  'conservative-saver': { min: 6, max: 8 },
  'balanced-investor': { min: 9, max: 12 },
  'growth-seeker': { min: 12, max: 16 },
  'tax-optimizer': { min: 10, max: 13 },
  'wealth-builder': { min: 11, max: 14 },
  'income-seeker': { min: 7, max: 10 }
};

export function ProfileInsights({ 
  profileType, 
  answers, 
  targetAmount, 
  timelineYears, 
  monthlySIP 
}: ProfileInsightsProps) {
  const profile = customerProfiles[profileType];
  const tips = profileActionableTips[profileType];
  const returnExpectation = profileReturns[profileType];
  
  // Calculate projected values
  const avgReturn = (returnExpectation.min + returnExpectation.max) / 2;
  const totalInvestment = monthlySIP * 12 * timelineYears;
  const estimatedCorpus = monthlySIP * (
    (Math.pow(1 + avgReturn / 100 / 12, timelineYears * 12) - 1) / 
    (avgReturn / 100 / 12)
  ) * (1 + avgReturn / 100 / 12);
  const wealthGain = estimatedCorpus - totalInvestment;
  const wealthMultiplier = estimatedCorpus / totalInvestment;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Goal Projection - Optimized for Conversion with Compliance */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 via-card to-secondary/5 shadow-xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Illustrative Wealth Projection
            </CardTitle>
            {/* Wealth Multiplier Badge - Anchoring */}
            <Badge className="bg-success/10 text-success border-success/20 text-sm font-bold gap-1">
              <ArrowUpRight className="w-3 h-3" />
              ~{wealthMultiplier.toFixed(1)}x potential
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *For illustration purposes only. Actual returns may vary.
          </p>
        </CardHeader>
        <CardContent>
          {/* Hero Number - Estimated Corpus (Anchoring) */}
          <div className="text-center py-4 mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Illustrative Potential Corpus*</p>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {formatIndianCurrency(estimatedCorpus)}
            </p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              in {timelineYears} years assuming {avgReturn}% p.a. returns
            </p>
          </div>

          {/* Key Metrics - Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Monthly SIP - Highlighted as Action Item */}
            <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20 col-span-2 sm:col-span-1">
              <p className="text-xs text-primary uppercase tracking-wider font-medium">Suggested Monthly Investment</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatIndianCurrency(monthlySIP)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                per month (indicative)
              </p>
            </div>

            {/* Potential Gain */}
            <div className="bg-success/5 rounded-xl p-4 border border-success/20 col-span-2 sm:col-span-1">
              <p className="text-xs text-success uppercase tracking-wider font-medium">Potential Returns*</p>
              <p className="text-3xl font-bold text-success mt-1">
                +{formatIndianCurrency(wealthGain)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                illustrative gains
              </p>
            </div>

            {/* Total Investment */}
            <div className="bg-background/80 rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Investment</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatIndianCurrency(totalInvestment)}
              </p>
            </div>

            {/* Target */}
            <div className="bg-background/80 rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Target Goal</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatIndianCurrency(targetAmount)}
              </p>
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <p className="text-[10px] text-muted-foreground mt-4 text-center">
            *Projections are illustrative and based on assumed returns. Past performance does not guarantee future results. 
            Mutual fund investments are subject to market risks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Export actionable tips for use in ProfileResult
export { profileActionableTips };
