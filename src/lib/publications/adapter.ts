import {
  type PublicationContact,
  type PublicationDetail,
  type PublicationRow,
  type PublicationType,
} from '@/types/publication.types';
import { resolveMediaUrl } from './media';
import { normalizeModerationStatus, readPublicationStatuses } from './status';

type Raw = Record<string, unknown>;

const str = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const nullableStr = (value: unknown): string | null => str(value) || null;

const nullableInt = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Legacy rows only have `location`. Admin edits city/country, so when those are
 * empty we recover them from the last comma in `location` — same rule as the
 * backend migration / create_story path.
 */
export const splitLocation = (location: unknown): { city: string; country: string } => {
  const text = str(location);
  if (!text) return { city: '', country: '' };
  const comma = text.lastIndexOf(',');
  if (comma < 0) return { city: text, country: '' };
  return {
    city: text.slice(0, comma).trim(),
    country: text.slice(comma + 1).trim(),
  };
};

const resolvePlace = (raw: Raw): { city: string; country: string } => {
  const city = str(raw.city);
  const country = str(raw.country);
  if (city || country) return { city, country };
  return splitLocation(raw.location);
};

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
 * `submitted_at` and `updated_at` are ISO, but `created_at` is still the legacy
 * `"07 Sep 26"` display string, so both shapes need to survive the trip to a
 * sortable number.
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

const mapQueueItem = (raw: Raw): PublicationRow | null => {
  const id = str(raw.id);
  if (!id) return null;

  const type = normalizePublicationType(raw.story_type);
  const pseudonym = str(raw.first_name);
  const accountEmail = str(raw.author);
  const submittedSource = raw.submitted_at ?? raw.created_at;
  const submittedAt = parseApiDate(submittedSource);
  const updatedAt = parseApiDate(raw.updated_at);

  return {
    ...readPublicationStatuses(raw),
    id,
    title: str(raw.title) || 'Untitled',
    type,
    typeLabel: PUBLICATION_TYPE_LABEL[type],
    coverImageUrl: resolveMediaUrl(str(raw.cover_image_url)),
    author: pseudonym || accountEmail || '—',
    authorIsAccountEmail: !pseudonym && Boolean(accountEmail),
    submittedLabel: formatDateLabel(submittedSource),
    submittedAt,
    updatedLabel: raw.updated_at ? formatDateLabel(raw.updated_at) : null,
    updatedAt: updatedAt || submittedAt,
    moderationStatus: normalizeModerationStatus(raw.moderation_status),
    audioPath: resolveMediaUrl(str(raw.audio_path)),
    audioDuration: nullableStr(raw.audio_duration),
    voiceName: nullableStr(raw.voice_name),
    voiceNotRequired: Boolean(raw.voice_not_required),
    hasText: Boolean(raw.has_text),
    explicit: Boolean(raw.high_intensity),
  };
};

/** One row per publication, straight off the queue payload. */
export const buildPublicationRows = (queueItems: unknown): PublicationRow[] => {
  if (!Array.isArray(queueItems)) return [];

  return queueItems.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const row = mapQueueItem(entry as Raw);
    return row ? [row] : [];
  });
};

const mapContact = (raw: unknown): PublicationContact | null => {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Raw;
  const email = str(record.email);
  const trueName = str(record.true_name);
  if (!email && !trueName) return null;
  return { email, trueName };
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

    coverImageUrl: resolveMediaUrl(str(raw.cover_image_url)),
    pseudonym: str(raw.first_name),
    age: raw.age === null || raw.age === undefined ? '' : str(raw.age),
    gender: str(raw.gender),
    sexualOrientation: str(raw.sexual_orientation),
    occupation: str(raw.occupation),
    ...resolvePlace(raw),
    explicit: Boolean(raw.high_intensity),
    tags: asStringList(raw.tags),
    growthAreas: asStringList(raw.growth_areas),
    lifePhase: str(raw.life_phase),

    audioPath: resolveMediaUrl(str(raw.audio_path)),
    audioDurationSeconds: nullableInt(raw.audio_duration_seconds),
    voiceName: str(raw.voice_name),
    voiceId: nullableStr(raw.voice_id),
    submissionMode,
    isHumanNarrated: submissionMode === 'human_ready',
    voiceNotRequired: Boolean(raw.voice_not_required),

    background: str(raw.background),
    personality: str(raw.personality),
    lifestyle: str(raw.lifestyle),
    situation: str(raw.situation),

    contact: mapContact(raw.contact),

    statuses: readPublicationStatuses(raw),
    publishBlockers: asStringList(raw.publish_blockers),
    publishedAt: nullableStr(raw.published_at),

    moderationStatus: normalizeModerationStatus(raw.moderation_status),
    moderationNotes: str(raw.moderation_notes),
    submittedLabel: formatDateLabel(raw.submitted_at ?? raw.created_at),
  };
};
