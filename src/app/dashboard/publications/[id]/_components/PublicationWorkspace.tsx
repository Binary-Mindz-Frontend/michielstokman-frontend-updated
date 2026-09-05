'use client';

import placeholder from '@/assets/shared/table_placeholder_image.jpg';
import { Button } from '@/components/ui/button';
import { useUpdateStoryMutation } from '@/redux/features/admin/adminModeration/adminModeration.api';
import {
  useApprovePublicationAssetMutation,
  useGetPublicationQuery,
  usePublishPublicationMutation,
  useRegeneratePublicationCoverMutation,
  useRegeneratePublicationVoiceMutation,
  useRejectPublicationAssetMutation,
  useReplacePublicationCoverMutation,
  useReplacePublicationVoiceMutation,
  useSkipPublicationVoiceMutation,
} from '@/redux/features/admin/publications/publications.api';
import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import {
  ASSET_STATUS_LABEL,
  PUBLICATION_STATUS_LABEL,
  STATUS_COLOR,
  type PublicationWorkspace as PublicationRecord,
} from '@/types/publication.types';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Tab = 'content' | 'card' | 'voice';

function errorMessage(err: unknown, fallback: string) {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { message?: string; detail?: string } }).data;
    return data?.message || data?.detail || fallback;
  }
  return fallback;
}

function StatusChip({ status }: { status: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase"
      style={{
        backgroundColor: `${STATUS_COLOR[status] || '#9A8878'}1A`,
        color: STATUS_COLOR[status],
      }}
    >
      {PUBLICATION_STATUS_LABEL[status as keyof typeof PUBLICATION_STATUS_LABEL] ||
        ASSET_STATUS_LABEL[status as keyof typeof ASSET_STATUS_LABEL] ||
        status}
    </span>
  );
}

export default function PublicationWorkspace({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useGetPublicationQuery(id);
  const story: PublicationRecord | undefined = data?.data;

  useEffect(() => {
    const generating = [story?.content_status, story?.cover_status, story?.voice_status].includes(
      'in_progress',
    );
    if (!generating) return undefined;
    const timer = window.setInterval(() => {
      refetch();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [story?.content_status, story?.cover_status, story?.voice_status, refetch]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-[#8A6E5F]">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading publication…
      </div>
    );
  }

  if (isError || !story) {
    return <p className="text-sm text-[#8A6E5F]">This publication could not be loaded.</p>;
  }

  return <WorkspaceBody key={story.id} id={id} story={story} refetch={refetch} />;
}

function WorkspaceBody({
  id,
  story,
  refetch,
}: {
  id: string;
  story: PublicationRecord;
  refetch: () => void;
}) {
  const { user } = useAppSelector(useAuthState);
  const [tab, setTab] = useState<Tab>('content');
  const [storyText, setStoryText] = useState(story.story_text || '');
  const [firstName, setFirstName] = useState(story.first_name || '');
  const [location, setLocation] = useState(story.location || '');
  const [gender, setGender] = useState(story.gender || '');
  const [orientation, setOrientation] = useState(story.sexual_orientation || '');
  const [age, setAge] = useState(
    story.age !== null && story.age !== undefined ? String(story.age) : '',
  );
  const [explicit, setExplicit] = useState(Boolean(story.high_intensity));
  const coverInput = useRef<HTMLInputElement>(null);
  const voiceInput = useRef<HTMLInputElement>(null);

  const [updateStory, { isLoading: saving }] = useUpdateStoryMutation();
  const [approveAsset, { isLoading: approving }] = useApprovePublicationAssetMutation();
  const [rejectAsset, { isLoading: rejecting }] = useRejectPublicationAssetMutation();
  const [publish, { isLoading: publishing }] = usePublishPublicationMutation();
  const [regenCover, { isLoading: regenCovering }] = useRegeneratePublicationCoverMutation();
  const [replaceCover, { isLoading: replacingCover }] = useReplacePublicationCoverMutation();
  const [regenVoice, { isLoading: regenVoicing }] = useRegeneratePublicationVoiceMutation();
  const [replaceVoice, { isLoading: replacingVoice }] = useReplacePublicationVoiceMutation();
  const [skipVoice, { isLoading: skipping }] = useSkipPublicationVoiceMutation();

  const busy =
    saving ||
    approving ||
    rejecting ||
    publishing ||
    regenCovering ||
    replacingCover ||
    regenVoicing ||
    replacingVoice ||
    skipping;

  const saveIdentityAndText = async () => {
    await updateStory({
      storyId: id,
      story_text: storyText,
      first_name: firstName,
      location,
      gender,
      sexual_orientation: orientation,
      age: age ? Number(age) : null,
      high_intensity: explicit,
    }).unwrap();
    toast.success('Saved');
    refetch();
  };

  const onApprove = async (asset: 'content' | 'cover' | 'voice') => {
    try {
      if (asset === 'content') await saveIdentityAndText();
      await approveAsset({ storyId: id, asset }).unwrap();
      toast.success(`${asset} approved`);
      refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not approve'));
    }
  };

  const onReject = async (asset: 'content' | 'cover' | 'voice') => {
    try {
      await rejectAsset({ storyId: id, asset }).unwrap();
      toast.success(`${asset} rejected`);
      refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not reject'));
    }
  };

  const onPublish = async () => {
    try {
      await publish(id).unwrap();
      toast.success('Published');
      refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Not ready to publish'));
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'card', label: 'Story Card' },
    { id: 'voice', label: 'Voice' },
  ];

  return (
    <div className="space-y-4 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#301C05]">{story.title || 'Untitled'}</h3>
          <p className="text-sm text-[#8A6E5F]">
            {story.story_type} · {story.first_name || 'No public name'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={story.publication_status} />
          <Button
            disabled={!story.can_publish || busy || Boolean(story.published_at)}
            onClick={onPublish}
            className="bg-[#149443] text-white disabled:opacity-40"
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </Button>
        </div>
      </div>
      {story.publish_blockers.length > 0 && !story.published_at ? (
        <p className="text-sm text-[#8A6E5F]">
          Ready to publish when content, cover, and voice (or no-voice) are approved.
        </p>
      ) : null}

      {user?.is_admin ? (
        <div className="rounded-md border border-[#E8DFD6] bg-white p-4">
          <p className="mb-1 text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Author contact — administrators only
          </p>
          <p className="text-sm text-[#4A3B32]">{story.contact.true_name || '—'}</p>
          <p className="text-sm text-[#4A3B32]">{story.contact.email || '—'}</p>
          <p className="mt-1 text-xs text-[#9A8878]">
            Never shown on the story card or public pages.
          </p>
        </div>
      ) : null}

      <div className="flex gap-6 border-b border-[#E8DFD6]">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative pb-2 text-sm font-medium ${tab === item.id ? 'text-primary' : 'text-[#8A6E5F]'}`}
          >
            {item.label}
            {tab === item.id ? (
              <span className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'content' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              Original submission
            </p>
            <div className="min-h-64 rounded-md border border-[#E1D7CE] bg-[#FAF8F5] p-3 text-sm whitespace-pre-wrap text-[#5C4D43]">
              {story.story_input || 'No original text.'}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
                Edited version
              </p>
              <StatusChip status={story.content_status} />
            </div>
            <textarea
              value={storyText}
              onChange={(event) => setStoryText(event.target.value)}
              className="min-h-64 w-full rounded-md border border-[#E1D7CE] bg-white p-3 text-sm text-[#4A3B32]"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                disabled={busy}
                onClick={() =>
                  saveIdentityAndText().catch((err) =>
                    toast.error(errorMessage(err, 'Save failed')),
                  )
                }
              >
                Save text
              </Button>
              <Button disabled={busy} onClick={() => onApprove('content')}>
                Approve text
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => onReject('content')}>
                Reject text
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'card' ? (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-xl border border-[#E6DFDA] bg-[#FAF8F5]">
            <Image
              src={story.cover_image_url || placeholder}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusChip status={story.cover_status} />
              {story.high_intensity ? (
                <span className="rounded-full bg-[#301C05] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  Explicit
                </span>
              ) : null}
            </div>
            <p className="text-lg font-bold text-[#301C05]">{story.title || 'Untitled'}</p>
            <p className="text-sm text-[#5C4D43]">
              {firstName || '—'} · {age || '—'} · {gender || '—'} · {orientation || '—'}
            </p>
            <p className="text-sm text-[#5C4D43]">{location || '—'}</p>
            <p className="text-sm text-[#8A6E5F]">{story.story_type}</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="rounded-md border border-[#E1D7CE] px-3 py-2 text-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Author or pseudonym"
              />
              <input
                className="rounded-md border border-[#E1D7CE] px-3 py-2 text-sm"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />
              <input
                className="rounded-md border border-[#E1D7CE] px-3 py-2 text-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Gender"
              />
              <input
                className="rounded-md border border-[#E1D7CE] px-3 py-2 text-sm"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                placeholder="Sexual orientation"
              />
              <input
                className="col-span-2 rounded-md border border-[#E1D7CE] px-3 py-2 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City and country"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#4A3B32]">
              <input
                type="checkbox"
                checked={explicit}
                onChange={(e) => setExplicit(e.target.checked)}
              />
              Explicit
            </label>
            <input
              ref={coverInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  await replaceCover({ storyId: id, file }).unwrap();
                  toast.success('Cover replaced');
                  refetch();
                } catch (err) {
                  toast.error(errorMessage(err, 'Cover upload failed'));
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy}
                onClick={() =>
                  saveIdentityAndText().catch((err) =>
                    toast.error(errorMessage(err, 'Save failed')),
                  )
                }
              >
                Save card details
              </Button>
              <Button
                disabled={busy}
                onClick={async () => {
                  try {
                    await regenCover(id).unwrap();
                    toast.success('Cover regeneration started');
                    refetch();
                  } catch (err) {
                    toast.error(errorMessage(err, 'Cover regen failed'));
                  }
                }}
              >
                {regenCovering ? 'Regenerating…' : 'Regenerate image'}
              </Button>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => coverInput.current?.click()}
              >
                Replace image
              </Button>
              <Button disabled={busy} onClick={() => onApprove('cover')}>
                Approve story card
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => onReject('cover')}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'voice' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StatusChip status={story.voice_status} />
            {story.voice.voice_not_required ? (
              <span className="text-xs text-[#8A6E5F]">
                This publication has no voice on purpose.
              </span>
            ) : null}
          </div>
          <p className="text-sm text-[#5C4D43]">
            {story.voice.voice_name || 'No voice selected'}
            {story.voice.duration_seconds
              ? ` · ${Math.floor(story.voice.duration_seconds / 60)}:${String(story.voice.duration_seconds % 60).padStart(2, '0')}`
              : ''}
            {story.voice.generated_at
              ? ` · ${new Date(story.voice.generated_at).toLocaleDateString()}`
              : ''}
          </p>
          {story.voice.audio_path ? (
            <audio controls src={story.voice.audio_path} className="w-full" />
          ) : (
            <p className="text-sm text-[#9A8878]">No audio yet.</p>
          )}
          <input
            ref={voiceInput}
            type="file"
            accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                await replaceVoice({ storyId: id, file }).unwrap();
                toast.success('Audio replaced');
                refetch();
              } catch (err) {
                toast.error(errorMessage(err, 'Audio upload failed'));
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={busy}
              onClick={async () => {
                try {
                  await regenVoice(id).unwrap();
                  toast.success('Voice regeneration started');
                  refetch();
                } catch (err) {
                  toast.error(errorMessage(err, 'Voice regen failed'));
                }
              }}
            >
              {regenVoicing ? 'Starting…' : 'Regenerate voice'}
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => voiceInput.current?.click()}>
              Replace or upload audio
            </Button>
            <Button disabled={busy} onClick={() => onApprove('voice')}>
              Approve audio
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={async () => {
                try {
                  await skipVoice(id).unwrap();
                  toast.success('Marked as no voice');
                  refetch();
                } catch (err) {
                  toast.error(errorMessage(err, 'Could not skip voice'));
                }
              }}
            >
              No voice on this publication
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => onReject('voice')}>
              Reject
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
