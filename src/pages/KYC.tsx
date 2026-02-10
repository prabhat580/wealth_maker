import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { KYCModule } from '@/components/kyc/KYCModule';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Clock } from 'lucide-react';

export default function KYC() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { returnTo: '/kyc' } });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-zen/5">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-zen/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-lg font-jp">無</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-foreground tracking-tight">AMEYA</span>
                  <span className="text-xs text-muted-foreground font-jp">本人確認</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-none">Identity Verification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 hover:bg-zen/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Title section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zen/10 rounded-full text-sm text-zen mb-4">
            <Shield className="w-4 h-4" />
            Secure Verification
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Complete Your KYC</h1>
          <p className="text-muted-foreground mt-2">
            One-time verification to unlock all investment features
          </p>
        </div>

        {/* KYC Module */}
        <KYCModule 
          onComplete={() => {
            navigate('/dashboard');
          }} 
        />

        {/* Trust signals */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Bank-grade<br />encryption</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">CKYC<br />compliant</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">2-minute<br />process</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground mt-8 px-4">
          Your documents are processed securely and stored as per PMLA guidelines. 
          By proceeding, you consent to identity verification as required by SEBI/AMFI regulations.
        </p>
      </main>
    </div>
  );
}
