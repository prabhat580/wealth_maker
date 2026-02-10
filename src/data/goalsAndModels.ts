// Goal-based investment data with model portfolios for Indian investors

export type GoalType = 
  | 'retirement'
  | 'child-education'
  | 'child-marriage'
  | 'home-purchase'
  | 'wealth-creation'
  | 'emergency-fund'
  | 'sabbatical'
  | 'dream-vacation'
  | 'car-purchase';

export interface FinancialGoal {
  id: GoalType;
  name: string;
  icon: string;
  description: string;
  typicalTimeline: string;
  priority: 'essential' | 'important' | 'aspirational';
}

export const financialGoals: Record<GoalType, FinancialGoal> = {
  'retirement': {
    id: 'retirement',
    name: 'Retirement Corpus',
    icon: '🏖️',
    description: 'Build a corpus for a worry-free retirement',
    typicalTimeline: '15-30 years',
    priority: 'essential'
  },
  'child-education': {
    id: 'child-education',
    name: "Child's Education",
    icon: '🎓',
    description: 'Fund higher education (India/abroad)',
    typicalTimeline: '10-18 years',
    priority: 'essential'
  },
  'child-marriage': {
    id: 'child-marriage',
    name: "Child's Marriage",
    icon: '💍',
    description: 'Create a fund for wedding expenses',
    typicalTimeline: '15-25 years',
    priority: 'important'
  },
  'home-purchase': {
    id: 'home-purchase',
    name: 'Dream Home',
    icon: '🏠',
    description: 'Save for down payment or full purchase',
    typicalTimeline: '3-10 years',
    priority: 'essential'
  },
  'wealth-creation': {
    id: 'wealth-creation',
    name: 'Wealth Creation',
    icon: '📈',
    description: 'Grow your wealth through smart investing',
    typicalTimeline: '5-15 years',
    priority: 'important'
  },
  'emergency-fund': {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    icon: '🛡️',
    description: '6-12 months of expenses as safety net',
    typicalTimeline: '1-2 years',
    priority: 'essential'
  },
  'sabbatical': {
    id: 'sabbatical',
    name: 'Career Break / Sabbatical',
    icon: '✈️',
    description: 'Fund a planned career break or travel',
    typicalTimeline: '2-5 years',
    priority: 'aspirational'
  },
  'dream-vacation': {
    id: 'dream-vacation',
    name: 'Dream Vacation',
    icon: '🌍',
    description: 'Save for that bucket-list trip',
    typicalTimeline: '1-3 years',
    priority: 'aspirational'
  },
  'car-purchase': {
    id: 'car-purchase',
    name: 'Vehicle Purchase',
    icon: '🚗',
    description: 'Save for your next car or upgrade',
    typicalTimeline: '1-5 years',
    priority: 'important'
  }
};

// Model Portfolio configurations based on goal + risk profile
export interface ModelPortfolio {
  name: string;
  description: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  expectedReturns: { min: number; max: number };
  allocation: {
    asset: string;
    percentage: number;
    instruments: string[];
  }[];
  rebalancingFrequency: string;
  minimumInvestment: number;
}

export interface GoalModelPortfolio {
  goalType: GoalType;
  timelineYears: number;
  targetAmount: number;
  monthlyRequired: number;
  modelPortfolio: ModelPortfolio;
}

// Pre-defined model portfolios
export const modelPortfolios: Record<string, ModelPortfolio> = {
  'aggressive-growth': {
    name: 'Aggressive Growth Portfolio',
    description: 'High equity exposure for long-term wealth creation. Best for investors with 10+ years horizon and high risk tolerance.',
    riskLevel: 'aggressive',
    expectedReturns: { min: 12, max: 15 },
    allocation: [
      { asset: 'Large Cap Equity', percentage: 35, instruments: ['Nifty 50 Index Fund', 'Large Cap MF'] },
      { asset: 'Mid & Small Cap', percentage: 30, instruments: ['Mid Cap MF', 'Small Cap MF'] },
      { asset: 'International Equity', percentage: 10, instruments: ['US Equity Fund', 'NASDAQ Fund'] },
      { asset: 'Debt Funds', percentage: 15, instruments: ['Corporate Bond Fund', 'Gilt Fund'] },
      { asset: 'Gold', percentage: 5, instruments: ['Gold ETF', 'Sovereign Gold Bond'] },
      { asset: 'REITs', percentage: 5, instruments: ['Embassy REIT', 'Mindspace REIT'] }
    ],
    rebalancingFrequency: 'Quarterly',
    minimumInvestment: 10000
  },
  'balanced-growth': {
    name: 'Balanced Growth Portfolio',
    description: 'Optimal mix of growth and stability. Ideal for medium-term goals with moderate risk appetite.',
    riskLevel: 'moderate',
    expectedReturns: { min: 10, max: 12 },
    allocation: [
      { asset: 'Large Cap Equity', percentage: 30, instruments: ['Nifty 50 Index Fund', 'Large Cap MF'] },
      { asset: 'Mid Cap Equity', percentage: 15, instruments: ['Mid Cap MF', 'Flexi Cap MF'] },
      { asset: 'Hybrid Funds', percentage: 15, instruments: ['Balanced Advantage Fund', 'Equity Savings Fund'] },
      { asset: 'Debt Funds', percentage: 25, instruments: ['Corporate Bond Fund', 'Short Duration Fund'] },
      { asset: 'Fixed Deposits', percentage: 10, instruments: ['Bank FD', 'Corporate FD'] },
      { asset: 'Gold', percentage: 5, instruments: ['Gold ETF', 'Sovereign Gold Bond'] }
    ],
    rebalancingFrequency: 'Semi-annually',
    minimumInvestment: 5000
  },
  'conservative-stable': {
    name: 'Conservative Stability Portfolio',
    description: 'Capital preservation with steady returns. Perfect for short-term goals or low risk tolerance.',
    riskLevel: 'conservative',
    expectedReturns: { min: 7, max: 9 },
    allocation: [
      { asset: 'Large Cap Equity', percentage: 15, instruments: ['Large Cap Index Fund'] },
      { asset: 'Debt Funds', percentage: 35, instruments: ['Corporate Bond Fund', 'Banking & PSU Fund'] },
      { asset: 'Fixed Deposits', percentage: 25, instruments: ['Bank FD', 'Post Office TD'] },
      { asset: 'Government Bonds', percentage: 15, instruments: ['Gilt Fund', 'RBI Bonds'] },
      { asset: 'Liquid Funds', percentage: 5, instruments: ['Liquid Fund', 'Money Market Fund'] },
      { asset: 'Gold', percentage: 5, instruments: ['Sovereign Gold Bond'] }
    ],
    rebalancingFrequency: 'Annually',
    minimumInvestment: 5000
  },
  'retirement-focused': {
    name: 'Retirement Builder Portfolio',
    description: 'Long-term wealth accumulation with NPS integration. Tax-efficient retirement planning.',
    riskLevel: 'moderate',
    expectedReturns: { min: 10, max: 13 },
    allocation: [
      { asset: 'NPS - Equity', percentage: 25, instruments: ['NPS Tier 1 - Equity'] },
      { asset: 'NPS - Corporate Bonds', percentage: 15, instruments: ['NPS Tier 1 - Corporate Bonds'] },
      { asset: 'ELSS Funds', percentage: 20, instruments: ['Tax Saving ELSS MF'] },
      { asset: 'PPF', percentage: 10, instruments: ['Public Provident Fund'] },
      { asset: 'Large Cap Equity', percentage: 15, instruments: ['Large Cap MF', 'Index Fund'] },
      { asset: 'Debt Funds', percentage: 10, instruments: ['Corporate Bond Fund'] },
      { asset: 'Gold', percentage: 5, instruments: ['Sovereign Gold Bond'] }
    ],
    rebalancingFrequency: 'Annually',
    minimumInvestment: 10000
  },
  'child-future': {
    name: "Child's Future Portfolio",
    description: "Systematic wealth building for your child's education and life milestones.",
    riskLevel: 'moderate',
    expectedReturns: { min: 11, max: 14 },
    allocation: [
      { asset: 'Large Cap Equity', percentage: 30, instruments: ['Large Cap MF', 'Index Fund'] },
      { asset: 'Mid Cap Equity', percentage: 20, instruments: ['Mid Cap MF'] },
      { asset: 'International Equity', percentage: 10, instruments: ['US Equity Fund'] },
      { asset: 'Debt Funds', percentage: 20, instruments: ['Corporate Bond Fund', 'Gilt Fund'] },
      { asset: 'Sukanya/PPF', percentage: 10, instruments: ['Sukanya Samriddhi', 'PPF'] },
      { asset: 'Gold', percentage: 10, instruments: ['Sovereign Gold Bond', 'Gold ETF'] }
    ],
    rebalancingFrequency: 'Semi-annually',
    minimumInvestment: 5000
  },
  'short-term-goal': {
    name: 'Short-Term Goal Portfolio',
    description: 'Capital protection with liquidity for goals within 1-3 years.',
    riskLevel: 'conservative',
    expectedReturns: { min: 6, max: 8 },
    allocation: [
      { asset: 'Liquid Funds', percentage: 25, instruments: ['Liquid Fund', 'Overnight Fund'] },
      { asset: 'Ultra Short Duration', percentage: 25, instruments: ['Ultra Short Duration Fund'] },
      { asset: 'Short Duration Debt', percentage: 20, instruments: ['Short Duration Fund'] },
      { asset: 'Fixed Deposits', percentage: 20, instruments: ['Bank FD', 'Corporate FD'] },
      { asset: 'Arbitrage Funds', percentage: 10, instruments: ['Arbitrage Fund'] }
    ],
    rebalancingFrequency: 'Quarterly',
    minimumInvestment: 5000
  }
};

// Function to get a sample portfolio based on goal and profile
// DISCLAIMER: This is for illustration purposes only and does not constitute investment advice.
// Investors should consult a qualified financial advisor before making investment decisions.
export function getRecommendedPortfolio(
  goalType: GoalType,
  timelineYears: number,
  riskProfile: string
): ModelPortfolio {
  // Logic to match goal + timeline + risk to appropriate portfolio
  if (goalType === 'retirement') {
    return modelPortfolios['retirement-focused'];
  }
  
  if (goalType === 'child-education' || goalType === 'child-marriage') {
    return modelPortfolios['child-future'];
  }
  
  if (timelineYears <= 3) {
    return modelPortfolios['short-term-goal'];
  }
  
  if (riskProfile === 'conservative-saver' || riskProfile === 'income-seeker') {
    return modelPortfolios['conservative-stable'];
  }
  
  if (riskProfile === 'growth-seeker') {
    return modelPortfolios['aggressive-growth'];
  }
  
  return modelPortfolios['balanced-growth'];
}

// Calculate required monthly SIP for a goal
export function calculateRequiredSIP(
  targetAmount: number,
  timelineYears: number,
  expectedReturn: number
): number {
  const monthlyRate = expectedReturn / 100 / 12;
  const months = timelineYears * 12;
  
  if (monthlyRate === 0) {
    return targetAmount / months;
  }
  
  const sip = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(sip);
}

// Goal progress tracking
export interface GoalProgress {
  goalId: string;
  goalType: GoalType;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  portfolioType: string;
  progressPercentage: number;
  onTrack: boolean;
}

// Sample goal progress data (placeholder)
export const sampleGoalProgress: GoalProgress[] = [
  {
    goalId: 'goal-1',
    goalType: 'retirement',
    name: 'Retirement at 60',
    targetAmount: 30000000,
    currentAmount: 4820000,
    targetDate: '2045-01-01',
    monthlyContribution: 35000,
    portfolioType: 'retirement-focused',
    progressPercentage: 16,
    onTrack: true
  },
  {
    goalId: 'goal-2',
    goalType: 'child-education',
    name: "Aryan's College Fund",
    targetAmount: 5000000,
    currentAmount: 1200000,
    targetDate: '2032-06-01',
    monthlyContribution: 15000,
    portfolioType: 'child-future',
    progressPercentage: 24,
    onTrack: true
  },
  {
    goalId: 'goal-3',
    goalType: 'home-purchase',
    name: 'Dream Home Down Payment',
    targetAmount: 2500000,
    currentAmount: 800000,
    targetDate: '2027-12-01',
    monthlyContribution: 25000,
    portfolioType: 'balanced-growth',
    progressPercentage: 32,
    onTrack: false
  }
];
