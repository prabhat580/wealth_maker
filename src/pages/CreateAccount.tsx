import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { PersonalizedFormMessage } from '@/components/onboarding/PersonalizedFormMessage';
import { LiveActivityIndicator } from '@/components/onboarding/LiveActivityIndicator';
import { 
  ArrowRight, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  TrendingUp, 
  Heart, 
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  Clock
} from 'lucide-react';
import { z } from 'zod';
import { customerProfiles, CustomerProfileType, OnboardingAnswer } from '@/data/customerProfiles';

// Validation schema
const accountSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface OnboardingData {
  profileType: CustomerProfileType;
  confidence: number;
  scores: Record<CustomerProfileType, number>;
  answers: OnboardingAnswer[];
  goalData: {
    goalType: string;
    goalName: string;
    targetAmount: number;
    timelineYears: number;
    monthlySIP: number;
    recommendedPortfolio: any;
  };
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const { trackFormStart, trackFormComplete, trackCTAClick } = useFunnelAnalytics();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Get onboarding data from navigation state
  const onboardingData = location.state as OnboardingData | null;
  const profile = onboardingData?.profileType ? customerProfiles[onboardingData.profileType] : null;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Redirect if no onboarding data
  useEffect(() => {
    if (!onboardingData) {
      navigate('/onboarding');
    }
  }, [onboardingData, navigate]);

  const handleInputChange = (field: string, value: string) => {
    // Track form start on first input
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart();
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      accountSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const saveOnboardingData = async (userId: string) => {
    if (!onboardingData) return;

    try {
      // Save investor profile
      await supabase.from('investor_profiles').insert({
        user_id: userId,
        profile_type: onboardingData.profileType,
        japanese_name: profile?.japaneseName || null,
        tagline: profile?.tagline || null,
        confidence: onboardingData.confidence,
        scores: onboardingData.scores,
      });

      // Save primary goal
      if (onboardingData.goalData) {
        await supabase.from('user_goals').insert({
          user_id: userId,
          goal_type: onboardingData.goalData.goalType,
          goal_name: onboardingData.goalData.goalName,
          target_amount: onboardingData.goalData.targetAmount,
          timeline_years: onboardingData.goalData.timelineYears,
          monthly_sip: onboardingData.goalData.monthlySIP,
          recommended_portfolio: onboardingData.goalData.recommendedPortfolio,
          is_primary: true,
        });
      }

      // Save onboarding answers
      const answerInserts = onboardingData.answers.map(answer => ({
        user_id: userId,
        question_id: answer.questionId,
        answer_value: { value: answer.value },
      }));

      if (answerInserts.length > 0) {
        await supabase.from('onboarding_answers').insert(answerInserts);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered. Please sign in instead.' });
        } else {
          toast({
            title: 'Error creating account',
            description: error.message,
            variant: 'destructive',
          });
        }
        setIsLoading(false);
        return;
      }

      // Wait a moment for auth state to update
      setTimeout(async () => {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await saveOnboardingData(newUser.id);
          // Track successful form completion
          trackFormComplete(onboardingData.profileType);
        }
        
        toast({
          title: 'Account created successfully!',
          description: 'Welcome to AMEYA. Your wealth journey begins now.',
        });
        
        navigate('/dashboard');
      }, 1000);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (!onboardingData || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-zen/5 -z-20" />
      <div className="fixed inset-0 -z-20 texture-washi" />
      
      {/* Floating orbs */}
      <div className="fixed top-20 right-10 w-80 h-80 bg-primary/8 rounded-full blur-3xl -z-10 animate-breathe" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-zen/10 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 bg-card/90 backdrop-blur-xl">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-base font-jp">無</span>
            </div>
            <div>
              <span className="font-semibold text-foreground tracking-tight">AMEYA</span>
              <p className="text-[10px] text-muted-foreground leading-none">by Bajaj Capital</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          
          {/* Personalized message based on profile */}
          <PersonalizedFormMessage 
            profileType={onboardingData.profileType}
            goalName={onboardingData.goalData?.goalName}
            monthlySIP={onboardingData.goalData?.monthlySIP}
          />

          {/* Live activity */}
          <LiveActivityIndicator variant="full" />

          {/* Main card */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-zen" />
                <span className="text-xs text-muted-foreground">Takes less than 2 minutes</span>
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Create Your Account
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Join 2.5L+ investors on their wealth journey
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-20"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg btn-calm gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>Creating Account...</>
                  ) : (
                    <>
                      Begin My Wealth Journey
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-zen" />
                  Bank-grade security
                </span>
                <span>•</span>
                <span>256-bit encryption</span>
              </div>

              {/* Login link */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Three pillars reminder */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-xs">Wealth</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Heart className="w-5 h-5 text-zen" />
              <span className="text-xs">Health</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-purpose" />
              <span className="text-xs">Purpose</span>
            </div>
          </div>

          {/* Omotenashi tagline */}
          <p className="text-center text-xs text-muted-foreground font-jp">
            いつも心 — We walk with you
          </p>
        </div>
      </main>
    </div>
  );
}