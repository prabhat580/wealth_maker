import { Wallet, ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserDashboard, formatCurrency } from "@/hooks/useUserDashboard";

export function EmptyPortfolioState() {
  const navigate = useNavigate();
  const { goals } = useUserDashboard();
  
  const primaryGoal = goals.find(g => g.is_primary) || goals[0];
  const monthlySIP = primaryGoal?.monthly_sip || 0;

  return (
    <Card className="border-0 shadow-card bg-gradient-to-br from-background via-primary/5 to-accent/5 overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Start Your Investment Journey</h3>
          <p className="text-muted-foreground mb-6">
            Your portfolio is ready to grow. Complete KYC and make your first investment to begin tracking your wealth.
          </p>

          {primaryGoal && monthlySIP > 0 && (
            <div className="bg-card rounded-lg p-4 mb-6 text-left border">
              <p className="text-sm text-muted-foreground mb-2">Recommended Monthly Investment</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(monthlySIP)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                To achieve your {primaryGoal.goal_name} goal
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/kyc')}
              className="gap-2"
            >
              Complete KYC
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t">
            <div className="text-center">
              <Shield className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">SEBI Registered</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Expert Managed</p>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">24/7 Access</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
