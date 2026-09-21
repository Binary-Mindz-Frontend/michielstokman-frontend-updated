'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { useUpdateAvatarMutation } from '@/redux/features/userProfile/userProfile.api';

interface ProfileActionsProps {
  isAdmin?: boolean;
  onBackToDashboard?: () => void;
  onUpdateFocus: () => void;
  onLogout: () => void;
}

export default function ProfileActions({
  isAdmin,
  onBackToDashboard,
  onUpdateFocus,
  onLogout,
}: ProfileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Use a JPEG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller.');
      return;
    }

    try {
      await updateAvatar(file).unwrap();
      setFileName(file.name);
      toast.success('Profile photo updated.');
    } catch {
      toast.error('Could not upload the profile photo.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />

      {isAdmin && onBackToDashboard ? (
        <button
          type="button"
          onClick={onBackToDashboard}
          className="w-full cursor-pointer rounded-none border-2 border-[#D9305B]/30 bg-white py-4 text-center text-base font-bold text-[#D9305B] transition-colors hover:bg-[#FFF5F7]"
        >
          Back to dashboard
        </button>
      ) : null}

      <button
        type="button"
        disabled={isLoading}
        onClick={() => fileInputRef.current?.click()}
        className="w-full cursor-pointer rounded-none border-2 border-gray-100 bg-white py-4 text-center text-base font-bold text-[#555] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? 'Uploading photo…'
          : fileName
            ? `Photo updated: ${fileName}`
            : 'Upload profile photo'}
      </button>

      <button
        type="button"
        onClick={onUpdateFocus}
        className="w-full cursor-pointer rounded-none bg-[#D9305B] py-4 text-center text-base font-bold text-white transition-colors hover:bg-[#c0284e]"
      >
        Update Your Focus
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="w-full cursor-pointer rounded-none border-2 border-gray-100 bg-white py-4 text-center text-base font-bold text-[#555] transition-colors hover:bg-gray-50"
      >
        Logout
      </button>
    </div>
  );
}
