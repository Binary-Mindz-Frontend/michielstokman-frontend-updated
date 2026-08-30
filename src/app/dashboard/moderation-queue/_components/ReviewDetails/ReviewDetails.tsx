'use client';

import img from '@/assets/shared/table_placeholder_image.jpg';
import { Button } from '@/components/ui/button';
import { useGetVoicesQuery } from '@/redux/features/aiStory/aiStory.api';
import {
  useApproveStoryMutation,
  useGetStoryDetailsQuery,
  useRequestStoryChangesMutation,
  useSuggestStoryFieldMutation,
  useUpdateStoryMutation,
  type ModerationSuggestField,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import { Loader2, RefreshCw, Volume2, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteAction, RejectAction } from '../ApproveAction/ApproveAction';

interface ReviewDetailsProps {
  id: string;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  onClose?: () => void;
}

type DeskDraft = {
  title: string;
  story_type: string;
  story_text: string;
  hero_hook: string;
  hero_tagline: string;
  editorial_brief: string;
  first_name: string;
  location: string;
  gender: string;
  sexual_orientation: string;
  occupation: string;
  age: string;
  tags: string;
  growth_areas: string;
  life_phase: string;
  high_intensity: boolean;
  voice_name: string;
  changeNote: string;
};

const emptyDraft = (): DeskDraft => ({
  title: '',
  story_type: 'confession',
  story_text: '',
  hero_hook: '',
  hero_tagline: '',
  editorial_brief: '',
  first_name: '',
  location: '',
  gender: '',
  sexual_orientation: '',
  occupation: '',
  age: '',
  tags: '',
  growth_areas: '',
  life_phase: '',
  high_intensity: false,
  voice_name: '',
  changeNote: '',
});

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function joinList(value: unknown): string {
  return asStringList(value).join(', ');
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string' && item.trim()) return [item.trim()];
      if (item && typeof item === 'object') {
        const rec = item as Record<string, unknown>;
        const name = rec.name ?? rec.label ?? rec.tag;
        if (typeof name === 'string' && name.trim()) return [name.trim()];
      }
      return [];
    });
  }
  if (typeof value === 'string' && value.trim()) {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        return asStringList(JSON.parse(trimmed));
      } catch {
        /* fall through */
      }
    }
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

function suggestionPayload(res: unknown): Record<string, unknown> {
  if (!res || typeof res !== 'object') return {};
  const body = res as Record<string, unknown>;
  if (body.data && typeof body.data === 'object') return body.data as Record<string, unknown>;
  return body;
}

function ChipList({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  onChange: (list: string) => void;
  placeholder: string;
}) {
  const items = splitList(value);
  const [draft, setDraft] = useState('');

  const add = () => {
    const next = draft.trim();
    if (!next) return;
    if (!items.includes(next)) onChange([...items, next].join(', '));
    setDraft('');
  };

  return (
    <div className="space-y-2">
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(items.filter((entry) => entry !== item).join(', '))}
              className="inline-flex items-center gap-1 rounded-full border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5C3A21]"
            >
              {item}
              <X size={10} />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-[#8A6E5F]">No values yet — regenerate or type below.</p>
      )}
      <input
        className="w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40"
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          }
        }}
      />
    </div>
  );
}

function normalizeStoryType(value?: string | null): string {
  const raw = (value || '').toLowerCase();
  if (raw.startsWith('meditat')) return 'meditation';
  return 'confession';
}

function storyFromApi(story: Record<string, unknown> | undefined): DeskDraft {
  const draft = emptyDraft();
  if (!story) return draft;
  draft.title = String(story.title || '');
  draft.story_type = normalizeStoryType(story.story_type as string);
  draft.story_text = String(story.story_text || '');
  draft.hero_hook = String(story.hero_hook || '');
  draft.hero_tagline = String(story.hero_tagline || '');
  draft.editorial_brief = String(story.editorial_brief || '');
  draft.first_name = String(story.first_name || '');
  draft.location = String(story.location || '');
  draft.gender = String(story.gender || '');
  draft.sexual_orientation = String(story.sexual_orientation || '');
  draft.occupation = String(story.occupation || '');
  draft.age = story.age === null || story.age === undefined ? '' : String(story.age);
  draft.tags = joinList(story.tags);
  draft.growth_areas = joinList(story.growth_areas);
  draft.life_phase = String(story.life_phase || '');
  draft.high_intensity = Boolean(story.high_intensity);
  draft.voice_name = String(story.voice_name || '');
  return draft;
}

function AiCard({
  title,
  hint,
  onRegenerate,
  regenerating,
  children,
}: {
  title: string;
  hint: string;
  onRegenerate: () => void;
  regenerating: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="block text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            {title}
          </span>
          <p className="text-[11px] text-[#8A6E5F]">{hint}</p>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#E1D7CE] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
        >
          {regenerating ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Regenerate
        </button>
      </div>
      {children}
    </div>
  );
}

export const ReviewDetails = ({ id, onClose }: ReviewDetailsProps) => {
  const { data, isLoading } = useGetStoryDetailsQuery(id);
  const story = data?.data as Record<string, unknown> | undefined;

  if (isLoading || !story) {
    return (
      <div className="mx-auto flex max-w-4xl animate-pulse flex-col gap-6 p-2">
        <div className="h-24 w-full rounded-xl bg-neutral-200" />
        <div className="h-40 w-full rounded-xl bg-neutral-200" />
      </div>
    );
  }

  return <ReviewDesk id={id} story={story} onClose={onClose} />;
};

function ReviewDesk({
  id,
  story,
  onClose,
}: {
  id: string;
  story: Record<string, unknown>;
  onClose?: () => void;
}) {
  const [draft, setDraft] = useState<DeskDraft>(() => storyFromApi(story));
  const [suggesting, setSuggesting] = useState<ModerationSuggestField | null>(null);
  const [confirmAction, setConfirmAction] = useState<'reject' | 'remove' | null>(null);
  const [showBrief, setShowBrief] = useState(() =>
    Boolean(story.background || story.personality || story.lifestyle || story.situation),
  );

  const [updateStory, { isLoading: isSaving }] = useUpdateStoryMutation();
  const [suggestField] = useSuggestStoryFieldMutation();
  const [requestChanges, { isLoading: isRequesting }] = useRequestStoryChangesMutation();
  const [approveStory, { isLoading: isApproving }] = useApproveStoryMutation();
  const { data: voicesCatalog } = useGetVoicesQuery();

  const isHumanReady = story.submission_mode === 'human_ready';
  const catalogVoices = useMemo(
    () => (voicesCatalog?.voices || []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesCatalog],
  );

  const patch = (partial: Partial<DeskDraft>) => setDraft((prev) => ({ ...prev, ...partial }));

  const persistPayload = () => {
    const parsedAge = Number(draft.age);
    return {
      storyId: id,
      title: draft.title,
      story_type: draft.story_type,
      story_text: draft.story_text,
      hero_hook: draft.hero_hook,
      hero_tagline: draft.hero_tagline,
      editorial_brief: draft.editorial_brief,
      first_name: draft.first_name,
      location: draft.location,
      gender: draft.gender,
      sexual_orientation: draft.sexual_orientation,
      occupation: draft.occupation,
      age: draft.age.trim() !== '' && Number.isFinite(parsedAge) ? parsedAge : undefined,
      tags: splitList(draft.tags),
      growth_areas: splitList(draft.growth_areas),
      life_phase: draft.life_phase,
      high_intensity: draft.high_intensity,
      ...(isHumanReady ? {} : { voice_name: draft.voice_name || undefined }),
    };
  };

  const handleSave = async () => {
    try {
      const res = await updateStory(persistPayload()).unwrap();
      if (res.success) toast.success('Saved');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || 'Failed to save');
    }
  };

  const handleSuggest = async (field: ModerationSuggestField) => {
    setSuggesting(field);
    try {
      const res = await suggestField({ storyId: id, field }).unwrap();
      const suggestion = suggestionPayload(res);
      let applied = false;

      if (field === 'hook') {
        const value = String(suggestion.hero_hook || '').trim();
        if (value) {
          patch({ hero_hook: value });
          applied = true;
        }
      }
      if (field === 'tagline') {
        const value = String(suggestion.hero_tagline || '').trim();
        if (value) {
          patch({ hero_tagline: value });
          applied = true;
        }
      }
      if (field === 'moods') {
        const tags = asStringList(suggestion.tags);
        const growth = asStringList(suggestion.growth_areas);
        const life = String(suggestion.life_phase || '').trim();
        if (tags.length || growth.length || life) {
          setDraft((prev) => ({
            ...prev,
            ...(tags.length ? { tags: tags.join(', ') } : {}),
            ...(growth.length ? { growth_areas: growth.join(', ') } : {}),
            ...(life ? { life_phase: life } : {}),
          }));
          applied = true;
        }
      }
      if (field === 'analysis') {
        const value = String(suggestion.editorial_brief || '').trim();
        if (value) {
          patch({ editorial_brief: value });
          applied = true;
        }
      }
      if (field === 'voice') {
        const value = String(suggestion.voice_name || '').trim();
        if (value) {
          patch({ voice_name: value });
          applied = true;
        }
      }

      if (!applied) {
        toast.error('Nothing was filled — try regenerate again');
        return;
      }
      toast.success('Filled — edit in place, then save');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string; detail?: string } }).data?.message ||
            (err as { data?: { detail?: string } }).data?.detail
          : undefined;
      toast.error(message || 'Could not generate a suggestion');
    } finally {
      setSuggesting(null);
    }
  };

  const handleRequestChanges = async () => {
    if (!draft.changeNote.trim()) {
      toast.error('Write a short note the member will see');
      return;
    }
    try {
      await updateStory(persistPayload()).unwrap();
      const res = await requestChanges({
        storyId: id,
        reason: draft.changeNote.trim(),
      }).unwrap();
      if (res.success) toast.success('Changes requested');
      onClose?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || 'Failed to request changes');
    }
  };

  const handleApprove = async () => {
    try {
      await updateStory(persistPayload()).unwrap();
      const note = draft.changeNote.trim();
      const res = await approveStory({
        storyId: id,
        notes: note || undefined,
      }).unwrap();
      if (res.success) toast.success(res.message || 'Approved');
      onClose?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || 'Save failed — approve cancelled');
    }
  };

  const inputClass =
    'w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40';

  return (
    <div className="flex min-h-[70vh] flex-col justify-between gap-4">
      <div className="space-y-4 pr-1">
        {typeof story?.cover_image_url === 'string' && story.cover_image_url ? (
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-[#E6DFDA]">
            <Image src={story.cover_image_url || img} alt="Cover" fill className="object-cover" />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#301C05] px-2.5 py-1 text-[10px] font-bold text-white uppercase">
            {isHumanReady ? 'Your narration' : 'Studio Voice'}
          </span>
          <span className="text-xs text-[#8A6E5F]">{String(story?.author || '')}</span>
        </div>

        {typeof story?.audio_path === 'string' && story.audio_path ? (
          <div className="rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-3">
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              <Volume2 size={14} /> Listen
            </span>
            <audio controls src={story.audio_path} className="h-10 w-full accent-[#BF7758]" />
            {isHumanReady ? (
              <p className="mt-2 text-[11px] text-[#8A6E5F]">
                Uploaded recording is locked. Edit text only.
              </p>
            ) : null}
          </div>
        ) : null}

        <label className="block space-y-1">
          <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Title
          </span>
          <input
            className={inputClass}
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              Type
            </span>
            <select
              className={inputClass}
              value={draft.story_type}
              onChange={(e) => patch({ story_type: e.target.value })}
            >
              <option value="confession">Confession</option>
              <option value="meditation">Meditation</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm text-[#5C3A21]">
            <input
              type="checkbox"
              checked={draft.high_intensity}
              onChange={(e) => patch({ high_intensity: e.target.checked })}
            />
            High intensity
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Piece
          </span>
          <textarea
            className={`${inputClass} min-h-40 font-serif leading-relaxed`}
            value={draft.story_text}
            onChange={(e) => patch({ story_text: e.target.value })}
          />
        </label>

        <AiCard
          title="Public tagline"
          hint="Brush line on the public hero"
          regenerating={suggesting === 'tagline'}
          onRegenerate={() => handleSuggest('tagline')}
        >
          <textarea
            className={`${inputClass} min-h-16`}
            value={draft.hero_tagline}
            onChange={(e) => patch({ hero_tagline: e.target.value })}
          />
        </AiCard>

        <AiCard
          title="First sentences"
          hint="Hook / summary listeners see first"
          regenerating={suggesting === 'hook'}
          onRegenerate={() => handleSuggest('hook')}
        >
          <textarea
            className={`${inputClass} min-h-24`}
            value={draft.hero_hook}
            onChange={(e) => patch({ hero_hook: e.target.value })}
          />
        </AiCard>

        <AiCard
          title="Moods"
          hint="Regenerate fills chips — click a chip to remove, or type to add"
          regenerating={suggesting === 'moods'}
          onRegenerate={() => handleSuggest('moods')}
        >
          <div className="space-y-3">
            <div>
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                Tags
              </span>
              <ChipList
                value={draft.tags}
                onChange={(tags) => patch({ tags })}
                placeholder="Add a tag and press Enter"
              />
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                Growth areas
              </span>
              <ChipList
                value={draft.growth_areas}
                onChange={(growth_areas) => patch({ growth_areas })}
                placeholder="Add a growth area and press Enter"
              />
            </div>
            <input
              className={inputClass}
              placeholder="Life phase"
              value={draft.life_phase}
              onChange={(e) => patch({ life_phase: e.target.value })}
            />
          </div>
        </AiCard>

        <AiCard
          title="Analysis"
          hint="Private editorial note — not public"
          regenerating={suggesting === 'analysis'}
          onRegenerate={() => handleSuggest('analysis')}
        >
          <textarea
            className={`${inputClass} min-h-24`}
            value={draft.editorial_brief}
            onChange={(e) => patch({ editorial_brief: e.target.value })}
          />
        </AiCard>

        <div className="space-y-2 rounded-xl border border-[#F0EAE5] p-3">
          <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Identity
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              placeholder="Name"
              value={draft.first_name}
              onChange={(e) => patch({ first_name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={draft.location}
              onChange={(e) => patch({ location: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Gender"
              value={draft.gender}
              onChange={(e) => patch({ gender: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Orientation"
              value={draft.sexual_orientation}
              onChange={(e) => patch({ sexual_orientation: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Occupation"
              value={draft.occupation}
              onChange={(e) => patch({ occupation: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Age"
              value={draft.age}
              onChange={(e) => patch({ age: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowBrief((open) => !open)}
            className="text-[11px] font-semibold text-[#BF7758]"
          >
            {showBrief ? 'Hide character brief' : 'More — character brief'}
          </button>
          {showBrief ? (
            <div className="space-y-1 text-sm text-[#4A3B32]">
              {story?.background ? (
                <p>
                  <strong>Background:</strong> {String(story.background)}
                </p>
              ) : null}
              {story?.personality ? (
                <p>
                  <strong>Personality:</strong> {String(story.personality)}
                </p>
              ) : null}
              {story?.lifestyle ? (
                <p>
                  <strong>Lifestyle:</strong> {String(story.lifestyle)}
                </p>
              ) : null}
              {story?.situation ? (
                <p>
                  <strong>Situation:</strong> {String(story.situation)}
                </p>
              ) : null}
              {!story?.background &&
              !story?.personality &&
              !story?.lifestyle &&
              !story?.situation ? (
                <p className="text-xs text-[#8A6E5F]">No brief on this piece.</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-2 rounded-xl border border-[#F0EAE5] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              Voice
            </span>
            {!isHumanReady ? (
              <button
                type="button"
                onClick={() => handleSuggest('voice')}
                disabled={suggesting === 'voice'}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BF7758]"
              >
                {suggesting === 'voice' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                AI pick
              </button>
            ) : null}
          </div>
          {isHumanReady ? (
            <p className="text-sm text-[#8A6E5F]">
              {draft.voice_name || 'Member recording'} — locked
            </p>
          ) : (
            <>
              <select
                className={inputClass}
                value={draft.voice_name}
                onChange={(e) => patch({ voice_name: e.target.value })}
              >
                <option value="">Keep current</option>
                {catalogVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.label}
                  </option>
                ))}
                {draft.voice_name &&
                !catalogVoices.some((voice) => voice.name === draft.voice_name) ? (
                  <option value={draft.voice_name}>{draft.voice_name}</option>
                ) : null}
              </select>
              <p className="text-[11px] text-[#8A6E5F]">
                Saves the voice name. Re-narrate in Voice Review to update audio.
              </p>
            </>
          )}
        </div>

        {typeof story?.story_input === 'string' && story.story_input ? (
          <details className="rounded-xl border border-[#EDE7E1] bg-[#FAF8F6] p-3 text-sm text-[#614E43]">
            <summary className="cursor-pointer text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
              Original input
            </summary>
            <p className="mt-2 whitespace-pre-line italic">{story.story_input}</p>
          </details>
        ) : null}

        <label className="block space-y-1">
          <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Note to member
          </span>
          <textarea
            className={`${inputClass} min-h-16`}
            placeholder="Required for request changes. Optional on approve."
            value={draft.changeNote}
            onChange={(e) => patch({ changeNote: e.target.value })}
          />
        </label>
      </div>

      {confirmAction === 'reject' ? (
        <div className="rounded-xl border border-[#E5CDCD] bg-[#FFF8F8] p-4">
          <RejectAction id={id} onSuccess={() => onClose?.()} />
        </div>
      ) : null}
      {confirmAction === 'remove' ? (
        <div className="rounded-xl border border-[#E5CDCD] bg-[#FFF8F8] p-4">
          <DeleteAction id={id} onSuccess={() => onClose?.()} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E6DFDA] pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="border-[#D1C7BD] bg-white text-[#5C4D43]"
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
        <button
          type="button"
          onClick={handleRequestChanges}
          disabled={isRequesting || isSaving}
          className="cursor-pointer rounded-md border border-[#E6DFDA] bg-[#F5EFEA] px-4 py-2 text-sm font-medium text-[#5C3A21]"
        >
          {isRequesting ? 'Sending…' : 'Request changes'}
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={isSaving || isApproving}
          className="bg-success cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          {isApproving ? 'Approving…' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmAction((current) => (current === 'reject' ? null : 'reject'))}
          className="cursor-pointer rounded-md bg-[#C82323] px-4 py-2 text-sm font-medium text-white"
        >
          {confirmAction === 'reject' ? 'Cancel reject' : 'Reject'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmAction((current) => (current === 'remove' ? null : 'remove'))}
          className="cursor-pointer rounded-md border border-[#E5CDCD] bg-[#FFF5F5] px-4 py-2 text-sm font-medium text-[#A80000]"
        >
          {confirmAction === 'remove' ? 'Cancel remove' : 'Remove'}
        </button>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-[#D1C7BD] bg-white px-4 py-2 text-sm font-medium text-[#5C4D43]"
          >
            Back to queue
          </button>
        ) : null}
      </div>
    </div>
  );
}
