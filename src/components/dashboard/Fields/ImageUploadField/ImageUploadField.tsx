/* eslint-disable no-unused-vars */
'use client';
import { Label } from '@/components/ui/label';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface ImageUploadFieldProps {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  subLabel = 'PNG, JPG up to 10MB',
  icon,
  value,
  onChange,
  error,
  required = false,
}) => {
  const previewUrl = useMemo(() => {
    if (!value) return null;

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return value;
  }, [value]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value instanceof File && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-[#B4B4B8]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <div className="relative">
        {!previewUrl ? (
          <div
            className={`hover:border-primary/30 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-[#1A1A20] p-10 transition-all duration-500 ${
              error ? 'border-error' : 'border-[#FCC5651A]'
            }`}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div className="bg-primary/10 rounded-full p-3 shadow-sm">
              {icon || <ImageIcon className="text-primary h-5 w-5" />}
            </div>

            <p className="mt-4 text-sm font-medium text-[#B4B4B8]">
              Click to upload or drag and drop
            </p>
            <p className="text-secondary mt-1 text-xs">{subLabel}</p>

            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange(file);
                e.target.value = '';
              }}
              accept="image/*"
            />
          </div>
        ) : (
          <div className="group relative h-52 w-full overflow-hidden rounded-xl border border-[#FCC5651A] bg-[#1A1A20]">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />

            <button
              type="button"
              onClick={handleRemove}
              className="bg-error absolute top-3 right-3 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white shadow-xl transition-all hover:bg-red-600 active:scale-90"
              title="Remove image"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="bg-primary/20 absolute right-0 bottom-0 left-0 p-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {value instanceof File ? value.name : 'Current Image'}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-error text-xs font-medium italic">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
