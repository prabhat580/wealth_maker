// AMEYA Customer Profile Types - Life-stage integrated with Japanese philosophy
// Based on the 100-year life vision (人生100年時代)

export type CustomerProfileType = 
  | 'conservative-saver'
  | 'balanced-investor'
  | 'growth-seeker'
  | 'tax-optimizer'
  | 'wealth-builder'
  | 'income-seeker';

export interface CustomerProfile {
  type: CustomerProfileType;
  name: string;
  japaneseName: string; // Japanese naming for AMEYA branding
  tagline: string; // Short inspirational tagline
  description: string;
  lifePhilosophy: string; // AMEYA's Omotenashi-style guidance
  characteristics: string[];
  recommendedAllocation: {
    mutualFunds: number;
    stocks: number;
    fixedDeposits: number;
    bonds: number;
    insurance: number;
    gold: number;
  };
  color: string;
  pillar: 'wealth' | 'health' | 'purpose'; // Primary life pillar alignment
}

export const customerProfiles: Record<CustomerProfileType, CustomerProfile> = {
  'conservative-saver': {
    type: 'conservative-saver',
    name: 'The Calm Protector',
    japaneseName: '守護者',
    tagline: 'Steady foundations for lasting peace',
    description: 'You value stability and security above all. Your approach reflects the Japanese principle of 安心 (anshin) — peace of mind through careful protection.',
    lifePhilosophy: 'We walk with you to preserve what matters most, ensuring your wealth provides lasting security for you and those you love.',
    characteristics: [
      'Values capital preservation',
      'Seeks predictable, steady returns',
      'Prioritizes liquidity and accessibility',
      'Prefers time-tested instruments'
    ],
    recommendedAllocation: {
      mutualFunds: 20,
      stocks: 5,
      fixedDeposits: 40,
      bonds: 20,
      insurance: 10,
      gold: 5
    },
    color: 'hsl(220, 45%, 50%)',
    pillar: 'wealth'
  },
  'balanced-investor': {
    type: 'balanced-investor',
    name: 'The Life Harmonizer',
    japaneseName: '調和',
    tagline: 'Balance in all seasons of life',
    description: 'You seek harmony between growth and stability, embodying the principle of 調和 (chōwa) — finding balance in all things.',
    lifePhilosophy: 'Together, we craft a portfolio that flows with life\'s seasons — growing when opportunity calls, protecting when prudence requires.',
    characteristics: [
      'Embraces thoughtful diversification',
      'Maintains long-term perspective',
      'Values balanced risk-reward',
      'Practices systematic discipline'
    ],
    recommendedAllocation: {
      mutualFunds: 35,
      stocks: 20,
      fixedDeposits: 20,
      bonds: 10,
      insurance: 10,
      gold: 5
    },
    color: 'hsl(155, 45%, 45%)',
    pillar: 'purpose'
  },
  'growth-seeker': {
    type: 'growth-seeker',
    name: 'The Purpose-Driven Builder',
    japaneseName: '開拓者',
    tagline: 'Bold vision, patient execution',
    description: 'You pursue ambitious goals with purpose and conviction. Your spirit reflects 開拓 (kaitaku) — the courage to pioneer new paths.',
    lifePhilosophy: 'We support your bold ambitions with calm precision, helping you build wealth that serves your greater purpose.',
    characteristics: [
      'Embraces market opportunities',
      'Focuses on long-term growth',
      'Comfortable with volatility',
      'Goal-oriented and purposeful'
    ],
    recommendedAllocation: {
      mutualFunds: 30,
      stocks: 45,
      fixedDeposits: 5,
      bonds: 5,
      insurance: 10,
      gold: 5
    },
    color: 'hsl(350, 65%, 45%)',
    pillar: 'purpose'
  },
  'tax-optimizer': {
    type: 'tax-optimizer',
    name: 'The Strategic Guardian',
    japaneseName: '戦略家',
    tagline: 'Wisdom in every decision',
    description: 'You approach wealth with strategic precision, embodying 知恵 (chie) — the wisdom to optimize every aspect of your financial life.',
    lifePhilosophy: 'We partner with you to navigate complexity with clarity, ensuring no opportunity for wealth preservation goes unnoticed.',
    characteristics: [
      'Strategically tax-conscious',
      'Maximizes 80C, 80D benefits',
      'Values ELSS and PPF instruments',
      'Plans with precision and foresight'
    ],
    recommendedAllocation: {
      mutualFunds: 40,
      stocks: 15,
      fixedDeposits: 15,
      bonds: 10,
      insurance: 15,
      gold: 5
    },
    color: 'hsl(280, 40%, 50%)',
    pillar: 'wealth'
  },
  'wealth-builder': {
    type: 'wealth-builder',
    name: 'The 100-Year Architect',
    japaneseName: '百年建築家',
    tagline: 'Building legacies that outlast lifetimes',
    description: 'You think in generations, not years. Your approach embodies 百年 (hyakunen) — the vision to create wealth that endures across the 100-year life.',
    lifePhilosophy: 'We walk beside you on the long journey of wealth creation, celebrating the power of patience and compound growth.',
    characteristics: [
      'Committed to systematic SIPs',
      'Goal-oriented and disciplined',
      'Patient, long-term mindset',
      'Believes in compounding power'
    ],
    recommendedAllocation: {
      mutualFunds: 45,
      stocks: 25,
      fixedDeposits: 10,
      bonds: 5,
      insurance: 10,
      gold: 5
    },
    color: 'hsl(40, 60%, 50%)',
    pillar: 'purpose'
  },
  'income-seeker': {
    type: 'income-seeker',
    name: 'The Longevity Planner',
    japaneseName: '長寿設計者',
    tagline: 'Abundance for every season',
    description: 'You plan for a long, fulfilling life with steady income. Your vision reflects 長寿 (chōju) — designing wealth that sustains you through all of life\'s chapters.',
    lifePhilosophy: 'We help you create income streams that flow like a gentle river — reliable, sustaining, and enduring through your 100-year journey.',
    characteristics: [
      'Focuses on regular income',
      'Values capital protection',
      'Prefers lower volatility',
      'Plans for longevity'
    ],
    recommendedAllocation: {
      mutualFunds: 25,
      stocks: 10,
      fixedDeposits: 30,
      bonds: 20,
      insurance: 10,
      gold: 5
    },
    color: 'hsl(180, 40%, 45%)',
    pillar: 'health'
  }
};

export interface OnboardingAnswer {
  questionId: string;
  value: string | number | string[];
}

export interface OnboardingState {
  currentStep: number;
  answers: OnboardingAnswer[];
  calculatedProfile: CustomerProfileType | null;
  profileScore: Record<CustomerProfileType, number>;
}

// Profile scoring weights for each question
export const profileWeights: Record<string, Record<string, Partial<Record<CustomerProfileType, number>>>> = {
  age: {
    '18-25': { 'growth-seeker': 3, 'wealth-builder': 2 },
    '26-35': { 'wealth-builder': 3, 'balanced-investor': 2, 'tax-optimizer': 1 },
    '36-45': { 'balanced-investor': 3, 'tax-optimizer': 2, 'wealth-builder': 1 },
    '46-55': { 'balanced-investor': 2, 'income-seeker': 2, 'conservative-saver': 1 },
    '55+': { 'income-seeker': 3, 'conservative-saver': 2 }
  },
  income: {
    'below-5l': { 'conservative-saver': 2, 'tax-optimizer': 1 },
    '5l-10l': { 'balanced-investor': 2, 'tax-optimizer': 2 },
    '10l-25l': { 'wealth-builder': 2, 'tax-optimizer': 2, 'balanced-investor': 1 },
    '25l-50l': { 'growth-seeker': 2, 'wealth-builder': 2, 'tax-optimizer': 1 },
    'above-50l': { 'growth-seeker': 3, 'wealth-builder': 2 }
  },
  primaryGoal: {
    'retirement': { 'income-seeker': 2, 'balanced-investor': 2, 'wealth-builder': 1 },
    'wealth-creation': { 'growth-seeker': 3, 'wealth-builder': 2 },
    'child-education': { 'balanced-investor': 2, 'wealth-builder': 2 },
    'child-marriage': { 'balanced-investor': 2, 'wealth-builder': 1 },
    'home-purchase': { 'conservative-saver': 2, 'balanced-investor': 1 },
    'sabbatical': { 'balanced-investor': 2, 'growth-seeker': 1 }
  },
  goalAmount: {
    'below-10l': { 'conservative-saver': 1 },
    '10l-25l': { 'balanced-investor': 1 },
    '25l-50l': { 'balanced-investor': 1, 'wealth-builder': 1 },
    '50l-1cr': { 'wealth-builder': 2 },
    '1cr-3cr': { 'growth-seeker': 2, 'wealth-builder': 1 },
    'above-3cr': { 'growth-seeker': 2, 'wealth-builder': 2 }
  },
  riskTolerance: {
    'very-low': { 'conservative-saver': 4 },
    'low': { 'conservative-saver': 2, 'income-seeker': 2 },
    'moderate': { 'balanced-investor': 3, 'wealth-builder': 1 },
    'high': { 'growth-seeker': 2, 'wealth-builder': 2 },
    'very-high': { 'growth-seeker': 4 }
  },
  experience: {
    'beginner': { 'conservative-saver': 2, 'balanced-investor': 1 },
    'some-knowledge': { 'balanced-investor': 2, 'wealth-builder': 1 },
    'intermediate': { 'wealth-builder': 2, 'tax-optimizer': 1 },
    'experienced': { 'growth-seeker': 2, 'wealth-builder': 1 },
    'expert': { 'growth-seeker': 3 }
  },
  timeHorizon: {
    'less-1-year': { 'conservative-saver': 3, 'income-seeker': 1 },
    '1-3-years': { 'balanced-investor': 2, 'conservative-saver': 1 },
    '3-5-years': { 'balanced-investor': 2, 'wealth-builder': 2 },
    '5-10-years': { 'wealth-builder': 3, 'growth-seeker': 1 },
    'more-10-years': { 'growth-seeker': 3, 'wealth-builder': 2 }
  },
  monthlyInvestment: {
    'below-5k': { 'conservative-saver': 2 },
    '5k-15k': { 'balanced-investor': 2, 'wealth-builder': 1 },
    '15k-50k': { 'wealth-builder': 2, 'tax-optimizer': 1 },
    '50k-1l': { 'growth-seeker': 2, 'wealth-builder': 2 },
    'above-1l': { 'growth-seeker': 3, 'tax-optimizer': 1 }
  },
  existingInvestments: {
    'fd-only': { 'conservative-saver': 3 },
    'fd-mf': { 'balanced-investor': 2 },
    'stocks-mf': { 'growth-seeker': 2, 'wealth-builder': 1 },
    'diversified': { 'balanced-investor': 2, 'wealth-builder': 2 },
    'none': { 'conservative-saver': 1 }
  }
};

export function calculateProfile(answers: OnboardingAnswer[]): { 
  profile: CustomerProfileType; 
  scores: Record<CustomerProfileType, number>;
  confidence: number;
} {
  const scores: Record<CustomerProfileType, number> = {
    'conservative-saver': 0,
    'balanced-investor': 0,
    'growth-seeker': 0,
    'tax-optimizer': 0,
    'wealth-builder': 0,
    'income-seeker': 0
  };

  answers.forEach(answer => {
    const questionWeights = profileWeights[answer.questionId];
    if (questionWeights) {
      const valueWeights = questionWeights[answer.value as string];
      if (valueWeights) {
        Object.entries(valueWeights).forEach(([profile, weight]) => {
          scores[profile as CustomerProfileType] += weight;
        });
      }
    }
  });

  const maxScore = Math.max(...Object.values(scores));
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const profile = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as CustomerProfileType;
  const confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 0;

  return { profile, scores, confidence };
}
