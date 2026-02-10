import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  answeredCount?: number;
}

export const OnboardingProgress = forwardRef<HTMLDivElement, OnboardingProgressProps>(
  function OnboardingProgress({ currentStep, totalSteps, answeredCount = 0 }, ref) {
  const progress = ((currentStep) / totalSteps) * 100;
  const isNearComplete = progress >= 70;

  return (
    <div ref={ref} className="w-full space-y-3">
      {/* Progress Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-md transition-all",
            isNearComplete 
              ? "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground" 
              : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
          )}>
            {currentStep}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isNearComplete ? "Almost done!" : `Question ${currentStep} of ${totalSteps}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isNearComplete 
                ? "Your personalized portfolio is being crafted" 
                : "Building your investor profile"}
            </p>
          </div>
        </div>
        
        {/* Percentage with motivational color */}
        <div className="text-right">
          <p className={cn(
            "text-2xl font-bold transition-colors",
            isNearComplete ? "text-secondary" : "text-primary"
          )}>
            {Math.round(progress)}%
          </p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className={cn(
              "h-full transition-all duration-700 ease-out rounded-full relative",
              isNearComplete 
                ? "bg-gradient-to-r from-secondary via-secondary/90 to-primary"
                : "bg-gradient-to-r from-primary via-primary/90 to-secondary"
            )}
            style={{ width: `${progress}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            
            {/* Progress tip glow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/50 blur-sm" />
          </div>
        </div>
        
        {/* Progress glow effect */}
        <div 
          className={cn(
            "absolute top-0 h-3 blur-sm rounded-full transition-all duration-700",
            isNearComplete ? "bg-secondary/30" : "bg-primary/20"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators with completion states */}
      <div className="flex justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div 
              key={i}
              className="flex flex-col items-center transition-all duration-300"
            >
              <div 
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-500 flex items-center justify-center",
                  isCompleted 
                    ? "bg-primary scale-100 shadow-md shadow-primary/30" 
                    : isCurrent 
                      ? "bg-secondary scale-150 shadow-lg shadow-secondary/40 ring-4 ring-secondary/20" 
                      : "bg-muted scale-75"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Motivational message based on progress */}
      {progress >= 50 && progress < 100 && (
        <div className="flex items-center justify-center gap-2 pt-1 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-secondary" />
          <span className="text-xs text-muted-foreground">
            {progress >= 80 
              ? "One more question to unlock your personalized portfolio!" 
              : progress >= 60 
                ? "Great momentum! You're in the home stretch" 
                : "Halfway there! Your insights are shaping your portfolio"}
          </span>
        </div>
      )}
    </div>
  );
});
