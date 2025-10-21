'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from './FileUpload';
// import { cn } from '@/lib/utils';

interface FormStepProps {
  step: number;
  formData: Record<string, string | File | null>;
  onInputChange: (field: string, value: string | File | null) => void;
  isVisible: boolean;
}

export function FormStep({
  step,
  formData,
  onInputChange,
  isVisible,
}: FormStepProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      {step === 1 && (
        <PersonalInfoStep formData={formData} onInputChange={onInputChange} />
      )}
      {step === 2 && (
        <MedicalInfoStep formData={formData} onInputChange={onInputChange} />
      )}
      {step === 3 && (
        <MedicalRecordsStep formData={formData} onInputChange={onInputChange} />
      )}
      {step === 4 && (
        <PersonalStatementStep
          formData={formData}
          onInputChange={onInputChange}
        />
      )}
    </motion.div>
  );
}

function PersonalInfoStep({
  formData,
  onInputChange,
}: {
  formData: Record<string, string | File | null>;
  onInputChange: (field: string, value: string | File | null) => void;
}) {
  return (
    <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center'>
          <span className='text-white font-bold'>1</span>
        </div>
        <h2 className='text-2xl font-semibold text-foreground'>
          Personal Information
        </h2>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='firstName' className='text-foreground font-medium'>
            First Name *
          </Label>
          <Input
            id='firstName'
            type='text'
            required
            value={formData.firstName as string}
            onChange={e => onInputChange('firstName', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='lastName' className='text-foreground font-medium'>
            Last Name *
          </Label>
          <Input
            id='lastName'
            type='text'
            required
            value={formData.lastName as string}
            onChange={e => onInputChange('lastName', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email' className='text-foreground font-medium'>
            Email Address *
          </Label>
          <Input
            id='email'
            type='email'
            required
            value={formData.email as string}
            onChange={e => onInputChange('email', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone' className='text-foreground font-medium'>
            Phone Number *
          </Label>
          <Input
            id='phone'
            type='tel'
            required
            value={formData.phone as string}
            onChange={e => onInputChange('phone', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='age' className='text-foreground font-medium'>
            Age *
          </Label>
          <Input
            id='age'
            type='number'
            required
            value={formData.age as string}
            onChange={e => onInputChange('age', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>
    </Card>
  );
}

function MedicalInfoStep({
  formData,
  onInputChange,
}: {
  formData: Record<string, string | File | null>;
  onInputChange: (field: string, value: string | File | null) => void;
}) {
  return (
    <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
          <span className='text-white font-bold'>2</span>
        </div>
        <h2 className='text-2xl font-semibold text-foreground'>
          Medical Information
        </h2>
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='diagnosis' className='text-foreground font-medium'>
            Cancer Diagnosis *
          </Label>
          <Input
            id='diagnosis'
            type='text'
            required
            value={formData.diagnosis as string}
            onChange={e => onInputChange('diagnosis', e.target.value)}
            placeholder='e.g., Stage 3 Breast Cancer'
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='stage' className='text-foreground font-medium'>
              Cancer Stage *
            </Label>
            <Select
              value={formData.stage as string}
              onValueChange={value => onInputChange('stage', value)}
            >
              <SelectTrigger className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'>
                <SelectValue placeholder='Select stage' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Stage 1'>Stage 1</SelectItem>
                <SelectItem value='Stage 2'>Stage 2</SelectItem>
                <SelectItem value='Stage 3'>Stage 3</SelectItem>
                <SelectItem value='Stage 4'>Stage 4</SelectItem>
                <SelectItem value='Recurrent'>Recurrent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='treatmentType'
              className='text-foreground font-medium'
            >
              Treatment Type *
            </Label>
            <Select
              value={formData.treatmentType as string}
              onValueChange={value => onInputChange('treatmentType', value)}
            >
              <SelectTrigger className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'>
                <SelectValue placeholder='Select treatment' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Chemotherapy'>Chemotherapy</SelectItem>
                <SelectItem value='Radiation'>Radiation Therapy</SelectItem>
                <SelectItem value='Surgery'>Surgery</SelectItem>
                <SelectItem value='Immunotherapy'>Immunotherapy</SelectItem>
                <SelectItem value='Targeted Therapy'>
                  Targeted Therapy
                </SelectItem>
                <SelectItem value='CAR-T Cell'>CAR-T Cell Therapy</SelectItem>
                <SelectItem value='Clinical Trial'>Clinical Trial</SelectItem>
                <SelectItem value='Other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='estimatedCost'
              className='text-foreground font-medium'
            >
              Estimated Treatment Cost (USD) *
            </Label>
            <Input
              id='estimatedCost'
              type='number'
              required
              value={formData.estimatedCost as string}
              onChange={e => onInputChange('estimatedCost', e.target.value)}
              placeholder='e.g., 50000'
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='insuranceCoverage'
              className='text-foreground font-medium'
            >
              Insurance Coverage Amount
            </Label>
            <Input
              id='insuranceCoverage'
              type='number'
              value={formData.insuranceCoverage as string}
              onChange={e => onInputChange('insuranceCoverage', e.target.value)}
              placeholder='e.g., 20000'
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function MedicalRecordsStep({
  formData,
  onInputChange,
}: {
  formData: Record<string, string | File | null>;
  onInputChange: (field: string, value: string | File | null) => void;
}) {
  return (
    <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center'>
          <span className='text-white font-bold'>3</span>
        </div>
        <h2 className='text-2xl font-semibold text-foreground'>
          Medical Records & Doctor Information
        </h2>
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label className='text-foreground font-medium'>
            Upload Medical Records (PDF, JPG, PNG) *
          </Label>
          <FileUpload
            onFileChange={file => onInputChange('medicalRecords', file)}
            acceptedTypes='.pdf,.jpg,.jpeg,.png'
          />
          <p className='text-xs text-muted-foreground'>
            Please include pathology reports, imaging results, and treatment
            plans
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='doctorName' className='text-foreground font-medium'>
              Treating Doctor Name *
            </Label>
            <Input
              id='doctorName'
              type='text'
              required
              value={formData.doctorName as string}
              onChange={e => onInputChange('doctorName', e.target.value)}
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='doctorEmail'
              className='text-foreground font-medium'
            >
              Doctor Email *
            </Label>
            <Input
              id='doctorEmail'
              type='email'
              required
              value={formData.doctorEmail as string}
              onChange={e => onInputChange('doctorEmail', e.target.value)}
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='doctorPhone' className='text-foreground font-medium'>
            Doctor Phone Number *
          </Label>
          <Input
            id='doctorPhone'
            type='tel'
            required
            value={formData.doctorPhone as string}
            onChange={e => onInputChange('doctorPhone', e.target.value)}
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>
    </Card>
  );
}

function PersonalStatementStep({
  formData,
  onInputChange,
}: {
  formData: Record<string, string | File | null>;
  onInputChange: (field: string, value: string | File | null) => void;
}) {
  return (
    <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center'>
          <span className='text-white font-bold'>4</span>
        </div>
        <h2 className='text-2xl font-semibold text-foreground'>
          Personal Statement & Emergency Contact
        </h2>
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label
            htmlFor='personalStatement'
            className='text-foreground font-medium'
          >
            Personal Statement *
          </Label>
          <Textarea
            id='personalStatement'
            required
            rows={6}
            value={formData.personalStatement as string}
            onChange={e => onInputChange('personalStatement', e.target.value)}
            placeholder='Please tell us about your situation, why this treatment is important to you, and how it would impact your life...'
            className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none'
          />
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='emergencyContact'
              className='text-foreground font-medium'
            >
              Emergency Contact Name *
            </Label>
            <Input
              id='emergencyContact'
              type='text'
              required
              value={formData.emergencyContact as string}
              onChange={e => onInputChange('emergencyContact', e.target.value)}
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='emergencyPhone'
              className='text-foreground font-medium'
            >
              Emergency Contact Phone *
            </Label>
            <Input
              id='emergencyPhone'
              type='tel'
              required
              value={formData.emergencyPhone as string}
              onChange={e => onInputChange('emergencyPhone', e.target.value)}
              className='bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
