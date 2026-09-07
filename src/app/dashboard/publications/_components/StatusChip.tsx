'use client';

import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import { STATUS_META } from '@/lib/publications/status';
import type { PublicationStatus } from '@/types/publication.types';

/** The single renderer for every status in the dashboard. */
const StatusChip = ({
  status,
  size = 'xs',
  note,
}: {
  status: PublicationStatus;
  size?: 'xs' | 'sm' | 'md';
  note?: string;
}) => {
  const meta = STATUS_META[status];

  return (
    <span className="inline-flex items-center gap-1.5" title={note}>
      <DynamicBadge text={meta.label} color={meta.color} icon={meta.icon} size={size} />
      {note ? <span className="text-[10px] text-[#8A6E5F]">{note}</span> : null}
    </span>
  );
};

export default StatusChip;
