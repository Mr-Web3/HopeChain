'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
}: FormNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className='flex justify-between items-center pt-8'
    >
      <Button
        type='button'
        variant='outline'
        onClick={onPrevious}
        disabled={isFirstStep}
        className={cn(
          'flex items-center gap-2 px-6 py-3 transition-all duration-200',
          isFirstStep
            ? 'opacity-50 cursor-not-allowed'
            : 'border-white/20 text-foreground hover:bg-white/5 hover:border-white/40'
        )}
      >
        <ArrowLeft className='w-4 h-4' />
        Previous
      </Button>

      <div className='flex items-center gap-4'>
        <div className='text-sm text-muted-foreground'>
          Step {currentStep} of {totalSteps}
        </div>

        {isLastStep ? (
          <Button
            type='button'
            onClick={onSubmit}
            className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
          >
            <Check className='w-4 h-4 mr-2' />
            Submit Application
          </Button>
        ) : (
          <Button
            type='button'
            onClick={onNext}
            className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
          >
            Next
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
