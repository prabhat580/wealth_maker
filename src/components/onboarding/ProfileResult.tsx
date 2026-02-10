import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerProfile, customerProfiles, CustomerProfileType, OnboardingAnswer } from '@/data/customerProfiles';
import { ArrowRight, Lightbulb, TrendingUp, Target, Users, Clock, Shield, CheckCircle2, AlertCircle, Sparkles, Phone, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ModelPortfolioCard } from './ModelPortfolioCard';
import { CashFlowProjection } from './CashFlowProjection';
import { ProfileInsights, profileActionableTips } from './ProfileInsights';
import { Progress } from '@/components/ui/progress';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { 
  getRecommendedPortfolio, 
  calculateRequiredSIP, 
  financialGoals,
  GoalType 
} from '@/data/goalsAndModels';

// Profile-matched testimonials for social proof (compliance-safe: no specific return claims)
const profileTestimonials: Record<CustomerProfileType, { quote: string; name: string; experience: string; tenure: string }> = {
  'conservative-saver': {
    quote: "I was worried about market volatility, but the conservative approach gave me peace of mind. The team helped me understand my options clearly.",
    name: "Priya M., Mumbai",
    experience: "Stress-free journey",
    tenure: "3 years with us"
  },
  'balanced-investor': {
    quote: "The balanced approach perfectly matches my comfort level. I appreciate how clearly everything was explained to me.",
    name: "Rahul S., Bangalore",
    experience: "Clear guidance",
    tenure: "4 years with us"
  },
  'growth-seeker': {
    quote: "The expert guidance helped me navigate market ups and downs confidently. I feel more informed about my investment choices.",
    name: "Amit K., Delhi",
    experience: "Confident decisions",
    tenure: "5 years with us"
  },
  'tax-optimizer': {
    quote: "The tax-saving options were explained clearly. I now understand how to optimize my investments for tax efficiency.",
    name: "Sneha R., Pune",
    experience: "Tax-smart planning",
    tenure: "2 years with us"
  },
  'wealth-builder': {
    quote: "Systematic investing has become a habit now. The team helped me stay disciplined with my monthly investments.",
    name: "Vikram J., Chennai",
    experience: "Disciplined approach",
    tenure: "6 years with us"
  },
  'income-seeker': {
    quote: "The dividend-focused options were well explained. I appreciate the regular updates and transparency.",
    name: "Suresh P., Hyderabad",
    experience: "Regular updates",
    tenure: "4 years with us"
  }
};

interface ProfileResultProps {
  profileType: CustomerProfileType;
  confidence: number;
  scores: Record<CustomerProfileType, number>;
  answers: OnboardingAnswer[];
}

export function ProfileResult({ profileType, confidence, scores, answers }: ProfileResultProps) {
  const navigate = useNavigate();
  const { trackCTAClick } = useFunnelAnalytics();
  const profile = customerProfiles[profileType];
  const actionableTips = profileActionableTips[profileType];
  const testimonial = profileTestimonials[profileType];
  
  // Extract goal-related answers
  const primaryGoal = answers.find(a => a.questionId === 'primaryGoal')?.value as GoalType || 'wealth-creation';
  const goalAmountAnswer = answers.find(a => a.questionId === 'goalAmount')?.value as string || '25l-50l';
  const timeHorizonAnswer = answers.find(a => a.questionId === 'timeHorizon')?.value as string || '5-10-years';
  
  // Map answers to values
  const goalAmountMap: Record<string, number> = {
    'below-10l': 1000000,
    '10l-25l': 2500000,
    '25l-50l': 5000000,
    '50l-1cr': 10000000,
    '1cr-3cr': 20000000,
    'above-3cr': 50000000
  };
  
  const timelineMap: Record<string, number> = {
    'less-1-year': 1,
    '1-3-years': 2,
    '3-5-years': 4,
    '5-10-years': 7,
    'more-10-years': 15
  };
  
  const targetAmount = goalAmountMap[goalAmountAnswer] || 5000000;
  const timelineYears = timelineMap[timeHorizonAnswer] || 7;
  const goalInfo = financialGoals[primaryGoal] || financialGoals['wealth-creation'];
  
  // Get recommended portfolio
  const recommendedPortfolio = getRecommendedPortfolio(primaryGoal, timelineYears, profileType);
  const avgExpectedReturn = (recommendedPortfolio.expectedReturns.min + recommendedPortfolio.expectedReturns.max) / 2;
  const monthlySIP = calculateRequiredSIP(targetAmount, timelineYears, avgExpectedReturn);
  
  // Calculate loss from delay (Loss Aversion)
  const delayMonths = 6;
  const lossFromDelay = Math.round(monthlySIP * delayMonths * (avgExpectedReturn / 100) * timelineYears * 0.3);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    if (amount >= 1000) return `₹${Math.round(amount / 1000)} K`;
    return `₹${amount}`;
  };

  // Personalized urgency based on goal timeline
  const getUrgencyMessage = () => {
    if (timelineYears <= 3) return "With a short timeline, every month counts. Start today to maximize your returns.";
    if (timelineYears <= 7) return "You have a solid timeline ahead. Starting now gives you the power of compounding.";
    return "Long-term goals benefit most from early starts. Begin today for maximum wealth creation.";
  };

  // Navigate to account creation with all data
  const handleStartInvesting = () => {
    trackCTAClick('start_investing', 'profile_result');
    navigate('/create-account', {
      state: {
        profileType,
        confidence,
        scores,
        answers,
        goalData: {
          goalType: primaryGoal,
          goalName: goalInfo.name,
          targetAmount,
          timelineYears,
          monthlySIP,
          recommendedPortfolio,
        }
      }
    });
  };

  const handleCallExpert = () => {
    trackCTAClick('call_expert', 'profile_result');
    window.open('tel:18003131231', '_self');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Progress Commitment Indicator */}
      <div className="bg-gradient-to-r from-success/10 via-success/5 to-success/10 rounded-xl p-4 border border-success/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-semibold text-foreground">You're almost there!</span>
          </div>
          <Badge className="bg-success/20 text-success border-success/30">90% Complete</Badge>
        </div>
        <Progress value={90} className="h-2 bg-success/20" />
        <p className="text-xs text-muted-foreground mt-2">Just one step left to start your wealth journey</p>
      </div>

      {/* Social Proof Banner */}
      <div className="flex items-center justify-center gap-6 py-3 px-4 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 rounded-xl border border-primary/10 animate-fade-in">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground"><strong>2.5L+</strong> investors trust us</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm text-foreground"><strong>₹15,000 Cr+</strong> assets managed</span>
        </div>
        <div className="w-px h-4 bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">SEBI Registered</span>
        </div>
      </div>

      {/* Main Profile Card - Compact with Focus on Action */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden shadow-2xl relative">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="text-center pb-2 relative pt-6">
          <div className="mx-auto mb-3 relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-scale-in shadow-xl border border-primary/10">
              <span className="text-4xl">
                {profileType === 'conservative-saver' && '🛡️'}
                {profileType === 'balanced-investor' && '⚖️'}
                {profileType === 'growth-seeker' && '🚀'}
                {profileType === 'tax-optimizer' && '📋'}
                {profileType === 'wealth-builder' && '🏗️'}
                {profileType === 'income-seeker' && '💵'}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">Your Life Compass Profile</p>
          <CardTitle className="text-2xl md:text-3xl text-foreground mt-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-semibold">
            {profile.name}
          </CardTitle>
          <p className="text-sm text-zen font-jp font-medium">{profile.japaneseName} • {profile.tagline}</p>
          <p className="text-muted-foreground max-w-md mx-auto text-sm mt-2">
            {profile.lifePhilosophy}
          </p>
          
          {/* Confidence Badge */}
          <div className="flex justify-center mt-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
              <Target className="w-3 h-3" />
              {Math.round(confidence)}% Match Confidence
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative pb-6">
          {/* Actionable Tips - Compact */}
          <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-secondary" />
              <h3 className="font-semibold text-sm text-foreground">Quick Wins for Your Profile</h3>
            </div>
            <div className="space-y-2">
              {actionableTips.slice(0, 2).map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile-Matched Testimonial */}
      <Card className="border border-secondary/30 bg-gradient-to-br from-secondary/5 to-background overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Quote className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{testimonial.name}</span>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="border-success/30 text-success">{testimonial.experience}</Badge>
                  <Badge variant="outline" className="border-muted-foreground/30">{testimonial.tenure}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Projection with Urgency */}
      <ProfileInsights
        profileType={profileType}
        answers={answers}
        targetAmount={targetAmount}
        timelineYears={timelineYears}
        monthlySIP={monthlySIP}
      />

      {/* Loss Aversion Card - Urgency with Personalized Message */}
      <Card className="border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 to-background overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                The Cost of Waiting
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Delaying your investment by just <strong className="text-foreground">6 months</strong> could cost you approximately <strong className="text-destructive">{formatCurrency(lossFromDelay)}</strong> in potential returns due to lost compounding.
              </p>
              <div className="mt-3 p-2 bg-destructive/5 rounded-lg border border-destructive/10">
                <p className="text-xs text-foreground font-medium">{getUrgencyMessage()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Projection */}
      <CashFlowProjection
        goalName={goalInfo.name}
        targetAmount={targetAmount}
        timelineYears={timelineYears}
        monthlySIP={monthlySIP}
        expectedReturn={avgExpectedReturn}
      />

      {/* Investment Strategy */}
      <ModelPortfolioCard
        portfolio={recommendedPortfolio}
        goalName={goalInfo.name}
        targetAmount={targetAmount}
        timelineYears={timelineYears}
        monthlySIP={monthlySIP}
      />

      {/* Primary CTA Section - High Contrast, Urgency */}
      <Card className="border-0 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground overflow-hidden shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Value Anchoring */}
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero account fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Start with ₹500/month</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expert guidance</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-bold">
                Ready to Start Your Wealth Journey?
              </h3>
              <p className="text-primary-foreground/80 mt-1 text-sm">
                Your personalized portfolio is ready. Begin investing in under 5 minutes.
              </p>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Primary CTA Button with Animation */}
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 h-14 px-8 text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] animate-pulse-gentle relative overflow-hidden"
                onClick={handleStartInvesting}
              >
                <div className="absolute inset-0 animate-shimmer-soft" />
                <TrendingUp className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Start Investing Now</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </Button>

              {/* Secondary CTA - Talk to Expert */}
              <Button 
                size="lg" 
                variant="ghost"
                className="gap-2 h-14 px-6 text-base font-semibold bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 hover:border-white/60"
                onClick={handleCallExpert}
              >
                <Phone className="w-5 h-5" />
                Talk to Expert
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex justify-center items-center gap-4 pt-2 text-xs text-primary-foreground/70">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Bank-grade security
              </span>
              <span>•</span>
              <span>No lock-in period</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expert Consultation Card */}
      <Card className="border border-accent/30 bg-gradient-to-br from-accent/5 to-background overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Prefer Human Guidance?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Speak with a certified wealth advisor who understands your <strong className="text-foreground">{profile.name}</strong> profile.
              </p>
            </div>
            <Button 
              variant="outline"
              className="gap-2 border-2 border-accent/30 hover:bg-accent/10 hidden sm:flex"
              onClick={handleCallExpert}
            >
              <Phone className="w-4 h-4" />
              Free Callback
            </Button>
          </div>
          <Button 
            variant="outline"
            className="w-full gap-2 mt-4 border-2 border-accent/30 hover:bg-accent/10 sm:hidden"
            onClick={handleCallExpert}
          >
            <Phone className="w-4 h-4" />
            Request Free Callback
          </Button>
        </CardContent>
      </Card>

      {/* Secondary CTA - Low Friction Alternative */}
      <div className="text-center space-y-3 py-2">
        <p className="text-sm text-muted-foreground">Not ready to invest yet?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            className="gap-2 border-2 hover:bg-primary/5 hover:border-primary/50"
            onClick={() => window.location.reload()}
          >
            Retake Assessment
          </Button>
          <Button 
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            Explore Dashboard First
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Floating Sticky CTA for Mobile - Dual Options */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent sm:hidden z-50">
        <div className="flex gap-2">
          <Button 
            size="lg" 
            className="flex-1 gap-2 h-14 text-sm bg-gradient-to-r from-primary to-primary/90 shadow-2xl animate-pulse-gentle"
            onClick={handleStartInvesting}
          >
            <TrendingUp className="w-5 h-5" />
            Start Now
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="h-14 px-4 border-2 border-primary/30"
            onClick={handleCallExpert}
          >
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Spacer for sticky CTA on mobile */}
      <div className="h-24 sm:hidden" />
    </div>
  );
}
