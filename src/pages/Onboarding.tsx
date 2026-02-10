import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseQuestions, serviceModelQuestion, riaQuestions, OnboardingQuestion } from '@/data/onboardingQuestions';
import { calculateProfile, OnboardingAnswer } from '@/data/customerProfiles';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { QuestionCard } from '@/components/onboarding/QuestionCard';
import { ProfileResult } from '@/components/onboarding/ProfileResult';
import { LiveActivityIndicator } from '@/components/onboarding/LiveActivityIndicator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, TrendingUp, Shield, Users, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  
  const { trackStepView, trackStepComplete, trackProfileView } = useFunnelAnalytics();

  // Get the selected service model from answers
  const selectedServiceModel = useMemo(() => {
    const serviceModelAnswer = answers.find(a => a.questionId === 'serviceModel');
    return serviceModelAnswer?.value as 'advisory' | 'distribution' | null;
  }, [answers]);

  // Build the question list dynamically based on service model selection
  const onboardingQuestions: OnboardingQuestion[] = useMemo(() => {
    // Always start with base questions + service model question
    const baseQuestionsWithServiceModel = [...baseQuestions, serviceModelQuestion];
    
    // If user selected advisory, append RIA questions
    if (selectedServiceModel === 'advisory') {
      return [...baseQuestionsWithServiceModel, ...riaQuestions];
    }
    
    return baseQuestionsWithServiceModel;
  }, [selectedServiceModel]);

  const totalSteps = onboardingQuestions.length;
  
  // Clamp currentStep to valid range when question list changes
  useEffect(() => {
    if (currentStep >= totalSteps && totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
    }
  }, [totalSteps, currentStep]);
  
  const safeStep = Math.min(currentStep, totalSteps - 1);
  const currentQuestion = onboardingQuestions[safeStep];
  const isMultiSelect = currentQuestion ? currentQuestion.type === 'multi-select' : false;
  
  const currentAnswer = currentQuestion ? answers.find(a => a.questionId === currentQuestion.id)?.value : undefined;
  const hasAnswer = isMultiSelect 
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  // Dynamic milestone messages based on path
  const getMilestones = (): Record<number, { title: string; message: string }> => {
    const baseMilestones: Record<number, { title: string; message: string }> = {
      3: { title: "Great progress!", message: "You're helping us understand your goals better" },
      6: { title: "Almost there!", message: "Just a few more questions to personalize your portfolio" },
    };
    
    // Add RIA-specific milestone if on advisory path
    if (selectedServiceModel === 'advisory') {
      const riaStartIndex = baseQuestions.length + 1; // After service model question
      baseMilestones[riaStartIndex + 3] = { 
        title: "Comprehensive Assessment", 
        message: "These detailed questions help us provide personalized fiduciary advice" 
      };
      baseMilestones[riaStartIndex + 7] = { 
        title: "Final Stretch!", 
        message: "Just a few more questions for your complete financial plan" 
      };
    }
    
    return baseMilestones;
  };

  const milestones = getMilestones();

  const handleSelect = (value: string | string[]) => {
    if (!currentQuestion) return;
    
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, value });
    setAnswers(newAnswers);

    // Auto-advance only for single-select after selection
    if (!isMultiSelect) {
      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          goToNext();
        }
      }, 400);
    }
  };

  const goToNext = () => {
    if (!currentQuestion) {
      setShowResult(true);
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      // Check for milestone
      const nextStep = currentStep + 1;
      if (milestones[nextStep]) {
        setShowMilestone(true);
        setTimeout(() => setShowMilestone(false), 2000);
      }
      
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else if (currentStep === totalSteps - 1 && hasAnswer) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowResult(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const navigate = useNavigate();

  const goToPrevious = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Navigate back to welcome page on first question
      navigate('/');
    }
  };

  const profileResult = calculateProfile(answers);

  // Track step views
  useEffect(() => {
    if (!showResult && currentQuestion) {
      trackStepView(currentStep + 1, currentQuestion.id);
    }
  }, [currentStep, showResult, currentQuestion, trackStepView]);

  // Track profile view
  useEffect(() => {
    if (showResult && profileResult) {
      trackProfileView(profileResult.profile, profileResult.confidence);
    }
  }, [showResult, profileResult, trackProfileView]);

  // Estimated time remaining - RIA path takes longer
  const questionsLeft = totalSteps - currentStep;
  const timePerQuestion = selectedServiceModel === 'advisory' ? 0.4 : 0.3;
  const estimatedMinutes = Math.ceil(questionsLeft * timePerQuestion);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background with calm gradient and subtle texture */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-zen/5 -z-10" />
      <div className="fixed inset-0 -z-10 texture-washi" />
      
      {/* Zen-inspired floating elements - breathing animation */}
      <div className="fixed top-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-breathe" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-zen/5 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-purpose/5 rounded-full blur-3xl -z-10 animate-breathe" style={{ animationDelay: '1s' }} />

      {/* Header - AMEYA branding */}
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
                  <span className="text-xs text-muted-foreground font-jp">百年の人生へ</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-none">by Bajaj Capital • Creating Crorepatis Since 1964</p>
              </div>
            </div>
            
            {!showResult && (
              <div className="hidden sm:flex items-center gap-4">
                {/* Live activity indicator */}
                <LiveActivityIndicator variant="compact" />
                <div className="w-px h-4 bg-border" />
                {/* Trust Signal - calmer presentation */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-zen" />
                  <span>2.5L+ investors</span>
                </div>
                <div className="w-px h-4 bg-border" />
                {/* Time Estimate */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>~{estimatedMinutes} min remaining</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Milestone Celebration Overlay - calmer, zen-like */}
      {showMilestone && milestones[currentStep] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-zen/30 rounded-xl p-8 text-center shadow-zen animate-scale-in max-w-sm mx-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zen/20 to-purpose/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-zen" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{milestones[currentStep].title}</h3>
            <p className="text-muted-foreground text-sm mt-2">{milestones[currentStep].message}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        {!showResult ? (
          <>
            {/* Value Proposition Banner - calmer, Omotenashi tone */}
            {currentStep < 2 && (
              <div className="max-w-2xl mx-auto w-full mb-4 animate-fade-in">
                <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-zen/10 via-zen/5 to-zen/10 rounded-lg border border-zen/20 text-sm">
                  <Sparkles className="w-4 h-4 text-zen" />
                  <span className="text-foreground">
                    Your journey to <strong>wealth, health, and purpose</strong> begins here
                  </span>
                </div>
              </div>
            )}
            
            {/* RIA Path Indicator - shows after user selects advisory */}
            {selectedServiceModel === 'advisory' && currentStep > baseQuestions.length && (
              <div className="max-w-2xl mx-auto w-full mb-4 animate-fade-in">
                <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    <strong>RIA Assessment</strong> — Comprehensive suitability analysis for fiduciary advice
                  </span>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="max-w-2xl mx-auto w-full mb-6">
              <OnboardingProgress 
                currentStep={currentStep + 1} 
                totalSteps={totalSteps} 
                answeredCount={answers.length}
              />
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center py-2">
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  selectedValue={currentAnswer as string | string[] | null}
                  onSelect={handleSelect}
                  isAnimatingOut={isAnimating}
                  questionNumber={currentStep + 1}
                  totalQuestions={totalSteps}
                />
              )}
            </div>

            {/* Navigation - calmer, unhurried */}
            <div className="max-w-2xl mx-auto w-full pt-4 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={goToPrevious}
                className="gap-2 hover:bg-zen/10 btn-calm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                {/* Commitment indicator - softer presentation */}
                {answers.length > 2 && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zen/10 rounded-full border border-zen/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zen" />
                    <span className="text-xs text-zen font-medium">
                      {answers.length} saved
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={goToNext}
                disabled={!hasAnswer}
                className={cn(
                  "gap-2 transition-all duration-300 shadow-md btn-calm",
                  currentStep === totalSteps - 1 && hasAnswer 
                    ? "bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg px-6" 
                    : "hover:shadow-lg"
                )}
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Discover My Path
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Bottom Trust Bar - Omotenashi messaging */}
            <div className="max-w-2xl mx-auto w-full mt-6 pt-4 border-t border-border/40">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-zen" />
                  Your data is protected
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  We walk with you
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  Calm, precise guidance
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result Header - AMEYA styling */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-zen/15 to-purpose/15 rounded-full text-foreground text-sm font-medium mb-4 border border-zen/25">
                <Sparkles className="w-4 h-4 text-zen" />
                Your Path Revealed
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                Your Life Compass
              </h1>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Based on your responses, here's your personalized guide for wealth, health, and purpose — crafted with care by our advisors
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-jp">いつも心 — always from the heart</p>
            </div>

            {/* Profile Result */}
            <ProfileResult 
              profileType={profileResult.profile}
              confidence={profileResult.confidence}
              scores={profileResult.scores}
              answers={answers}
            />

            {/* Back Button - calmer styling */}
            <div className="max-w-3xl mx-auto w-full pt-6">
              <Button
                variant="ghost"
                onClick={goToPrevious}
                className="gap-2 hover:bg-zen/10 btn-calm"
              >
                <ArrowLeft className="w-4 h-4" />
                Review Answers
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
