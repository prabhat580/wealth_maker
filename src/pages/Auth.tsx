import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowRight, 
  Shield, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Heart, 
  Sparkles,
  Mail,
  Lock
} from 'lucide-react';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Invalid email or password' });
        } else {
          toast({
            title: 'Error signing in',
            description: error.message,
            variant: 'destructive',
          });
        }
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Welcome back!',
        description: 'Redirecting to your dashboard...',
      });
      
      navigate('/dashboard');

    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

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
          
          {/* Main card */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Welcome Back
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to continue your wealth journey
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                    <>Signing in...</>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-zen" />
                  Secure login
                </span>
              </div>

              {/* Sign up link */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  New to AMEYA?{' '}
                  <button 
                    onClick={() => navigate('/')}
                    className="text-primary hover:underline font-medium"
                  >
                    Start your journey
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Three pillars */}
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
            いつも心 — Always from the heart
          </p>
        </div>
      </main>
    </div>
  );
}