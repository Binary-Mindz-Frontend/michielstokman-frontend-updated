'use client';

import { CloudOff } from 'lucide-react';

/**
 * Marks a control that works in the UI but cannot be saved server-side yet.
 * Every draft-only action in the workspace carries one, so a reviewer can always
 * tell what is real.
 */
const DraftBadge = ({ label = 'Not saved yet' }: { label?: string }) => (
  <span
    title="Works for review only - the backend cannot store this yet"
    className="inline-flex items-center gap-1 rounded-full border border-[#E4D3C6] bg-[#FDF6F0] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#A2673F] uppercase"
  >
    <CloudOff size={10} strokeWidth={2.5} />
    {label}
  </span>
);

export default DraftBadge;
