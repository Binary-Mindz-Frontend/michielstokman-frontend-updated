'use client';

import placeholder from '@/assets/shared/table_placeholder_image.jpg';
import type { PublicationRow } from '@/types/publication.types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StatusChip from './StatusChip';

/** Same data as a table row, stacked for narrow screens. */
const PublicationCard = ({ row }: { row: PublicationRow }) => (
  <div className="space-y-3 rounded-md border border-[#EDE4DD] bg-white p-4">
    <div className="flex gap-3">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-[#F1EAE4]">
        <Image
          src={row.coverImageUrl || placeholder}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-secondary line-clamp-2 leading-snug font-semibold">{row.title}</p>
        <p className="truncate text-xs text-[#8A6E5F]" title={row.author}>
          {row.author}
          {row.authorIsAccountEmail ? ' (account email)' : ''}
        </p>
        <p className="text-xs text-[#8A6E5F]">
          {row.typeLabel} · {row.submittedLabel}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {(
        [
          ['Text', row.text],
          ['Cover', row.cover],
          ['Voice', row.voice],
          ['Overall', row.overall],
        ] as const
      ).map(([label, status]) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-14 text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
            {label}
          </span>
          <StatusChip status={status} />
        </div>
      ))}
    </div>

    <Link
      href={`/dashboard/publications/${row.id}`}
      className="bg-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
    >
      Open <ArrowRight size={14} />
    </Link>
  </div>
);

export default PublicationCard;
