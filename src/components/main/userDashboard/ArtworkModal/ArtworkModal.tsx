'use client';

import StoryCoverPicker from '@/app/(main)/create/CreateForm/_components/StoryCoverPicker/StoryCoverPicker';
import {
  useGenerateStoryImageMutation,
  useUploadStoryImageMutation,
} from '@/redux/features/memberStory/memberStory.api';
import { Loader2, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface ArtworkModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
}

export default function ArtworkModal({ isOpen, item, onClose }: ArtworkModalProps) {
  const storyId = item ? String(item.id) : '';
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadStoryImageMutation();
  const [generateImage, { isLoading: isGenerating }] = useGenerateStoryImageMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const isBusy = isUploading || isGenerating;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) {
      setErrorMessage('Choose an image to upload.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await uploadImage({ storyId, file: coverFile }).unwrap();
      setSuccessMessage(result.data?.message || 'Cover image updated.');
      setCoverFile(null);
    } catch (error) {
      console.error('Failed to upload cover:', error);
      setErrorMessage('Upload failed. Use JPEG, PNG, or WebP up to 8 MB.');
    }
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await generateImage(storyId).unwrap();
      setSuccessMessage(result.data?.message || 'Cover image generated.');
    } catch (error) {
      console.error('Failed to generate cover:', error);
      setErrorMessage('Generation failed. Try again or upload your own image.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl duration-150">
        <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-4">
          <div>
            <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">ARTWORK</h3>
            <p className="mt-0.5 font-sans text-xs text-gray-600">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <form onSubmit={handleUpload} className="space-y-4">
            <StoryCoverPicker coverFile={coverFile} onFileChange={setCoverFile} />

            <button
              type="submit"
              disabled={isBusy || !coverFile}
              className="font-playpen w-full rounded-xl bg-[#D22D4C] py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#b5243f] disabled:opacity-60"
            >
              {isUploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
                </span>
              ) : (
                'Upload cover'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EBE4D5]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FAF7F2] px-3 font-sans text-xs text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isBusy}
            className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating artwork…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Generate from story
              </>
            )}
          </button>

          <p className="font-sans text-xs text-gray-500">
            AI generation can take 30–60 seconds. Your own upload is kept across regenerations.
          </p>

          {errorMessage ? (
            <p className="font-sans text-xs font-semibold text-red-600">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="font-sans text-xs font-semibold text-green-700">{successMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="font-playpen w-full rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
