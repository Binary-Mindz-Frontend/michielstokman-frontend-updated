/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React from 'react';

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: any;
  register: any;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  placeholder,
  error,
  register,
  required = false,
  readOnly = false,
  rows,
}) => {
  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Textarea
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        {...register(name)}
        className={cn(
          'min-h-24 w-full resize-none rounded-md p-3 shadow-none transition-all',
          'border placeholder:text-[#978279]',
          'focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-offset-0',
          'text-primary',
          {
            'cursor-default bg-[#161b2a] opacity-60': readOnly,
            'bg-[#F5F2F0]': !readOnly,
            'border-error focus-visible:border-error': error,
            'border-primary/10': !error,
          },
        )}
      />

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default TextAreaField;
