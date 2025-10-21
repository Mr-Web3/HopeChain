'use client';

import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  onFileChange,
  acceptedTypes,
  maxSize = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
        isDragOver
          ? 'border-primary bg-primary/5'
          : file
            ? 'border-green-500 bg-green-500/5'
            : 'border-white/20 hover:border-white/40'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {file ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='space-y-4'
        >
          <div className='flex items-center justify-center gap-3'>
            <File className='w-8 h-8 text-green-500' />
            <div className='text-left'>
              <div className='font-medium text-foreground'>{file.name}</div>
              <div className='text-sm text-muted-foreground'>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={removeFile}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className='space-y-4'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto'
          >
            <Upload className='w-8 h-8 text-white' />
          </motion.div>

          <div>
            <div className='text-lg font-medium text-foreground mb-2'>
              Drop your files here or click to browse
            </div>
            <div className='text-sm text-muted-foreground mb-4'>
              Accepted formats: {acceptedTypes} (max {maxSize}MB)
            </div>

            <Button
              type='button'
              variant='outline'
              className='border-white/20 text-foreground hover:bg-white/5'
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = acceptedTypes;
                input.onchange = e => {
                  const selectedFile = (e.target as HTMLInputElement)
                    .files?.[0];
                  if (selectedFile) {
                    handleFileSelect(selectedFile);
                  }
                };
                input.click();
              }}
            >
              Choose Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
