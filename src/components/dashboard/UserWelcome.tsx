import { User, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDashboard, getProfileInfo } from "@/hooks/useUserDashboard";
import { cn } from "@/lib/utils";

export function UserWelcome() {
  const { profile, investorProfile, isLoading } = useUserDashboard();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-card bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Investor';
  const profileInfo = investorProfile ? getProfileInfo(investorProfile.profile_type) : null;

  return (
    <Card className="border-0 shadow-card bg-gradient-to-r from-primary/5 via-background to-accent/5 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
              <User className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome back, {firstName}!
              </h2>
              {investorProfile && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn("gap-1", profileInfo?.color)}>
                    <Sparkles className="h-3 w-3" />
                    {profileInfo?.name}
                  </Badge>
                  {investorProfile.japanese_name && (
                    <span className="text-sm text-muted-foreground">
                      {investorProfile.japanese_name}
                    </span>
                  )}
                </div>
              )}
              {investorProfile?.tagline && (
                <p className="text-sm text-muted-foreground italic">
                  "{investorProfile.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
