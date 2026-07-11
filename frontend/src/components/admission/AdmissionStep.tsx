import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from '../shared/navigation/LucideIcon';

interface Step {
  title: string;
  description: string;
}

interface AdmissionStepProps {
  steps: Step[];
  currentStep: number;
}

export function AdmissionStep({ steps, currentStep }: AdmissionStepProps) {
  return (
    <div className="w-full pb-8">
      {}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={step.title}
              className={cn(
                'flex flex-row sm:flex-col items-center flex-1 w-full text-left sm:text-center relative group',
                index < steps.length - 1 && 'sm:after:content-[""] sm:after:absolute sm:after:top-5 sm:after:left-[55%] sm:after:right-[-45%] sm:after:h-[2px] sm:after:bg-border sm:after:z-0',
                index < steps.length - 1 && isCompleted && 'sm:after:bg-primary'
              )}
            >
              {}
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm border z-10 transition-all duration-300 mr-4 sm:mr-0 sm:mb-2',
                  {
                    'bg-primary border-primary text-primary-foreground': isActive,
                    'bg-emerald-500 border-emerald-500 text-white': isCompleted,
                    'bg-card border-border text-muted-foreground': !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <LucideIcon name="Check" size={16} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {}
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-sm font-bold transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground hidden md:inline">{step.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AdmissionStep;
