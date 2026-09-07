import {
  emptyPublicationDraft,
  type PublicationDetail,
  type PublicationDraft,
  type PublicationRow,
  type PublicationType,
} from '@/types/publication.types';
import { derivePublicationStatuses, normalizeModerationStatus } from './status';

type Raw = Record<string, unknown>;

const str = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const nullableStr = (value: unknown): string | null => str(value) || null;

/** Tags and growth areas arrive as arrays, JSON strings or comma strings. */
export const asStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string' && item.trim()) return [item.trim()];
      if (item && typeof item === 'object') {
        const record = item as Raw;
        const name = record.name ?? record.label ?? record.tag;
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
        /* fall through to comma split */
      }
    }
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
};

export const normalizePublicationType = (value: unknown): PublicationType => {
  const raw = str(value).toLowerCase().replace('storytype.', '');
  if (raw.startsWith('meditat')) return 'meditation';
  if (raw.startsWith('journey') || raw.startsWith('liberat')) return 'journey';
  return 'confession';
};

export const PUBLICATION_TYPE_LABEL: Record<PublicationType, string> = {
  confession: 'Confession',
  meditation: 'Meditation',
  journey: 'Liberation',
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * The queue serialises dates as `"07 Sep 26"` and the voice list as ISO, so both
 * need to survive the trip to a sortable number.
 */
export const parseApiDate = (value: unknown): number => {
  const raw = str(value);
  if (!raw) return 0;

  const short = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2,4})$/);
  if (short) {
    const day = Number(short[1]);
    const month = MONTHS.indexOf(short[2].toLowerCase());
    const yearPart = Number(short[3]);
    const year = yearPart < 100 ? 2000 + yearPart : yearPart;
    if (month >= 0) return Date.UTC(year, month, day);
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const DATE_LABEL = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export const formatDateLabel = (value: unknown): string => {
  const epoch = parseApiDate(value);
  if (!epoch) return str(value) || '—';
  return DATE_LABEL.format(new Date(epoch));
};

type QueueItem = {
  id: string;
  title: string;
  type: PublicationType;
  coverImageUrl: string | null;
  accountEmail: string;
  pseudonym: string;
  submittedLabel: string;
  submittedAt: number;
  moderationStatus: ReturnType<typeof normalizeModerationStatus>;
};

const mapQueueItem = (raw: Raw): QueueItem | null => {
  const id = str(raw.id);
  if (!id) return null;

  return {
    id,
    title: str(raw.title) || 'Untitled',
    type: normalizePublicationType(raw.story_type),
    coverImageUrl: nullableStr(raw.cover_image_url),
    accountEmail: str(raw.author),
    // Not in the queue payload today; read it anyway so the fallback disappears
    // the moment the backend adds it.
    pseudonym: str(raw.first_name),
    submittedLabel: formatDateLabel(raw.created_at),
    submittedAt: parseApiDate(raw.created_at),
    moderationStatus: normalizeModerationStatus(raw.moderation_status),
  };
};

/** The half of a publication that only the voice-review endpoint knows about. */
export type PublicationVoiceMeta = {
  audioPath: string | null;
  audioDuration: string | null;
  voiceName: string | null;
  updatedLabel: string | null;
  updatedAt: number;
};

const mapVoiceItem = (raw: Raw): PublicationVoiceMeta => ({
  audioPath: nullableStr(raw.audio_path),
  audioDuration: nullableStr(raw.audio_duration),
  voiceName: nullableStr(raw.voice_name),
  updatedLabel: raw.updated_at ? formatDateLabel(raw.updated_at) : null,
  updatedAt: parseApiDate(raw.updated_at),
});

export const indexVoiceItems = (items: unknown): Map<string, PublicationVoiceMeta> => {
  const map = new Map<string, PublicationVoiceMeta>();
  if (!Array.isArray(items)) return map;
  for (const entry of items) {
    if (!entry || typeof entry !== 'object') continue;
    const raw = entry as Raw;
    const id = str(raw.id);
    if (id) map.set(id, mapVoiceItem(raw));
  }
  return map;
};

/**
 * Merge the moderation queue with the voice-review list into one row per publication.
 * The voice list is the only place audio, duration and `updated_at` exist today.
 */
export const buildPublicationRows = ({
  queueItems,
  voiceItems,
  drafts,
}: {
  queueItems: unknown;
  voiceItems: unknown;
  drafts: Record<string, PublicationDraft | undefined>;
}): PublicationRow[] => {
  if (!Array.isArray(queueItems)) return [];
  const voices = indexVoiceItems(voiceItems);

  return queueItems.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const item = mapQueueItem(entry as Raw);
    if (!item) return [];

    const voice = voices.get(item.id);
    const draft = drafts[item.id] ?? emptyPublicationDraft();
    const audioPath = voice?.audioPath ?? null;

    const statuses = derivePublicationStatuses({
      moderationStatus: item.moderationStatus,
      coverImageUrl: item.coverImageUrl,
      audioPath,
      draft,
    });

    const row: PublicationRow = {
      ...statuses,
      id: item.id,
      title: item.title,
      type: item.type,
      typeLabel: PUBLICATION_TYPE_LABEL[item.type],
      coverImageUrl: draft.replacedCoverUrl ?? item.coverImageUrl,
      author: item.pseudonym || item.accountEmail || '—',
      authorIsAccountEmail: !item.pseudonym && Boolean(item.accountEmail),
      submittedLabel: item.submittedLabel,
      submittedAt: item.submittedAt,
      updatedLabel: voice?.updatedLabel ?? null,
      updatedAt: voice?.updatedAt || item.submittedAt,
      moderationStatus: item.moderationStatus,
      audioPath,
      audioDuration: voice?.audioDuration ?? null,
      voiceName: voice?.voiceName ?? null,
      hasNoVoice: draft.hasNoVoice,
    };
    return [row];
  });
};

export const mapPublicationDetail = (raw: Raw | undefined): PublicationDetail | null => {
  if (!raw) return null;
  const id = str(raw.id);
  if (!id) return null;

  const type = normalizePublicationType(raw.story_type);
  const submissionMode = str(raw.submission_mode);

  return {
    id,
    title: str(raw.title) || 'Untitled',
    type,
    typeLabel: PUBLICATION_TYPE_LABEL[type],

    storyInput: str(raw.story_input),
    storyText: str(raw.story_text),
    heroHook: str(raw.hero_hook),
    heroTagline: str(raw.hero_tagline),
    editorialBrief: str(raw.editorial_brief),

    coverImageUrl: nullableStr(raw.cover_image_url),
    pseudonym: str(raw.first_name),
    age: raw.age === null || raw.age === undefined ? '' : str(raw.age),
    gender: str(raw.gender),
    sexualOrientation: str(raw.sexual_orientation),
    occupation: str(raw.occupation),
    location: str(raw.location),
    explicit: Boolean(raw.high_intensity),
    tags: asStringList(raw.tags),
    growthAreas: asStringList(raw.growth_areas),
    lifePhase: str(raw.life_phase),

    audioPath: nullableStr(raw.audio_path),
    voiceName: str(raw.voice_name),
    voiceId: nullableStr(raw.voice_id),
    submissionMode,
    isHumanNarrated: submissionMode === 'human_ready',

    background: str(raw.background),
    personality: str(raw.personality),
    lifestyle: str(raw.lifestyle),
    situation: str(raw.situation),

    accountEmail: str(raw.author),

    moderationStatus: normalizeModerationStatus(raw.moderation_status),
    moderationNotes: str(raw.moderation_notes),
    submittedLabel: formatDateLabel(raw.created_at),
  };
};

/**
 * Backend keeps one `location` column. The card editor shows city and country
 * separately, so split on the last comma and rejoin on save.
 */
export const splitLocation = (
  location: string,
  draft: PublicationDraft,
): { city: string; country: string } => {
  if (draft.city !== null || draft.country !== null) {
    return { city: draft.city ?? '', country: draft.country ?? '' };
  }
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { city: '', country: '' };
  if (parts.length === 1) return { city: parts[0], country: '' };
  return { city: parts.slice(0, -1).join(', '), country: parts[parts.length - 1] };
};

export const joinLocation = (city: string, country: string): string =>
  [city.trim(), country.trim()].filter(Boolean).join(', ');
