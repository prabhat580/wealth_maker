import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelPortfolio } from '@/data/goalsAndModels';
import { 
  TrendingUp, 
  RefreshCw, 
  ChevronDown, 
  PieChart, 
  Shield, 
  Clock, 
  Target,
  AlertTriangle,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelPortfolioCardProps {
  portfolio: ModelPortfolio;
  goalName: string;
  targetAmount: number;
  timelineYears: number;
  monthlySIP: number;
}

const allocationColors = [
  'bg-primary',
  'bg-accent',
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4'
];

export function ModelPortfolioCard({ 
  portfolio, 
  goalName, 
  targetAmount, 
  timelineYears,
  monthlySIP 
}: ModelPortfolioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const riskInfo = {
    aggressive: {
      color: 'text-destructive border-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Higher volatility with potential for greater long-term returns',
      suitableFor: 'Investors with 10+ years horizon who can handle market fluctuations'
    },
    moderate: {
      color: 'text-accent border-accent',
      bgColor: 'bg-accent/10',
      description: 'Balanced approach with controlled volatility',
      suitableFor: 'Investors seeking growth with some stability, 5-10 year horizon'
    },
    conservative: {
      color: 'text-primary border-primary',
      bgColor: 'bg-primary/10',
      description: 'Focus on capital preservation with steady returns',
      suitableFor: 'Risk-averse investors or those with shorter investment horizons'
    }
  };

  const currentRiskInfo = riskInfo[portfolio.riskLevel];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden">
      {/* Clickable Header */}
      <div 
        className="cursor-pointer hover:bg-muted/30 transition-colors p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Sample Investment Approach
              </p>
            </div>
            <h3 className="text-xl font-heading text-primary flex items-center gap-2">
              {portfolio.name}
              <ChevronDown className={cn(
                "w-5 h-5 transition-transform duration-300",
                isExpanded && "rotate-180"
              )} />
            </h3>
          </div>
          <Badge 
            variant="outline" 
            className={cn("capitalize", currentRiskInfo.color)}
          >
            {portfolio.riskLevel} Risk
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {portfolio.description}
        </p>
        
        {/* Quick Summary - Always Visible */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
            <p className="text-lg font-semibold text-foreground">{formatAmount(targetAmount)}</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-xs text-muted-foreground mb-1">Timeline</p>
            <p className="text-lg font-semibold text-foreground">{timelineYears} Years</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Monthly SIP</p>
            <p className="text-lg font-semibold text-primary">{formatAmount(monthlySIP)}</p>
          </div>
        </div>

        {!isExpanded && (
          <p className="text-xs text-primary mt-4 flex items-center justify-center gap-1">
            <PieChart className="w-3 h-3" />
            Tap to view asset allocation & investment details
          </p>
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <CardContent className="space-y-6 pt-0 border-t border-border animate-fade-in">
          
          {/* Asset Allocation */}
          <div className="pt-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Asset Allocation
            </h4>
            
            {/* Visual Bar */}
            <div className="h-6 rounded-full overflow-hidden flex mb-4 shadow-inner">
              {portfolio.allocation.map((item, i) => (
                <div
                  key={item.asset}
                  className={cn(
                    allocationColors[i % allocationColors.length],
                    "transition-all duration-500 hover:opacity-80"
                  )}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.asset}: ${item.percentage}%`}
                />
              ))}
            </div>

            {/* Allocation Details */}
            <div className="space-y-3">
              {portfolio.allocation.map((item, i) => (
                <div key={item.asset} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", allocationColors[i % allocationColors.length])} />
                      <span className="font-medium text-foreground">{item.asset}</span>
                    </div>
                    <span className="font-semibold text-primary">{item.percentage}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.instruments.map((instrument, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Profile Details */}
          <div className={cn("p-4 rounded-lg border", currentRiskInfo.bgColor, currentRiskInfo.color.replace('text-', 'border-'))}>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              Risk Profile: {portfolio.riskLevel.charAt(0).toUpperCase() + portfolio.riskLevel.slice(1)}
            </h4>
            <p className="text-sm opacity-90 mb-2">{currentRiskInfo.description}</p>
            <p className="text-xs opacity-75">
              <strong>Best suited for:</strong> {currentRiskInfo.suitableFor}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Historical Returns Range*</span>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {portfolio.expectedReturns.min}% - {portfolio.expectedReturns.max}%
              </p>
              <p className="text-xs text-muted-foreground">*Based on historical data. Past performance does not guarantee future results.</p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Rebalancing</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {portfolio.rebalancingFrequency}
              </p>
              <p className="text-xs text-muted-foreground">Portfolio review cycle</p>
            </div>
          </div>

          {/* Investment Projection */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <h4 className="font-medium flex items-center gap-2 mb-3 text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Illustrative Investment Projection*
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Investment</p>
                <p className="font-semibold text-foreground">
                  {formatAmount(monthlySIP * timelineYears * 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Potential Returns*</p>
                <p className="font-semibold text-primary">
                  {formatAmount(targetAmount - (monthlySIP * timelineYears * 12))}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target Corpus</p>
                <p className="font-semibold text-foreground">
                  {formatAmount(targetAmount)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              *Illustrative only. Actual returns depend on market conditions.
            </p>
          </div>

          {/* Why This Portfolio */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="font-medium flex items-center gap-2 mb-3 text-foreground">
              <Lightbulb className="w-4 h-4 text-accent" />
              About This Approach
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Designed for investors with <strong className="text-foreground">{goalName}</strong> goals and {timelineYears}-year timelines</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Diversified across {portfolio.allocation.length} asset classes to help manage risk</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Based on general market research for Indian market conditions</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Important:</strong> Past performance is not indicative of future results. 
                Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
              </span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
