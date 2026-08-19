/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface EditConfessionModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (updatedItem: UserDashboardItem) => void;
}

export default function EditConfessionModal({
  isOpen,
  item,
  onClose,
  onSave,
}: EditConfessionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-4">
          <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">
            EDIT CONFESSION
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="font-playpen block text-xs font-semibold text-gray-800">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-4 py-2.5 font-sans text-sm font-medium text-gray-900 focus:border-[#D98755] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-playpen block text-xs font-semibold text-gray-800">
              Description / Story
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-4 py-2.5 font-sans text-sm font-medium text-gray-900 focus:border-[#D98755] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-[#EBE4D5] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-playpen rounded-xl border border-[#EBE4D5] bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="font-playpen rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#b5243f]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
