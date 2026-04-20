/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';
import { Control, Controller } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  name: string;
  options: Option[];
  control: Control<any>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onSearchChange?: (value: string) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  name,
  options,
  control,
  error,
  required = false,
  placeholder = 'Select members...',
  disabled = false,
  onSearchChange,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-secondary text-sm font-semibold">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues = Array.isArray(field.value)
            ? field.value
            : field.value
              ? [field.value]
              : [];

          const handleRemove = (valToRemove: string, e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newValues = selectedValues.filter((v: string) => v !== valToRemove);
            field.onChange(newValues);
          };

          const handleSelect = (value: string) => {
            const isSelected = selectedValues.includes(value);
            const newValues = isSelected
              ? selectedValues.filter((v: string) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          };

          return (
            <Popover open={disabled ? false : open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'flex min-h-12! w-full cursor-pointer items-center justify-between rounded-md border bg-[#F3F3F5] px-3 py-2 text-sm transition-all',
                    error ? 'border-error' : 'border-mute/10',
                    disabled && 'cursor-not-allowed bg-[#F3F3F5] opacity-100',
                  )}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((val: string) => {
                        const option = options.find((o) => o.value === val);
                        return (
                          <span
                            key={val}
                            className="flex items-center gap-1 rounded-full border border-[#D0D5DD] bg-[#F2F4F7] px-2.5 py-0.5 text-sm font-medium text-[#344054]"
                          >
                            {option ? option.label : 'Unknown'}
                            {!disabled && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => handleRemove(val, e)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleRemove(val, e as any);
                                  }
                                }}
                                className="ml-1 rounded-full p-0.5 outline-none hover:bg-gray-200 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </span>
                            )}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              {!disabled && (
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command shouldFilter={!onSearchChange}>
                    <CommandInput
                      placeholder={`Search ${label}...`}
                      className="h-9"
                      onValueChange={(value) => {
                        if (onSearchChange) onSearchChange(value);
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => handleSelect(option.value)}
                            className="cursor-pointer"
                          >
                            {option.label}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          );
        }}
      />
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
