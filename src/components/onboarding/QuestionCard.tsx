import { useState, forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OnboardingQuestion } from '@/data/onboardingQuestions';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { ServiceModelLearnMore } from './ServiceModelLearnMore';

interface QuestionCardProps {
  question: OnboardingQuestion;
  selectedValue: string | string[] | null;
  onSelect: (value: string | string[]) => void;
  isAnimatingOut?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

// Contextual hints to reinforce value
const questionHints: Record<string, string> = {
  age: "This helps us optimize your investment timeline",
  income: "We will suggest investments that fit your budget",
  primaryGoal: "Your goal shapes your entire portfolio strategy",
  goalAmount: "We will calculate exactly how much to invest monthly",
  riskTolerance: "This determines your ideal asset allocation",
  experience: "We will tailor the complexity to your comfort level",
  timeHorizon: "Longer horizons often mean better returns",
  monthlyInvestment: "Even small amounts can grow significantly",
  existingInvestments: "We will build on what you already have",
  serviceModel: "Choose how you'd like to receive financial guidance",
};

export const QuestionCard = forwardRef<HTMLDivElement, QuestionCardProps>(
  function QuestionCard({ 
    question, 
    selectedValue, 
    onSelect, 
    isAnimatingOut,
    questionNumber = 1,
    totalQuestions = 10
  }, ref) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const isMultiSelect = question.type === 'multi-select';
  
  // Convert selectedValue to array for multi-select handling
  const selectedArray: string[] = isMultiSelect 
    ? (Array.isArray(selectedValue) ? selectedValue : [])
    : [];

  const isSelected = (value: string) => {
    if (isMultiSelect) {
      return selectedArray.includes(value);
    }
    return selectedValue === value;
  };

  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      let newSelection: string[];
      if (value === 'none') {
        newSelection = selectedArray.includes('none') ? [] : ['none'];
      } else {
        const withoutNone = selectedArray.filter(v => v !== 'none');
        if (withoutNone.includes(value)) {
          newSelection = withoutNone.filter(v => v !== value);
        } else {
          newSelection = [...withoutNone, value];
        }
      }
      onSelect(newSelection);
    } else {
      onSelect(value);
    }
  };

  const hint = questionHints[question.id] || '';
  const isKeyQuestion = ['primaryGoal', 'riskTolerance', 'goalAmount'].includes(question.id);

  return (
    <div 
      ref={ref}
      className={cn(
        "w-full max-w-2xl mx-auto transition-all duration-500",
        isAnimatingOut ? "opacity-0 translate-x-[-50px]" : "opacity-100 translate-x-0"
      )}
    >
      {/* Question header with decorative element */}
      <div className="text-center mb-6 animate-fade-in relative">
        {/* Key question indicator */}
        {isKeyQuestion && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full text-xs font-medium text-secondary mb-3 border border-secondary/20">
            <Sparkles className="w-3 h-3" />
            Key Question
          </div>
        )}
        
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-1 rounded-full bg-gradient-to-r from-primary to-secondary" />
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 pt-3">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {question.subtitle}
          </p>
        )}
        
        {/* Service Model Learn More button */}
        {question.id === 'serviceModel' && (
          <div className="mt-3">
            <ServiceModelLearnMore />
          </div>
        )}
        
        {/* Contextual hint (not for serviceModel since it has Learn More) */}
        {hint && question.id !== 'serviceModel' && (
          <p className="text-xs text-primary/70 mt-2 flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            {hint}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options?.map((option, index) => {
          const selected = isSelected(option.value);
          const isHovered = hoveredOption === option.value;
          
          return (
            <Card
              key={option.value}
              className={cn(
                "cursor-pointer transition-all duration-300 border-2 group relative overflow-hidden",
                "hover:shadow-xl hover:scale-[1.02]",
                selected 
                  ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/10" 
                  : "border-border/60 hover:border-primary/40 bg-card hover:bg-gradient-to-br hover:from-card hover:to-primary/5",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 60}ms` }}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              {/* Top accent bar when selected */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
                selected 
                  ? "bg-gradient-to-r from-primary to-secondary opacity-100" 
                  : "bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-50"
              )} />

              <CardContent className="p-4 flex items-center gap-3">
                {/* Icon with enhanced styling */}
                <div 
                  className={cn(
                    "text-2xl transition-all duration-300 p-2 rounded-xl flex-shrink-0",
                    selected 
                      ? "bg-primary/10 scale-110" 
                      : "bg-muted group-hover:bg-primary/5 group-hover:scale-105"
                  )}
                >
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                    {option.label}
                  </div>
                  {option.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {option.description}
                    </p>
                  )}
                </div>

                {/* Selection indicator */}
                <div 
                  className={cn(
                    "w-5 h-5 flex items-center justify-center transition-all duration-300 border-2 flex-shrink-0",
                    isMultiSelect ? "rounded-md" : "rounded-full",
                    selected 
                      ? "border-primary bg-primary shadow-md shadow-primary/25" 
                      : "border-muted-foreground/30 group-hover:border-primary/50"
                  )}
                >
                  {selected ? (
                    isMultiSelect 
                      ? <Check className="w-3 h-3 text-primary-foreground animate-scale-in" />
                      : <div className="w-2 h-2 rounded-full bg-primary-foreground animate-scale-in" />
                  ) : (
                    <ChevronRight className={cn(
                      "w-3 h-3 text-muted-foreground/50 transition-all duration-300",
                      isHovered ? "opacity-100 translate-x-0.5" : "opacity-0"
                    )} />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Multi-select helper text */}
      {isMultiSelect && (
        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
          <Check className="w-3 h-3" />
          Select all that apply, then tap Continue
        </p>
      )}
    </div>
  );
});
