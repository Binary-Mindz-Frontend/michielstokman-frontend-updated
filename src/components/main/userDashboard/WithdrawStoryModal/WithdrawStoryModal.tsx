'use client';

import { createHrefForStoryType } from '@/utils/memberStory.utils';
import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface WithdrawStoryModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function WithdrawStoryModal({
  isOpen,
  item,
  onClose,
  onConfirm,
  isLoading = false,
}: WithdrawStoryModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 text-center shadow-2xl duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle size={24} />
        </div>

        <h3 className="font-edo text-xl font-bold tracking-wider text-gray-900">WITHDRAW STORY?</h3>

        <p className="mt-2 font-sans text-xs leading-relaxed font-medium text-gray-600">
          &quot;{item.title}&quot; will be removed from the public feed but stays in your library.
          You can resubmit this piece later, or submit a new one.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="font-playpen w-full rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="font-playpen w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-700 disabled:opacity-60"
            >
              {isLoading ? 'Withdrawing…' : 'Withdraw'}
            </button>
          </div>
          <Link
            href={createHrefForStoryType(item.story_type)}
            onClick={onClose}
            className="font-playpen text-xs font-bold tracking-wide text-[#D98755] uppercase hover:underline"
          >
            Submit a new piece instead
          </Link>
        </div>
      </div>
    </div>
  );
}
