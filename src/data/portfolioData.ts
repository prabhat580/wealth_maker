// Portfolio data for Indian wealth management platform

export interface Holding {
  id: string;
  name: string;
  category?: string;
  investedAmount: number;
  currentValue: number;
  units?: number;
  nav?: number;
  returns: number;
  returnsPercentage: number;
  maturityDate?: string;
  interestRate?: number;
  premium?: number;
  sumAssured?: number;
}

export interface AssetClass {
  id: string;
  name: string;
  icon: string;
  totalInvested: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  holdings: Holding[];
  color: string;
}

export const portfolioData: AssetClass[] = [
  {
    id: "mutual-funds",
    name: "Mutual Funds",
    icon: "TrendingUp",
    totalInvested: 1250000,
    currentValue: 1485000,
    returns: 235000,
    returnsPercentage: 18.8,
    color: "#C41E3A",
    holdings: [
      {
        id: "mf-1",
        name: "HDFC Mid-Cap Opportunities Fund",
        category: "Mid Cap",
        investedAmount: 500000,
        currentValue: 625000,
        units: 4523.45,
        nav: 138.17,
        returns: 125000,
        returnsPercentage: 25.0,
      },
      {
        id: "mf-2",
        name: "ICICI Prudential Bluechip Fund",
        category: "Large Cap",
        investedAmount: 400000,
        currentValue: 448000,
        units: 5234.12,
        nav: 85.59,
        returns: 48000,
        returnsPercentage: 12.0,
      },
      {
        id: "mf-3",
        name: "Axis Small Cap Fund",
        category: "Small Cap",
        investedAmount: 350000,
        currentValue: 412000,
        units: 4125.67,
        nav: 99.87,
        returns: 62000,
        returnsPercentage: 17.7,
      },
    ],
  },
  {
    id: "stocks",
    name: "Stocks",
    icon: "BarChart3",
    totalInvested: 850000,
    currentValue: 1020000,
    returns: 170000,
    returnsPercentage: 20.0,
    color: "#E6B422",
    holdings: [
      {
        id: "stock-1",
        name: "Reliance Industries Ltd",
        category: "Energy",
        investedAmount: 300000,
        currentValue: 375000,
        units: 125,
        returns: 75000,
        returnsPercentage: 25.0,
      },
      {
        id: "stock-2",
        name: "Infosys Ltd",
        category: "IT",
        investedAmount: 250000,
        currentValue: 285000,
        units: 175,
        returns: 35000,
        returnsPercentage: 14.0,
      },
      {
        id: "stock-3",
        name: "HDFC Bank Ltd",
        category: "Banking",
        investedAmount: 200000,
        currentValue: 240000,
        units: 140,
        returns: 40000,
        returnsPercentage: 20.0,
      },
      {
        id: "stock-4",
        name: "Tata Motors Ltd",
        category: "Auto",
        investedAmount: 100000,
        currentValue: 120000,
        units: 120,
        returns: 20000,
        returnsPercentage: 20.0,
      },
    ],
  },
  {
    id: "fixed-deposits",
    name: "Fixed Deposits",
    icon: "Landmark",
    totalInvested: 600000,
    currentValue: 642000,
    returns: 42000,
    returnsPercentage: 7.0,
    color: "#2E8B57",
    holdings: [
      {
        id: "fd-1",
        name: "HDFC Bank FD",
        investedAmount: 300000,
        currentValue: 321000,
        returns: 21000,
        returnsPercentage: 7.0,
        maturityDate: "2025-06-15",
        interestRate: 7.0,
      },
      {
        id: "fd-2",
        name: "SBI FD",
        investedAmount: 200000,
        currentValue: 214000,
        returns: 14000,
        returnsPercentage: 7.0,
        maturityDate: "2025-12-20",
        interestRate: 6.8,
      },
      {
        id: "fd-3",
        name: "ICICI Bank FD",
        investedAmount: 100000,
        currentValue: 107000,
        returns: 7000,
        returnsPercentage: 7.0,
        maturityDate: "2024-08-10",
        interestRate: 7.25,
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "Shield",
    totalInvested: 450000,
    currentValue: 520000,
    returns: 70000,
    returnsPercentage: 15.6,
    color: "#4169E1",
    holdings: [
      {
        id: "ins-1",
        name: "LIC Jeevan Anand",
        investedAmount: 250000,
        currentValue: 295000,
        returns: 45000,
        returnsPercentage: 18.0,
        premium: 50000,
        sumAssured: 1000000,
      },
      {
        id: "ins-2",
        name: "HDFC Life Click 2 Invest",
        investedAmount: 200000,
        currentValue: 225000,
        returns: 25000,
        returnsPercentage: 12.5,
        premium: 40000,
        sumAssured: 500000,
      },
    ],
  },
  {
    id: "bonds",
    name: "Bonds",
    icon: "FileText",
    totalInvested: 400000,
    currentValue: 432000,
    returns: 32000,
    returnsPercentage: 8.0,
    color: "#9370DB",
    holdings: [
      {
        id: "bond-1",
        name: "RBI Floating Rate Bond",
        investedAmount: 200000,
        currentValue: 218000,
        returns: 18000,
        returnsPercentage: 9.0,
        maturityDate: "2028-01-01",
        interestRate: 8.05,
      },
      {
        id: "bond-2",
        name: "NABARD Bond",
        investedAmount: 200000,
        currentValue: 214000,
        returns: 14000,
        returnsPercentage: 7.0,
        maturityDate: "2027-06-30",
        interestRate: 7.5,
      },
    ],
  },
  {
    id: "unlisted-equity",
    name: "Unlisted Equity",
    icon: "Gem",
    totalInvested: 300000,
    currentValue: 450000,
    returns: 150000,
    returnsPercentage: 50.0,
    color: "#FF6B6B",
    holdings: [
      {
        id: "ue-1",
        name: "Swiggy (Pre-IPO)",
        investedAmount: 150000,
        currentValue: 240000,
        units: 100,
        returns: 90000,
        returnsPercentage: 60.0,
      },
      {
        id: "ue-2",
        name: "PharmEasy (Pre-IPO)",
        investedAmount: 150000,
        currentValue: 210000,
        units: 200,
        returns: 60000,
        returnsPercentage: 40.0,
      },
    ],
  },
  {
    id: "ncd-mld",
    name: "NCDs / MLDs",
    icon: "Layers",
    totalInvested: 250000,
    currentValue: 275000,
    returns: 25000,
    returnsPercentage: 10.0,
    color: "#20B2AA",
    holdings: [
      {
        id: "ncd-1",
        name: "Shriram Transport Finance NCD",
        investedAmount: 150000,
        currentValue: 165000,
        returns: 15000,
        returnsPercentage: 10.0,
        maturityDate: "2026-03-15",
        interestRate: 9.5,
      },
      {
        id: "mld-1",
        name: "ICICI Prudential MLD",
        investedAmount: 100000,
        currentValue: 110000,
        returns: 10000,
        returnsPercentage: 10.0,
        maturityDate: "2025-09-20",
      },
    ],
  },
];

export const getTotalPortfolioValue = () => {
  return portfolioData.reduce((sum, asset) => sum + asset.currentValue, 0);
};

export const getTotalInvested = () => {
  return portfolioData.reduce((sum, asset) => sum + asset.totalInvested, 0);
};

export const getTotalReturns = () => {
  return portfolioData.reduce((sum, asset) => sum + asset.returns, 0);
};

export const getOverallReturnsPercentage = () => {
  const totalInvested = getTotalInvested();
  const totalReturns = getTotalReturns();
  return ((totalReturns / totalInvested) * 100).toFixed(2);
};

export const getAssetAllocation = () => {
  const total = getTotalPortfolioValue();
  return portfolioData.map((asset) => ({
    name: asset.name,
    value: asset.currentValue,
    percentage: ((asset.currentValue / total) * 100).toFixed(1),
    color: asset.color,
  }));
};
