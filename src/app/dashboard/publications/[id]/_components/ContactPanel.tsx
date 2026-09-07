'use client';

import type { PublicationDetail } from '@/types/publication.types';
import { ChevronDown, EyeOff, Mail, User } from 'lucide-react';
import { useState } from 'react';

/**
 * Author contact details for authorised admins only. Deliberately kept out of the
 * story card preview so a screenshot of the card can never leak it.
 */
const ContactPanel = ({ detail }: { detail: PublicationDetail }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[#E6DFDA] bg-white p-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-2 text-left"
      >
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          Author contact
        </span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition' : 'transition'} />
      </button>

      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#8A6E5F]">
        <EyeOff size={11} /> Admin only — never shown publicly
      </p>

      {open ? (
        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
              Account email
            </span>
            {detail.contact?.email ? (
              <a
                href={`mailto:${detail.contact.email}`}
                className="flex items-center gap-1.5 text-sm break-all text-[#4A3B32] hover:underline"
              >
                <Mail size={13} className="shrink-0" /> {detail.contact.email}
              </a>
            ) : (
              <p className="text-sm text-[#8A6E5F]">No account on this submission</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
              Real name
            </span>
            {detail.contact?.trueName ? (
              <p className="flex items-center gap-1.5 text-sm text-[#4A3B32]">
                <User size={13} className="shrink-0" /> {detail.contact.trueName}
              </p>
            ) : (
              <p className="text-sm text-[#8A6E5F]">Not provided</p>
            )}
          </div>

          <p className="border-t border-[#F0EAE5] pt-3 text-[11px] text-[#8A6E5F]">
            The pseudonym on the story card is the only name shown publicly. These details stay in
            this workspace.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ContactPanel;
