'use client';

import placeholder from '@/assets/shared/table_placeholder_image.jpg';
import { Button } from '@/components/ui/button';
import { apiErrorMessage } from '@/lib/publications/apiError';
import {
  useRegeneratePublicationCoverMutation,
  useReplacePublicationCoverMutation,
  useSuggestStoryFieldMutation,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationDetail } from '@/types/publication.types';
import { storyIdentityLines } from '@/utils/storyIdentity.utils';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ImageUp,
  Loader2,
  RefreshCw,
  Undo2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAssetApproval } from './useAssetApproval';
import type { WorkspaceForm } from './useWorkspaceDraft';

const inputClass =
  'w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40';

const labelClass = 'text-[11px] font-bold tracking-wider text-[#A08170] uppercase';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ChipList = ({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  // eslint-disable-next-line no-unused-vars -- callback prop type
  onChange: (next: string[]) => void;
  placeholder: string;
}) => {
  const [entry, setEntry] = useState('');

  const add = () => {
    const value = entry.trim();
    if (!value) return;
    if (!items.includes(value)) onChange([...items, value]);
    setEntry('');
  };

  return (
    <div className="space-y-2">
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(items.filter((value) => value !== item))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5C3A21]"
            >
              {item} <X size={10} />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-[#8A6E5F]">Nothing yet — generate or type below.</p>
      )}
      <input
        className={inputClass}
        placeholder={placeholder}
        value={entry}
        onChange={(event) => setEntry(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            add();
          }
        }}
      />
    </div>
  );
};

const StoryCardTab = ({
  detail,
  form,
  patch,
  isDirty,
  isSaving,
  save,
  reset,
}: {
  detail: PublicationDetail;
  form: WorkspaceForm;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  patch: (partial: Partial<WorkspaceForm>) => void;
  isDirty: boolean;
  isSaving: boolean;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  save: (options?: { silent?: boolean }) => Promise<boolean>;
  reset: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [suggesting, setSuggesting] = useState<'hook' | 'tagline' | 'moods' | null>(null);
  const [suggestField] = useSuggestStoryFieldMutation();
  const [regenerateCover, { isLoading: isRegenerating }] = useRegeneratePublicationCoverMutation();
  const [replaceCover, { isLoading: isUploading }] = useReplacePublicationCoverMutation();
  const { setApproved, isLoading: isApproving } = useAssetApproval(detail.id, 'cover');

  const approved = detail.statuses.cover === 'approved';
  const coverSrc = detail.coverImageUrl || placeholder;

  const identity = storyIdentityLines({
    authorName: form.pseudonym,
    location: [form.city, form.country].filter(Boolean).join(', '),
    gender: form.gender,
    sexualOrientation: form.sexualOrientation,
    occupation: form.occupation,
    age: form.age,
  });

  const checklist = [
    { label: 'Cover image', ok: Boolean(detail.coverImageUrl) },
    { label: 'Title', ok: Boolean(form.title.trim()) },
    { label: 'Author name or pseudonym', ok: Boolean(form.pseudonym.trim()) },
    { label: 'Age', ok: Boolean(form.age.trim()) },
    { label: 'Gender', ok: Boolean(form.gender.trim()) },
    { label: 'Sexual orientation', ok: Boolean(form.sexualOrientation.trim()) },
    { label: 'City', ok: Boolean(form.city.trim()) },
    { label: 'Country', ok: Boolean(form.country.trim()) },
    { label: 'Tagline', ok: Boolean(form.heroTagline.trim()) },
  ];
  const missingCount = checklist.filter((item) => !item.ok).length;

  const handleSuggest = async (field: 'hook' | 'tagline' | 'moods') => {
    setSuggesting(field);
    try {
      const res = await suggestField({ storyId: detail.id, field }).unwrap();
      const payload = (res?.data ?? res) as {
        hero_hook?: string;
        hero_tagline?: string;
        tags?: string[];
        growth_areas?: string[];
        life_phase?: string;
      };

      if (field === 'hook' && payload.hero_hook?.trim()) {
        patch({ heroHook: payload.hero_hook.trim() });
      } else if (field === 'tagline' && payload.hero_tagline?.trim()) {
        patch({ heroTagline: payload.hero_tagline.trim() });
      } else if (field === 'moods') {
        patch({
          ...(payload.tags?.length ? { tags: payload.tags } : {}),
          ...(payload.growth_areas?.length ? { growthAreas: payload.growth_areas } : {}),
          ...(payload.life_phase?.trim() ? { lifePhase: payload.life_phase.trim() } : {}),
        });
      } else {
        toast.error('Nothing came back — try again');
        return;
      }
      toast.success('Filled — edit in place, then save');
    } catch {
      toast.error('Could not generate a suggestion');
    } finally {
      setSuggesting(null);
    }
  };

  const handleReplaceCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }
    try {
      const res = await replaceCover({ storyId: detail.id, file }).unwrap();
      if (res?.success) toast.success(res.message || 'Story card image replaced');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not upload the image'));
    }
  };

  const handleRegenerate = async () => {
    try {
      const res = await regenerateCover(detail.id).unwrap();
      if (res?.success) {
        toast.success(res.message || 'Story card regeneration started');
      }
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not start regeneration'));
    }
  };

  const toggleApproved = async () => {
    // Approve the card as saved, so pending edits do not misrepresent it.
    if (isDirty && !(await save({ silent: true }))) return;
    await setApproved(!approved);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      {/* Finished card preview */}
      <div className="space-y-4">
        <div className="rounded-md bg-[#F8F3ED] p-4">
          <span className={labelClass}>Finished story card</span>

          <div className="relative mt-3 mb-4 h-60 w-full overflow-hidden rounded-md bg-[#E9E1DA]">
            <Image
              src={coverSrc}
              alt={form.title || 'Story cover'}
              fill
              unoptimized={typeof coverSrc === 'string'}
              className="object-cover object-center"
              sizes="340px"
            />
          </div>

          <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
            {detail.typeLabel}
          </span>
          <h3 className="mt-1 text-lg font-medium tracking-wide text-[#5C3A21] capitalize">
            {form.title || 'Untitled'}
          </h3>
          {form.heroTagline ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-medium text-black">
              {form.heroTagline}
            </p>
          ) : null}

          <div className="mt-3 space-y-0.5">
            {identity.nameLine ? (
              <p className="font-serif text-sm leading-snug text-[#5C3A21] italic">
                {identity.nameLine}
              </p>
            ) : null}
            {identity.detailLine ? (
              <p className="text-xs leading-relaxed text-[#5C4A3A]">{identity.detailLine}</p>
            ) : null}
          </div>

          {form.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {form.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs border border-[#EBE4D5] bg-[#FAF7F2] px-2 py-0.5 text-[11px] text-[#5C4A3A]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {form.explicit ? (
            <p className="mt-2 text-xs font-medium tracking-wide text-[#301C05]">Explicit</p>
          ) : null}

          <p className="mt-3 border-t border-[#EBE4D5] pt-2 text-[10px] text-[#8A6E5F]">
            Exactly what the public sees. Contact details are never part of this card.
          </p>
        </div>

        {/* Image actions */}
        <div className="space-y-3 rounded-xl border border-[#E6DFDA] bg-white p-4">
          <span className={labelClass}>Image</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleReplaceCover}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm font-medium text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
            >
              {isRegenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm font-medium text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
              Replace
            </button>
          </div>

          {detail.statuses.cover === 'in_progress' ? (
            <p className="text-[11px] text-[#8A6E5F]">
              A new story card is being drawn. Refresh in a moment to see it.
            </p>
          ) : null}

          <div className="flex items-center gap-2 border-t border-[#F0EAE5] pt-3">
            <button
              type="button"
              onClick={toggleApproved}
              disabled={isApproving || isSaving}
              className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                approved
                  ? 'bg-[#149443] text-white'
                  : 'border border-[#B9D9C4] bg-white text-[#149443] hover:bg-[#F1FAF4]'
              }`}
            >
              {isApproving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {approved ? 'Card approved' : 'Approve story card'}
            </button>
          </div>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-5">
        <div className="rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
          <div className="flex items-center gap-2">
            {missingCount ? (
              <AlertCircle size={14} className="text-[#BF7758]" />
            ) : (
              <CheckCircle2 size={14} className="text-[#149443]" />
            )}
            <span className="text-sm font-semibold text-[#5C3A21]">
              {missingCount
                ? `${missingCount} card field${missingCount === 1 ? '' : 's'} still empty`
                : 'All card information is filled in'}
            </span>
          </div>
          {missingCount ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {checklist
                .filter((item) => !item.ok)
                .map((item) => (
                  <span
                    key={item.label}
                    className="rounded-full border border-[#E4D3C6] bg-white px-2 py-0.5 text-[11px] text-[#A2673F]"
                  >
                    {item.label}
                  </span>
                ))}
            </div>
          ) : null}
        </div>

        <label className="block space-y-1">
          <span className={labelClass}>Title</span>
          <input
            className={inputClass}
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className={labelClass}>Content type</span>
            <select
              className={inputClass}
              value={form.storyType}
              onChange={(event) => patch({ storyType: event.target.value })}
            >
              <option value="confession">Confession</option>
              <option value="meditation">Meditation</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm text-[#5C3A21]">
            <input
              type="checkbox"
              checked={form.explicit}
              onChange={(event) => patch({ explicit: event.target.checked })}
            />
            Explicit label
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className={labelClass}>Author name / pseudonym</span>
            <input
              className={inputClass}
              value={form.pseudonym}
              onChange={(event) => patch({ pseudonym: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Age</span>
            <input
              className={inputClass}
              value={form.age}
              onChange={(event) => patch({ age: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Gender</span>
            <input
              className={inputClass}
              value={form.gender}
              onChange={(event) => patch({ gender: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Sexual orientation</span>
            <input
              className={inputClass}
              value={form.sexualOrientation}
              onChange={(event) => patch({ sexualOrientation: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>City</span>
            <input
              className={inputClass}
              value={form.city}
              onChange={(event) => patch({ city: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Country</span>
            <input
              className={inputClass}
              value={form.country}
              onChange={(event) => patch({ country: event.target.value })}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className={labelClass}>Occupation</span>
            <input
              className={inputClass}
              value={form.occupation}
              onChange={(event) => patch({ occupation: event.target.value })}
            />
          </label>
        </div>

        <div className="space-y-2 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className={`block ${labelClass}`}>Public tagline</span>
              <p className="text-[11px] text-[#8A6E5F]">One line under the title</p>
            </div>
            <button
              type="button"
              onClick={() => handleSuggest('tagline')}
              disabled={suggesting === 'tagline'}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
            >
              {suggesting === 'tagline' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Regenerate
            </button>
          </div>
          <textarea
            className={`${inputClass} min-h-16`}
            value={form.heroTagline}
            onChange={(event) => patch({ heroTagline: event.target.value })}
          />
        </div>

        <div className="space-y-2 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className={`block ${labelClass}`}>First sentences</span>
              <p className="text-[11px] text-[#8A6E5F]">Hook listeners see first</p>
            </div>
            <button
              type="button"
              onClick={() => handleSuggest('hook')}
              disabled={suggesting === 'hook'}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
            >
              {suggesting === 'hook' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Regenerate
            </button>
          </div>
          <textarea
            className={`${inputClass} min-h-24`}
            value={form.heroHook}
            onChange={(event) => patch({ heroHook: event.target.value })}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className={`block ${labelClass}`}>Moods</span>
              <p className="text-[11px] text-[#8A6E5F]">Tags, growth areas and life phase</p>
            </div>
            <button
              type="button"
              onClick={() => handleSuggest('moods')}
              disabled={suggesting === 'moods'}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
            >
              {suggesting === 'moods' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Regenerate
            </button>
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
              Tags
            </span>
            <ChipList
              items={form.tags}
              onChange={(tags) => patch({ tags })}
              placeholder="Add a tag and press Enter"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
              Growth areas
            </span>
            <ChipList
              items={form.growthAreas}
              onChange={(growthAreas) => patch({ growthAreas })}
              placeholder="Add a growth area and press Enter"
            />
          </div>
          <input
            className={inputClass}
            placeholder="Life phase"
            value={form.lifePhase}
            onChange={(event) => patch({ lifePhase: event.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#E6DFDA] pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => save()}
            disabled={!isDirty || isSaving}
            className="border-[#D1C7BD] bg-white text-[#5C4D43]"
          >
            {isSaving ? 'Saving…' : 'Save card'}
          </Button>
          {isDirty ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#E6DFDA] bg-white px-3 py-2 text-sm text-[#5C4D43]"
            >
              <Undo2 size={14} /> Discard
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StoryCardTab;
