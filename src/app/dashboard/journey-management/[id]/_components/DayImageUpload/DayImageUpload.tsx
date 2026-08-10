/* eslint-disable no-unused-vars */
'use client';

import { cn } from '@/lib/utils';
import { ImageIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface DayImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadFn: (formData: FormData) => any;
  label?: string;
}

const DayImageUpload = ({
  value,
  onChange,
  uploadFn,
  label = 'Day Image',
}: DayImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFn(formData).unwrap();
      // আপনার পূর্বের রেসপন্স অনুযায়ী সরাসরি res.data-তে স্ট্রিং URL আসে, তাই res.data ব্যাকআপ রাখা হলো
      const url =
        res?.data?.image_url || res?.data?.url || res?.url || res?.image_url || res?.data || '';
      if (!url) {
        toast.error('Could not get image URL from server');
        return;
      }
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>

      {value ? (
        // ── Preview ──
        <div className="border-primary/10 relative w-full overflow-hidden rounded-md border bg-[#F5F2F0]">
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className={cn(
              'group relative h-48 w-full cursor-pointer',
              uploading && 'pointer-events-none cursor-not-allowed',
            )}
          >
            <Image
              src={value}
              alt="Day preview"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
                  <span className="text-xs font-medium text-white">Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={20} className="text-white" />
                  <span className="text-xs font-semibold tracking-wide text-white uppercase">
                    Change Image
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="bg-error/80 absolute top-2 right-2 z-10 rounded-full p-1 text-white transition-opacity hover:opacity-90"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        // ── Upload Area ──
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'border-primary/10 text-primary flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-[#F5F2F0] transition-colors hover:bg-[#EDE8E5]',
            uploading && 'cursor-not-allowed opacity-60',
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="text-primary animate-spin" />
              <span className="text-secondary text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={22} className="text-secondary" />
              <span className="text-secondary text-xs">Click to upload day image</span>
              <span className="text-secondary text-xs">PNG, JPG, WEBP supported</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default DayImageUpload;
