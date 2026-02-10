import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import CreateAccount from "./pages/CreateAccount";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MutualFunds from "./pages/MutualFunds";
import Stocks from "./pages/Stocks";
import FixedDeposits from "./pages/FixedDeposits";
import Insurance from "./pages/Insurance";
import Bonds from "./pages/Bonds";
import UnlistedEquity from "./pages/UnlistedEquity";
import NcdMld from "./pages/NcdMld";
import DataRequirements from "./pages/DataRequirements";
import AdminAnalytics from "./pages/AdminAnalytics";
import KYC from "./pages/KYC";
import StrategyDocument from "./pages/StrategyDocument";
import NotFound from "./pages/NotFound";
import AIAdvisorChat from "./components/ai-advisor/AIAdvisorChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mutual-funds" element={<MutualFunds />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/fixed-deposits" element={<FixedDeposits />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/bonds" element={<Bonds />} />
            <Route path="/unlisted-equity" element={<UnlistedEquity />} />
            <Route path="/ncd-mld" element={<NcdMld />} />
            <Route path="/data-requirements" element={<DataRequirements />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/strategy-document" element={<StrategyDocument />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAdvisorChat />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
