'use client';

import iconHeartPink from '@/assets/submit/icon-heart-pink.png';
import iconSunYellow from '@/assets/submit/icon-sun-yellow.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isSubmitWizardDraftDirty, loadSubmitWizardDraft } from '../submitStory.utils';

function readDraftFlags() {
  if (typeof window === 'undefined') {
    return { confession: false, meditation: false };
  }
  const confession = loadSubmitWizardDraft('Confessions');
  const meditation = loadSubmitWizardDraft('Meditation');
  return {
    confession: Boolean(confession && isSubmitWizardDraftDirty(confession.values, confession.step)),
    meditation: Boolean(meditation && isSubmitWizardDraftDirty(meditation.values, meditation.step)),
  };
}

export default function SubmitTypeChoice({ basePath = '/create' }: { basePath?: string }) {
  const router = useRouter();
  const [draftFlags] = useState(readDraftFlags);
  const hasConfessionDraft = draftFlags.confession;
  const hasMeditationDraft = draftFlags.meditation;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <div className="space-y-2">
        <h2 className="font-playpen text-xl font-bold text-[#1A1A1A] sm:text-2xl">
          What would you like to submit?
        </h2>
        <p className="font-sans text-sm text-[#666]">Start with one clear choice.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push(`${basePath}?type=Confessions`)}
          className="flex cursor-pointer flex-col items-start gap-3 rounded-lg border-2 border-[#EB2874]/40 bg-transparent p-5 text-left transition-colors hover:border-[#EB2874]"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6 shrink-0">
              <Image src={iconHeartPink} alt="" fill className="object-contain" />
            </div>
            <span className="font-sans text-sm font-bold tracking-wider text-[#EB2874] uppercase">
              Confession
            </span>
          </div>
          <p className="font-sans text-sm leading-relaxed text-[#503225]">
            Something true, raw and difficult to share. Something you might hardly dare to say out
            loud.
          </p>
          {hasConfessionDraft ? (
            <p className="font-sans text-xs font-semibold text-[#EB2874]">
              You have a saved confession draft.
            </p>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => router.push(`${basePath}?type=Meditation`)}
          className="flex cursor-pointer flex-col items-start gap-3 rounded-lg border-2 border-[#FEC332]/50 bg-transparent p-5 text-left transition-colors hover:border-[#FEC332]"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6 shrink-0">
              <Image src={iconSunYellow} alt="" fill className="object-contain" />
            </div>
            <span className="font-sans text-sm font-bold tracking-wider text-[#C48900] uppercase">
              Meditation
            </span>
          </div>
          <p className="font-sans text-sm leading-relaxed text-[#503225]">
            Something that transforms the listener. Emotional, spiritual, sensual or sexual —
            something that creates an inner experience or shift.
          </p>
          {hasMeditationDraft ? (
            <p className="font-sans text-xs font-semibold text-[#C48900]">
              You have a saved meditation draft.
            </p>
          ) : null}
        </button>
      </div>
    </div>
  );
}
