'use client';

interface ProfileActionsProps {
  onUpdateFocus: () => void;
  onLogout: () => void;
}

export default function ProfileActions({ onUpdateFocus, onLogout }: ProfileActionsProps) {
  return (
    <div className="flex w-full flex-col gap-4">
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
