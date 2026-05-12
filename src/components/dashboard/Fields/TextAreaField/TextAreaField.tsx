/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  error?: any;
  control: Control<T>;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
}

const TextAreaField = <T extends FieldValues>({
  label,
  name,
  placeholder,
  error,
  control,
  required = false,
  readOnly = false,
  rows,
}: TextAreaFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder={placeholder}
            readOnly={readOnly}
            rows={rows}
            className={cn(
              'min-h-24 w-full resize-none rounded-md p-3 shadow-none transition-all',
              'border placeholder:text-[#978279]',
              'focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-offset-0',
              'text-primary',
              {
                'cursor-default bg-[#F5F2F0] opacity-60': readOnly,
                'bg-[#F5F2F0]': !readOnly,
                'border-error focus-visible:border-error': error,
                'border-primary/10': !error,
              },
            )}
          />
        )}
      />

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default TextAreaField;
