/**
 * View model for the central publication dashboard.
 *
 * One publication == one story. The backend spreads what the overview needs across
 * `/admin/moderation/queue` (title, cover, moderation status) and
 * `/admin/voice-review` (audio, duration, updated_at), so the adapter merges both
 * into `PublicationRow` before anything renders.
 */

/** The full status ladder the client asked for. */
export type PublicationStatus =
  | 'missing'
  | 'pending'
  | 'in_progress'
  | 'ready_for_review'
  | 'approved'
  | 'rejected'
  | 'published';

export type PublicationType = 'confession' | 'meditation' | 'journey';

/** `moderation_status` as the admin API serialises it, lowercased. */
export type ModerationStatus = 'pending' | 'flagged' | 'approved' | 'rejected';

export type PublicationStatuses = {
  text: PublicationStatus;
  cover: PublicationStatus;
  voice: PublicationStatus;
  overall: PublicationStatus;
};

/** One row/card in the overview. */
export type PublicationRow = PublicationStatuses & {
  id: string;
  title: string;
  type: PublicationType;
  typeLabel: string;
  coverImageUrl: string | null;
  /** Pseudonym when we have one, otherwise the account email. */
  author: string;
  /** True while we are falling back to the account email. */
  authorIsAccountEmail: boolean;
  submittedLabel: string;
  /** Epoch ms for sorting; 0 when the date could not be parsed. */
  submittedAt: number;
  updatedLabel: string | null;
  updatedAt: number;
  moderationStatus: ModerationStatus;
  audioPath: string | null;
  audioDuration: string | null;
  voiceName: string | null;
  hasNoVoice: boolean;
};

/** Everything the workspace needs, from `/admin/moderation/story/{id}`. */
export type PublicationDetail = {
  id: string;
  title: string;
  type: PublicationType;
  typeLabel: string;

  /* Content tab */
  storyInput: string;
  storyText: string;
  heroHook: string;
  heroTagline: string;
  editorialBrief: string;

  /* Story card tab */
  coverImageUrl: string | null;
  pseudonym: string;
  age: string;
  gender: string;
  sexualOrientation: string;
  occupation: string;
  /** Backend keeps city and country in one column; the UI splits it for editing. */
  location: string;
  explicit: boolean;
  tags: string[];
  growthAreas: string[];
  lifePhase: string;

  /* Voice tab */
  audioPath: string | null;
  voiceName: string;
  voiceId: string | null;
  submissionMode: string;
  /** Member uploaded their own narration, so the voice selection is locked. */
  isHumanNarrated: boolean;

  /* Character brief - private, never public */
  background: string;
  personality: string;
  lifestyle: string;
  situation: string;

  /** Admin-only contact. Never rendered inside the card preview. */
  accountEmail: string;

  moderationStatus: ModerationStatus;
  moderationNotes: string;
  submittedLabel: string;
};

/**
 * Review-only state for the actions the backend cannot persist yet.
 * Replaced by real columns in the follow-up backend PR; see
 * `src/lib/publications/capabilities.ts` for the full list.
 */
export type PublicationDraft = {
  contentApproved: boolean;
  coverApproved: boolean;
  voiceApproved: boolean;
  /** Publication intentionally ships without audio, so voice stops gating publish. */
  hasNoVoice: boolean;
  coverRegeneratedAt: number | null;
  voiceRegeneratedAt: number | null;
  /** Object URL of a locally picked file - dies on refresh, which is fine for review. */
  replacedCoverUrl: string | null;
  replacedCoverName: string | null;
  replacedAudioUrl: string | null;
  replacedAudioName: string | null;
  city: string | null;
  country: string | null;
};

export const emptyPublicationDraft = (): PublicationDraft => ({
  contentApproved: false,
  coverApproved: false,
  voiceApproved: false,
  hasNoVoice: false,
  coverRegeneratedAt: null,
  voiceRegeneratedAt: null,
  replacedCoverUrl: null,
  replacedCoverName: null,
  replacedAudioUrl: null,
  replacedAudioName: null,
  city: null,
  country: null,
});
