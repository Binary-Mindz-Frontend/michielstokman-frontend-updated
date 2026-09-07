'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  useGetAllPhotosQuery,
  useUpdatePhotoMutation,
  useUploadPhotoMutation,
} from '@/redux/features/admin/photoManagement/photoManagement.api';
import type { TColumn } from '@/types/custom-table.types';
import type { IPhotoManagementData } from '@/types/PhotoManagementData.type';
import { Edit3, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import BulkCoverRegenerate from '../../_components/BulkCoverRegenerate';

/** The three fallback covers, one per content type. */
const STORY_TYPES = ['confession', 'meditation', 'journey'];

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const errorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string; detail?: { msg?: string }[] } }).data;
    return data?.detail?.[0]?.msg || data?.message || fallback;
  }
  return fallback;
};

/**
 * Type-level fallback covers. These are not a story's own cover - they are only used
 * when AI cover generation fails, which is why they live beside the publications list
 * rather than inside a single publication's workspace.
 */
const CoverLibrary = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStoryType, setSelectedStoryType] = useState('confession');

  const { data: photosResponse, isLoading } = useGetAllPhotosQuery(undefined);
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();
  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();

  const apiPhotos: IPhotoManagementData[] = photosResponse?.data?.items || [];

  const rows: IPhotoManagementData[] = STORY_TYPES.map((type, index) => {
    const existing = apiPhotos.find(
      (photo) => photo.story_type?.toLowerCase() === type.toLowerCase(),
    );
    return {
      id: existing?.id || index + 1,
      story_type: type,
      image_url: existing?.image_url || null,
    };
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('File size exceeds the 10 MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const storyType = selectedStoryType.toLowerCase();
    const formData = new FormData();
    formData.append('story_type', storyType);
    formData.append('file', file);

    try {
      const existing = apiPhotos.find((photo) => photo.story_type?.toLowerCase() === storyType);

      if (existing?.image_url && existing?.id) {
        formData.append('is_active', 'true');
        const res = await updatePhoto({ id: existing.id, formData }).unwrap();
        if (res.success) toast.success(res.message || 'Cover image updated');
      } else {
        const res = await uploadPhoto(formData).unwrap();
        if (res.success) toast.success(res.message || 'Cover image uploaded');
      }
    } catch (error) {
      toast.error(errorMessage(error, 'Action failed'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openPicker = (row: IPhotoManagementData) => {
    setSelectedStoryType(row.story_type || 'confession');
    fileInputRef.current?.click();
  };

  const columns: TColumn<IPhotoManagementData>[] = [
    {
      header: 'Fallback cover',
      cell: (row) => (
        <div className="py-2">
          <button
            type="button"
            onClick={() => openPicker(row)}
            title={row.image_url ? 'Click to change image' : 'Click to add image'}
            className="group border-primary/20 relative flex h-25 w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-[#FAF7F5] md:h-30 md:w-50"
          >
            {isLoading ? (
              <div className="h-full w-full animate-pulse bg-[#EADED5]/40" />
            ) : row.image_url ? (
              <Image
                src={row.image_url}
                alt={`${row.story_type} fallback cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="200px"
              />
            ) : (
              <span className="text-secondary px-2 text-center text-xs font-medium">
                Click to add image
              </span>
            )}

            {!isLoading ? (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Edit3 size={18} className="text-white" />
                <span className="text-xs font-semibold tracking-wide text-white uppercase">
                  {row.image_url ? 'Change' : 'Upload'}
                </span>
              </span>
            ) : null}
          </button>
        </div>
      ),
    },
    {
      header: 'Content type',
      cell: (row) => (
        <span className="text-secondary font-semibold">{row.story_type.toUpperCase()}</span>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-4 sm:p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />

      {isUploading || isUpdating ? (
        <div className="text-secondary flex animate-pulse items-center justify-end gap-2 text-xs font-medium">
          <Loader2 size={14} className="animate-spin" /> Uploading media to server…
        </div>
      ) : null}

      <CustomTable columns={columns} data={rows} />

      <div className="flex flex-col gap-3 border-t border-[#EBE4D5] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-secondary max-w-xl text-sm">
          These images are used only when AI cover generation fails. Regenerating rebuilds a unique
          collage cover for existing stories and leaves member uploads alone. It takes several
          minutes.
        </p>
        <BulkCoverRegenerate />
      </div>
    </div>
  );
};

export default CoverLibrary;
