'use client';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  options: { value: string; label: string }[];
  error?: string;
  control: Control<T>;
  required?: boolean;
  placeholder?: string;
  maxHeight?: string;
  readOnly?: boolean;
}

const SelectField = <T extends FieldValues>({
  label,
  name,
  options,
  error,
  control,
  required,
  maxHeight,
  placeholder = 'Select an option',
  readOnly = false,
}: SelectFieldProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Select onValueChange={onChange} value={value || ''} disabled={readOnly}>
        <SelectTrigger
          className={cn(
            'focus-visible:border-primary/60 text-primary h-auto w-full p-3 py-6 shadow-none transition-all focus-visible:ring-0',
            {
              'border-error': error,
              'border-primary/10': !error,
              'cursor-pointer bg-[#F5F2F0]': !readOnly,
              'cursor-default bg-[#F5F2F0] opacity-60': readOnly,
            },
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="text-secondary bg-[#F5F2F0]">
          <div style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="hover:text-primary! cursor-pointer hover:bg-[#E5E0DA]!"
              >
                {opt.label}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default SelectField;
