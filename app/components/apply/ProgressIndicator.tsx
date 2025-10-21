'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='mb-12'
    >
      {/* Progress Steps */}
      <div className='flex items-center justify-center mb-4 overflow-x-auto pb-2'>
        <div className='flex items-center min-w-max px-4'>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <div key={step} className='flex items-center'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: step * 0.1 }}
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300',
                  step <= currentStep
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                    : 'bg-white/10 text-muted-foreground border border-white/20'
                )}
              >
                {step < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                  </motion.div>
                ) : (
                  step
                )}
              </motion.div>
              {step < totalSteps && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: step * 0.1 + 0.2 }}
                  className={cn(
                    'w-8 sm:w-16 h-1 mx-2 sm:mx-3 rounded-full transition-all duration-300',
                    step < currentStep
                      ? 'bg-gradient-to-r from-primary to-purple-600'
                      : 'bg-white/10'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className='text-center'
      >
        <div className='text-sm text-muted-foreground mb-2'>
          Step {currentStep} of {totalSteps}
        </div>
        <div className='text-lg font-semibold text-foreground'>
          {getStepTitle(currentStep)}
        </div>
      </motion.div>
    </motion.div>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Personal Information';
    case 2:
      return 'Medical Information';
    case 3:
      return 'Medical Records & Doctor';
    case 4:
      return 'Personal Statement & Contact';
    default:
      return 'Application';
  }
}
