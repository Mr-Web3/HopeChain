'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, MapPin, Calendar, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientCase {
  id: number;
  name: string;
  age: number;
  condition: string;
  location: string;
  treatment: string;
  amountNeeded: number;
  amountRaised: number;
  status: 'Fully Funded' | 'In Progress';
  dateFunded: string | null;
  description: string;
  image: string;
}

interface PatientCardProps {
  case_: PatientCase;
  index: number;
}

export function PatientCard({ case_, index }: PatientCardProps) {
  const progressPercentage = Math.min(
    (case_.amountRaised / case_.amountNeeded) * 100,
    100
  );
  const isFullyFunded = case_.status === 'Fully Funded';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Fully Funded':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fully Funded':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className='group'
    >
      <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10'>
        {/* Image Placeholder */}
        <div className='aspect-video bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center relative overflow-hidden'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center'
          >
            <Heart className='w-8 h-8 text-white' />
          </motion.div>

          {/* Status Badge */}
          <div className='absolute top-4 right-4'>
            <Badge
              variant={getStatusVariant(case_.status)}
              className={cn('border font-medium', getStatusColor(case_.status))}
            >
              {case_.status}
            </Badge>
          </div>
        </div>

        <div className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-xl font-semibold text-foreground mb-1'>
                {case_.name}, {case_.age}
              </h3>
              <p className='text-muted-foreground text-sm'>{case_.condition}</p>
            </div>
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
            <MapPin className='w-4 h-4' />
            <span>{case_.location}</span>
          </div>

          {/* Progress */}
          <div className='mb-6'>
            <div className='flex justify-between text-sm mb-3'>
              <span className='text-muted-foreground'>Funding Progress</span>
              <span className='text-foreground font-semibold'>
                ${case_.amountRaised.toLocaleString()} / $
                {case_.amountNeeded.toLocaleString()}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className='h-3 bg-white/10 mb-2'
            />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>{progressPercentage.toFixed(1)}% Complete</span>
              {isFullyFunded && case_.dateFunded && (
                <span className='flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  Funded {new Date(case_.dateFunded).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className='text-muted-foreground text-sm mb-4 leading-relaxed'>
            {case_.description}
          </p>

          {/* Treatment */}
          <div className='flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10'>
            <Stethoscope className='w-4 h-4 text-primary' />
            <div>
              <div className='text-xs text-muted-foreground'>Treatment</div>
              <div className='text-sm font-medium text-foreground'>
                {case_.treatment}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
