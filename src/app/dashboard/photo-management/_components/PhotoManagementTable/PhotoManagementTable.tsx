/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  useGetAllPhotosQuery,
  useUpdatePhotoMutation,
  useUploadPhotoMutation,
} from '@/redux/features/admin/photoManagement/photoManagement.api';
import { TColumn } from '@/types/custom-table.types';
import { IPhotoManagementData } from '@/types/PhotoManagementData.type';
import { Edit3, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

function PhotoManagementTable() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setEditingPhotoId] = useState<string | number | null>(null);
  const [selectedStoryType, setSelectedStoryType] = useState<string>('confession');

  // Get all, Upload, Update Hooks
  const { data: photosResponse, isLoading: isPhotosLoading } = useGetAllPhotosQuery(undefined);
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();
  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();
  // ---
  const apiPhotos: IPhotoManagementData[] = photosResponse?.data?.items || [];
  // default types to be added (Fixed)
  const defaultTypes = ['confession', 'meditation', 'journey'];

  // Generate the photo list
  const photoList: IPhotoManagementData[] = defaultTypes.map((type, index) => {
    const existingPhoto = apiPhotos.find(
      (p: IPhotoManagementData) => p.story_type?.toLowerCase() === type.toLowerCase(),
    );

    return {
      id: existingPhoto?.id || index + 1,
      story_type: type,
      image_url: existingPhoto?.image_url || null,
    };
  });

  // Handle File Change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10 MB limit check
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }

    // Form Data
    const formData = new FormData();
    const apiType = selectedStoryType.toLowerCase();
    formData.append('story_type', apiType);
    formData.append('file', file);

    try {
      const existingItem = apiPhotos.find(
        (p: IPhotoManagementData) => p.story_type?.toLowerCase() === apiType,
      );

      if (existingItem?.image_url && existingItem?.id) {
        // --- UPDATE MODE ---
        formData.append('is_active', 'true');
        const res = await updatePhoto({ id: existingItem.id, formData }).unwrap();
        if (res.success) toast.success(res.message || 'Cover image updated successfully');
      } else {
        // --- FIRST TIME UPLOAD MODE ---
        const res = await uploadPhoto(formData).unwrap();
        if (res.success) toast.success(res.message || 'Cover image uploaded successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.detail?.[0]?.msg || error?.data?.message || 'Action failed');
    } finally {
      setEditingPhotoId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (row: IPhotoManagementData) => {
    setEditingPhotoId(row?.id);
    setSelectedStoryType(row?.story_type || 'confession');
    fileInputRef.current?.click();
  };

  const tableConfig: TColumn<IPhotoManagementData>[] = [
    {
      header: 'Content Image',
      cell: (row) => {
        const displayImage = row?.image_url;

        return (
          <div className="py-2">
            <div
              onClick={() => handleImageClick(row)}
              className="group border-primary/20 relative flex h-25 w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-[#FAF7F5] transition-all md:h-30 md:w-50"
              title={displayImage ? 'Click to change image' : 'Click to add image'}
            >
              {isPhotosLoading ? (
                <div className="border-primary/5 flex h-25 w-40 shrink-0 animate-pulse items-center justify-center rounded-md border bg-[#FAF7F5] md:h-30 md:w-50">
                  <div className="h-6 w-16 rounded bg-[#EADED5]/40" />
                </div>
              ) : displayImage ? (
                <Image
                  src={displayImage}
                  alt="Photo Thumbnail"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="text-secondary px-2 text-center text-xs font-medium">
                  Click to Add Image
                </span>
              )}

              {/* Hover Overlay with Edit Icon  */}
              {!isPhotosLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Edit3 size={18} className="text-white" />
                  <span className="rounded px-1.5 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
                    {displayImage ? 'Change' : 'Upload'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Type',
      cell: (row) => (
        <span className="text-secondary font-semibold">{row?.story_type.toUpperCase()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />

      {(isUploading || isUpdating) && (
        <div className="flex justify-end">
          <div className="text-secondary flex animate-pulse items-center gap-2 text-xs font-medium">
            <Loader2 size={14} className="animate-spin" /> Uploading media to server...
          </div>
        </div>
      )}

      <CustomTable columns={tableConfig} data={photoList} />
    </div>
  );
}

export default PhotoManagementTable;
