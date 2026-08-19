'use client';

import { AlertTriangle, X } from 'lucide-react';
import React from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface DeleteConfessionModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfessionModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: DeleteConfessionModalProps) {
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

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={24} />
        </div>

        <h3 className="font-edo text-xl font-bold tracking-wider text-gray-900">
          DELETE CONFESSION?
        </h3>

        <p className="mt-2 font-sans text-xs leading-relaxed font-medium text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-bold text-gray-900">&quot;{item.title}&quot;</span>? This action
          cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="font-playpen w-full rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="font-playpen w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
