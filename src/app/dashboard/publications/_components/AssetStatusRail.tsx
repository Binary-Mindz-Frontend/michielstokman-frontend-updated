'use client';

import type { PublicationStatuses } from '@/types/publication.types';
import StatusChip from './StatusChip';

/** Text / Cover / Voice at a glance, used in the workspace header. */
const AssetStatusRail = ({
  statuses,
  voiceNotRequired,
}: {
  statuses: PublicationStatuses;
  voiceNotRequired: boolean;
}) => {
  const items = [
    { label: 'Text', status: statuses.text, note: undefined as string | undefined },
    { label: 'Cover', status: statuses.cover, note: undefined as string | undefined },
    {
      label: 'Voice',
      status: statuses.voice,
      note: voiceNotRequired ? 'no voice by design' : undefined,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            {item.label}
          </span>
          <StatusChip status={item.status} size="sm" note={item.note} />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          Publication
        </span>
        <StatusChip status={statuses.overall} size="sm" />
      </div>
    </div>
  );
};

export default AssetStatusRail;
