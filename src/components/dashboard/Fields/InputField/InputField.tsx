/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: any;
  register: any;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  readOnly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isPassword = type === 'password';
  const isDate = type === 'date';
  const inputType = isPassword && showPassword ? 'text' : type;

  const { ref, ...restRegister } = register(name);

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <div className="relative">
        <Input
          type={inputType}
          placeholder={placeholder}
          readOnly={readOnly}
          {...restRegister}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          onClick={() => !readOnly && isDate && inputRef.current?.showPicker()}
          className={cn(
            'h-auto w-full resize-none rounded-md p-3 shadow-none transition-all',
            'border placeholder:text-[#978279]',
            'focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-offset-0',
            'text-primary',
            {
              'cursor-default bg-[#F5F2F0] opacity-60 focus-visible:border-[#F5F2F0]': readOnly,
              'bg-[#F5F2F0]': !readOnly,
              'border-error focus-visible:border-error': error,
              'border-primary/10': !error,
            },
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default InputField;
