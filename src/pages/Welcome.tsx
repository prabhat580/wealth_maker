import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Heart, Sparkles, Shield, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-zen/5 -z-20" />
      <div className="fixed inset-0 -z-20 texture-washi" />
      
      {/* Zen-inspired floating orbs */}
      <div className="fixed top-10 right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl -z-10 animate-breathe" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-zen/10 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/3 left-1/3 w-72 h-72 bg-purpose/8 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-secondary/8 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '3s' }} />

      {/* Header bar */}
      <header className="relative z-10">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-zen" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-base font-jp">無</span>
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-tight">Bajaj Capital</span>
                <p className="text-[10px] text-muted-foreground leading-none">Creating Crorepatis Since 1964</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zen" />
                SEBI Registered
              </span>
              <div className="w-px h-4 bg-border" />
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                2.5L+ Investors
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          
          {/* AMEYA Logo/Badge */}
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-zen/15 flex items-center justify-center border border-primary/20 shadow-xl animate-breathe">
              <span className="text-4xl font-bold font-jp text-primary">無</span>
            </div>
            <span className="text-xs text-muted-foreground font-jp tracking-wider">AMEYA • 無限</span>
          </div>

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Boundless Wealth for the{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                100-Year Life
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your full-life operating system integrating{' '}
              <span className="text-primary font-medium">Wealth</span>,{' '}
              <span className="text-zen font-medium">Health</span>, and{' '}
              <span className="text-purpose font-medium">Purpose</span>
            </p>
            <p className="text-sm text-muted-foreground font-jp">百年の人生へ — For the 100-Year Life</p>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Wealth</span>
              <span className="text-xs text-muted-foreground font-jp">資産</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zen/5 border border-zen/10">
              <div className="w-10 h-10 rounded-full bg-zen/15 flex items-center justify-center">
                <Heart className="w-5 h-5 text-zen" />
              </div>
              <span className="text-sm font-medium text-foreground">Health</span>
              <span className="text-xs text-muted-foreground font-jp">健康</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purpose/5 border border-purpose/10">
              <div className="w-10 h-10 rounded-full bg-purpose/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purpose" />
              </div>
              <span className="text-sm font-medium text-foreground">Purpose</span>
              <span className="text-xs text-muted-foreground font-jp">生きがい</span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4 pt-4">
            <Button 
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="gap-3 h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] btn-calm"
            >
              Discover Your Life Compass
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Takes only 3 minutes</span>
              <span className="mx-2">•</span>
              <span>Personalized guidance</span>
              <span className="mx-2">•</span>
              <span>Free forever</span>
            </div>
          </div>

          {/* Omotenashi tagline */}
          <div className="pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground italic">
              "We walk with you through every season of life — your wealth, your health, your purpose"
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-jp">
              いつも心 — Always from the heart
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2024 Bajaj Capital Ltd.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">SEBI RIA: INA000003429</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-zen" />
                Bank-grade Security
              </span>
              <span>•</span>
              <span>₹15,000 Cr+ Assets Managed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}