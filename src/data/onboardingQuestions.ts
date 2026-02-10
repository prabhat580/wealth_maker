export interface OnboardingQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'slider' | 'input';
  options?: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    labels: Record<number, string>;
  };
  // For conditional questions based on serviceModel
  riaOnly?: boolean;
}

// Base questions shown to all users
export const baseQuestions: OnboardingQuestion[] = [
  {
    id: 'age',
    question: 'Which stage of life best describes you?',
    subtitle: 'This helps us understand your investment timeline',
    type: 'single-select',
    options: [
      { value: '18-25', label: 'Just Starting Out', description: '18-25 years', icon: '🌱' },
      { value: '26-35', label: 'Building Career', description: '26-35 years', icon: '🚀' },
      { value: '36-45', label: 'Peak Earning', description: '36-45 years', icon: '💼' },
      { value: '46-55', label: 'Planning Ahead', description: '46-55 years', icon: '🎯' },
      { value: '55+', label: 'Enjoying Rewards', description: '55+ years', icon: '🌟' }
    ]
  },
  {
    id: 'income',
    question: 'What is your annual household income?',
    subtitle: 'This helps us suggest appropriate investment amounts',
    type: 'single-select',
    options: [
      { value: 'below-5l', label: 'Below ₹5 Lakhs', icon: '💰' },
      { value: '5l-10l', label: '₹5 - 10 Lakhs', icon: '💰' },
      { value: '10l-25l', label: '₹10 - 25 Lakhs', icon: '💎' },
      { value: '25l-50l', label: '₹25 - 50 Lakhs', icon: '💎' },
      { value: 'above-50l', label: 'Above ₹50 Lakhs', icon: '👑' }
    ]
  },
  {
    id: 'primaryGoal',
    question: 'What is your most important financial goal?',
    subtitle: 'This helps us show you relevant investment options',
    type: 'single-select',
    options: [
      { value: 'retirement', label: 'Retirement Corpus', description: 'Secure your golden years', icon: '🏖️' },
      { value: 'child-education', label: "Child's Education", description: 'Higher studies fund', icon: '🎓' },
      { value: 'child-marriage', label: "Child's Marriage", description: 'Wedding expenses fund', icon: '💍' },
      { value: 'home-purchase', label: 'Dream Home', description: 'Down payment or full purchase', icon: '🏠' },
      { value: 'wealth-creation', label: 'Wealth Creation', description: 'Grow your money', icon: '📈' },
      { value: 'sabbatical', label: 'Career Break', description: 'Fund a planned break', icon: '✈️' }
    ]
  },
  {
    id: 'goalAmount',
    question: 'How much do you need for this goal?',
    subtitle: 'An approximate target helps us plan better',
    type: 'single-select',
    options: [
      { value: 'below-10l', label: 'Below ₹10 Lakhs', icon: '💰' },
      { value: '10l-25l', label: '₹10 - 25 Lakhs', icon: '💰' },
      { value: '25l-50l', label: '₹25 - 50 Lakhs', icon: '💎' },
      { value: '50l-1cr', label: '₹50 Lakhs - 1 Crore', icon: '💎' },
      { value: '1cr-3cr', label: '₹1 - 3 Crores', icon: '👑' },
      { value: 'above-3cr', label: 'Above ₹3 Crores', icon: '👑' }
    ]
  },
  {
    id: 'riskTolerance',
    question: 'How would you react if your investments dropped 20% in a month?',
    subtitle: 'Your honest answer helps us protect your peace of mind',
    type: 'single-select',
    options: [
      { value: 'very-low', label: 'Sell Everything', description: "I can't handle losses", icon: '😰' },
      { value: 'low', label: 'Quite Worried', description: 'Would lose sleep over it', icon: '😟' },
      { value: 'moderate', label: 'Stay Calm', description: 'Ups and downs happen', icon: '😌' },
      { value: 'high', label: 'Buy More', description: 'Great opportunity!', icon: '💪' },
      { value: 'very-high', label: 'Double Down', description: "I'd invest heavily", icon: '🔥' }
    ]
  },
  {
    id: 'experience',
    question: 'How familiar are you with investing?',
    subtitle: 'No judgment - everyone starts somewhere',
    type: 'single-select',
    options: [
      { value: 'beginner', label: 'Complete Beginner', description: 'Never invested before', icon: '🌱' },
      { value: 'some-knowledge', label: 'Basic Knowledge', description: 'Know about FDs, MFs', icon: '📚' },
      { value: 'intermediate', label: 'Comfortable', description: 'Have some investments', icon: '🎓' },
      { value: 'experienced', label: 'Experienced', description: 'Regular investor', icon: '💼' },
      { value: 'expert', label: 'Expert', description: 'Deep market knowledge', icon: '🏆' }
    ]
  },
  {
    id: 'timeHorizon',
    question: 'When will you need this money?',
    subtitle: 'Your timeline helps us show suitable investment options',
    type: 'single-select',
    options: [
      { value: 'less-1-year', label: 'Within a Year', description: 'Short-term needs', icon: '⏱️' },
      { value: '1-3-years', label: '1-3 Years', description: 'Near-term goals', icon: '📅' },
      { value: '3-5-years', label: '3-5 Years', description: 'Medium-term plans', icon: '🗓️' },
      { value: '5-10-years', label: '5-10 Years', description: 'Long-term vision', icon: '🎯' },
      { value: 'more-10-years', label: '10+ Years', description: 'Building legacy', icon: '🌳' }
    ]
  },
  {
    id: 'monthlyInvestment',
    question: 'How much can you invest monthly?',
    subtitle: 'A realistic number helps us plan better',
    type: 'single-select',
    options: [
      { value: 'below-5k', label: 'Below ₹5,000', icon: '💰' },
      { value: '5k-15k', label: '₹5,000 - 15,000', icon: '💰' },
      { value: '15k-50k', label: '₹15,000 - 50,000', icon: '💎' },
      { value: '50k-1l', label: '₹50,000 - 1 Lakh', icon: '💎' },
      { value: 'above-1l', label: 'Above ₹1 Lakh', icon: '👑' }
    ]
  },
  {
    id: 'existingInvestments',
    question: 'Where do you currently have investments?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    options: [
      { value: 'none', label: 'No Investments Yet', description: 'Starting fresh', icon: '🌱' },
      { value: 'fd-only', label: 'FDs/Savings', description: 'Bank deposits', icon: '🏦' },
      { value: 'mutual-funds', label: 'Mutual Funds', description: 'MF investments', icon: '📊' },
      { value: 'stocks', label: 'Stocks', description: 'Direct equity', icon: '📈' },
      { value: 'gold', label: 'Gold/SGBs', description: 'Precious metals', icon: '🥇' },
      { value: 'real-estate', label: 'Real Estate', description: 'Property investments', icon: '🏠' }
    ]
  }
];

// Service model selection question
export const serviceModelQuestion: OnboardingQuestion = {
  id: 'serviceModel',
  question: 'How would you like to engage with us?',
  subtitle: 'Both are SEBI-regulated models with different fee structures',
  type: 'single-select',
  options: [
    { 
      value: 'advisory', 
      label: 'Investment Advisory', 
      description: 'Fee-based engagement under SEBI IA Regulations. Advisory fee applies; no product commissions.', 
      icon: '📋' 
    },
    { 
      value: 'distribution', 
      label: 'Mutual Fund Distribution', 
      description: 'No separate fee. Distributor receives commission from product manufacturers as per AMFI norms.', 
      icon: '📊' 
    }
  ]
};

// RIA-specific questions for comprehensive suitability assessment (SEBI-compliant)
export const riaQuestions: OnboardingQuestion[] = [
  {
    id: 'netWorth',
    question: 'What is your approximate net worth?',
    subtitle: 'Assets minus liabilities — helps assess your financial capacity',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'below-25l', label: 'Below ₹25 Lakhs', icon: '💰' },
      { value: '25l-50l', label: '₹25 - 50 Lakhs', icon: '💰' },
      { value: '50l-1cr', label: '₹50 Lakhs - 1 Crore', icon: '💎' },
      { value: '1cr-5cr', label: '₹1 - 5 Crores', icon: '💎' },
      { value: '5cr-10cr', label: '₹5 - 10 Crores', icon: '👑' },
      { value: 'above-10cr', label: 'Above ₹10 Crores', icon: '👑' }
    ]
  },
  {
    id: 'liquidAssets',
    question: 'What portion of your wealth is in liquid assets?',
    subtitle: 'Cash, FDs, liquid mutual funds — available within 7 days',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'below-10', label: 'Less than 10%', description: 'Most assets are locked', icon: '🔒' },
      { value: '10-25', label: '10-25%', description: 'Limited liquidity', icon: '💧' },
      { value: '25-50', label: '25-50%', description: 'Moderate liquidity', icon: '🌊' },
      { value: 'above-50', label: 'More than 50%', description: 'Highly liquid', icon: '🌀' }
    ]
  },
  {
    id: 'emergencyFund',
    question: 'Do you have an emergency fund?',
    subtitle: 'Savings to cover 6+ months of expenses',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'none', label: 'No Emergency Fund', description: 'Need to build one', icon: '⚠️' },
      { value: 'partial', label: '1-3 Months', description: 'Partially covered', icon: '🛡️' },
      { value: 'adequate', label: '3-6 Months', description: 'Reasonably secure', icon: '✅' },
      { value: 'strong', label: '6+ Months', description: 'Well protected', icon: '💪' }
    ]
  },
  {
    id: 'liabilities',
    question: 'What are your current liabilities?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    riaOnly: true,
    options: [
      { value: 'none', label: 'No Major Liabilities', description: 'Debt-free', icon: '✨' },
      { value: 'home-loan', label: 'Home Loan', description: 'Property EMI', icon: '🏠' },
      { value: 'car-loan', label: 'Car/Vehicle Loan', description: 'Auto EMI', icon: '🚗' },
      { value: 'personal-loan', label: 'Personal Loan', description: 'Unsecured debt', icon: '💳' },
      { value: 'education-loan', label: 'Education Loan', description: 'Student debt', icon: '🎓' },
      { value: 'credit-card', label: 'Credit Card Dues', description: 'Revolving credit', icon: '💳' }
    ]
  },
  {
    id: 'dependents',
    question: 'How many financial dependents do you have?',
    subtitle: 'Family members who rely on your income',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'none', label: 'None', description: 'No dependents', icon: '1️⃣' },
      { value: '1-2', label: '1-2 Dependents', description: 'Small family', icon: '👨‍👩‍👦' },
      { value: '3-4', label: '3-4 Dependents', description: 'Growing family', icon: '👨‍👩‍👧‍👦' },
      { value: '5-plus', label: '5 or More', description: 'Large family', icon: '👨‍👩‍👧‍👦' }
    ]
  },
  {
    id: 'insuranceCoverage',
    question: 'What insurance coverage do you have?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    riaOnly: true,
    options: [
      { value: 'term-life', label: 'Term Life Insurance', description: 'Income protection', icon: '🛡️' },
      { value: 'health', label: 'Health Insurance', description: 'Medical cover', icon: '🏥' },
      { value: 'critical-illness', label: 'Critical Illness', description: 'Serious disease cover', icon: '❤️' },
      { value: 'accident', label: 'Accident Cover', description: 'Personal accident', icon: '🚑' },
      { value: 'none', label: 'No Insurance', description: 'Not covered', icon: '⚠️' }
    ]
  },
  {
    id: 'incomeStability',
    question: 'How stable is your income?',
    subtitle: 'This affects how much risk you can realistically take',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'very-stable', label: 'Very Stable', description: 'Government/PSU job, pension', icon: '🏛️' },
      { value: 'stable', label: 'Stable', description: 'Salaried with established company', icon: '🏢' },
      { value: 'moderate', label: 'Moderate', description: 'Private sector/startup', icon: '💼' },
      { value: 'variable', label: 'Variable', description: 'Business/freelance income', icon: '📊' },
      { value: 'irregular', label: 'Irregular', description: 'Seasonal/project-based', icon: '🎲' }
    ]
  },
  {
    id: 'taxBracket',
    question: 'What is your current income tax bracket?',
    subtitle: 'Helps optimize tax-efficient investment strategies',
    type: 'single-select',
    riaOnly: true,
    options: [
      { value: 'nil', label: 'No Tax', description: 'Below taxable limit', icon: '✅' },
      { value: '5-percent', label: '5% Bracket', description: '₹3-7 Lakhs', icon: '📊' },
      { value: '20-percent', label: '20% Bracket', description: '₹7-10 Lakhs', icon: '📈' },
      { value: '30-percent', label: '30% Bracket', description: 'Above ₹10 Lakhs', icon: '💎' },
      { value: 'surcharge', label: '30% + Surcharge', description: 'Above ₹50 Lakhs', icon: '👑' }
    ]
  },
  {
    id: 'advisoryScope',
    question: 'What areas do you need advisory support for?',
    subtitle: 'Select all that apply — helps us customize your plan',
    type: 'multi-select',
    riaOnly: true,
    options: [
      { value: 'investment', label: 'Investment Planning', description: 'Portfolio management', icon: '📈' },
      { value: 'retirement', label: 'Retirement Planning', description: 'Post-work security', icon: '🏖️' },
      { value: 'tax', label: 'Tax Planning', description: 'Optimize tax outgo', icon: '📋' },
      { value: 'insurance', label: 'Insurance Review', description: 'Risk coverage', icon: '🛡️' },
      { value: 'estate', label: 'Estate Planning', description: 'Wealth transfer', icon: '🏛️' },
      { value: 'debt', label: 'Debt Management', description: 'Loan optimization', icon: '💳' }
    ]
  },
  {
    id: 'investmentConstraints',
    question: 'Do you have any investment preferences or constraints?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    riaOnly: true,
    options: [
      { value: 'no-constraints', label: 'No Specific Preferences', description: 'Open to all options', icon: '✅' },
      { value: 'esg', label: 'ESG/Ethical Investing', description: 'Socially responsible', icon: '🌿' },
      { value: 'no-tobacco-alcohol', label: 'No Tobacco/Alcohol', description: 'Avoid sin stocks', icon: '🚫' },
      { value: 'shariah', label: 'Shariah Compliant', description: 'Islamic finance', icon: '☪️' },
      { value: 'domestic-only', label: 'Domestic Only', description: 'No international', icon: '🇮🇳' },
      { value: 'no-direct-equity', label: 'No Direct Stocks', description: 'MFs/ETFs only', icon: '📊' }
    ]
  }
];

// Helper function to get questions based on service model selection
export const getQuestionsForPath = (serviceModel: 'advisory' | 'distribution' | null): OnboardingQuestion[] => {
  if (serviceModel === 'advisory') {
    return [...baseQuestions, serviceModelQuestion, ...riaQuestions];
  }
  return [...baseQuestions, serviceModelQuestion];
};

// Legacy export for backward compatibility
export const onboardingQuestions: OnboardingQuestion[] = [...baseQuestions, serviceModelQuestion];