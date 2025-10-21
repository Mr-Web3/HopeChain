'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence } from 'framer-motion';

// Import our new components
import { ApplicationHeader } from '../components/apply/ApplicationHeader';
import { ProgressIndicator } from '../components/apply/ProgressIndicator';
import { FormStep } from '../components/apply/FormStep';
import { FormNavigation } from '../components/apply/FormNavigation';
import { PrivacyNotice } from '../components/apply/PrivacyNotice';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    diagnosis: '',
    stage: '',
    treatmentType: '',
    estimatedCost: '',
    insuranceCoverage: '',
    medicalRecords: null as File | null,
    doctorName: '',
    doctorEmail: '',
    doctorPhone: '',
    personalStatement: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-4xl mx-auto px-6 sm:px-8 py-16 pb-32 md:pb-16'>
        <div className='space-y-12'>
          {/* Application Header */}
          <ApplicationHeader />

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-8'>
            <AnimatePresence mode='wait'>
              <FormStep
                key={currentStep}
                step={currentStep}
                formData={formData}
                onInputChange={handleInputChange}
                isVisible={true}
              />
            </AnimatePresence>

            {/* Form Navigation */}
            <FormNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === totalSteps}
            />
          </form>

          {/* Privacy Notice */}
          <PrivacyNotice />
        </div>
      </main>
    </div>
  );
}
