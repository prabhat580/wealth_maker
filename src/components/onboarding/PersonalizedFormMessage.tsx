import { CustomerProfileType, customerProfiles } from '@/data/customerProfiles';
import { Sparkles, Target, Shield, TrendingUp, Wallet, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalizedFormMessageProps {
  profileType: CustomerProfileType;
  goalName?: string;
  monthlySIP?: number;
  className?: string;
}

const profileMessages: Record<CustomerProfileType, { icon: any; message: string; highlight: string }> = {
  'conservative-saver': {
    icon: Shield,
    message: "Your secure wealth journey awaits",
    highlight: "Low-risk, steady growth approach ready",
  },
  'balanced-investor': {
    icon: Target,
    message: "Your balanced portfolio is designed",
    highlight: "Optimized mix of growth & stability",
  },
  'growth-seeker': {
    icon: TrendingUp,
    message: "High-growth opportunities identified",
    highlight: "Equity-focused strategy configured",
  },
  'tax-optimizer': {
    icon: Wallet,
    message: "Tax-smart investments mapped out",
    highlight: "ELSS & tax-saving options selected",
  },
  'wealth-builder': {
    icon: PiggyBank,
    message: "Systematic wealth plan created",
    highlight: "Long-term SIP strategy designed",
  },
  'income-seeker': {
    icon: Sparkles,
    message: "Regular income portfolio ready",
    highlight: "Dividend & fixed-income focus",
  },
};

const formatCurrency = (amount: number) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${amount}`;
};

export function PersonalizedFormMessage({ 
  profileType, 
  goalName, 
  monthlySIP,
  className 
}: PersonalizedFormMessageProps) {
  const profile = customerProfiles[profileType];
  const message = profileMessages[profileType];
  const Icon = message.icon;

  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border border-primary/20 rounded-xl p-4 space-y-3",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{message.message}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{message.highlight}</p>
        </div>
      </div>
      
      {(goalName || monthlySIP) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {goalName && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 rounded-full text-xs text-secondary">
              <Target className="w-3 h-3" />
              {goalName}
            </span>
          )}
          {monthlySIP && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-zen/10 rounded-full text-xs text-zen">
              <PiggyBank className="w-3 h-3" />
              {formatCurrency(monthlySIP)}/month
            </span>
          )}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Complete your account to unlock your personalized {profile.name} portfolio
      </p>
    </div>
  );
}
