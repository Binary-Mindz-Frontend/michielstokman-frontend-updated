'use client';

import { BACKEND_REQUIREMENTS } from '@/lib/publications/capabilities';
import {
  resetAllPublicationDrafts,
  selectDraftCount,
} from '@/redux/features/admin/publications/publicationsDraft.slice';
import { clearDraftEntries } from '@/redux/features/admin/publications/publicationsDraft.storage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ChevronDown, FlaskConical } from 'lucide-react';
import { useState } from 'react';

/**
 * Says out loud which parts of this dashboard are review-only, so nobody mistakes
 * a draft approval for a saved one.
 */
const ReviewModeBanner = () => {
  const dispatch = useAppDispatch();
  const draftCount = useAppSelector(selectDraftCount);
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    dispatch(resetAllPublicationDrafts());
    clearDraftEntries();
  };

  return (
    <div className="mb-6 rounded-md border border-[#E4D3C6] bg-[#FDF6F0] px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <FlaskConical size={16} className="text-[#A2673F]" />
        <p className="text-sm text-[#6B4A33]">
          <span className="font-semibold">Frontend review build.</span> Text edits, AI fields,
          reject, request changes, voice regenerate and Publish are live. Per-asset approvals, image
          regenerate/replace and audio replace are marked{' '}
          <span className="font-semibold">Not saved yet</span> and live only in this browser
          session.
        </p>
        <div className="ms-auto flex items-center gap-2">
          {draftCount > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded-md border border-[#E4D3C6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#A2673F] hover:bg-[#FBF1EA]"
            >
              Reset {draftCount} local {draftCount === 1 ? 'change' : 'changes'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#A2673F]"
          >
            Backend still needed
            <ChevronDown size={12} className={open ? 'rotate-180 transition' : 'transition'} />
          </button>
        </div>
      </div>

      {open ? (
        <ul className="mt-3 ml-7 list-disc space-y-1 text-xs text-[#7A5B45]">
          {BACKEND_REQUIREMENTS.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default ReviewModeBanner;
