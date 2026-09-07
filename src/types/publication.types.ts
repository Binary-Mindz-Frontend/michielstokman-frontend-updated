/**
 * View model for the central publication dashboard.
 *
 * One publication == one story, made of three assets: written content, story card
 * and voice. The backend tracks each asset's review state on the story row and
 * returns them on both `/admin/moderation/queue` and
 * `/admin/moderation/story/{id}`, so a row needs no merging or local guesswork.
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
  /** The single rung shown for the record as a whole. */
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
  /** Publication intentionally ships without audio. */
  voiceNotRequired: boolean;
  hasText: boolean;
  explicit: boolean;
};

/** The author's submitted contact details. Admin-only, never on a story card. */
export type PublicationContact = {
  email: string;
  trueName: string;
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
  city: string;
  country: string;
  explicit: boolean;
  tags: string[];
  growthAreas: string[];
  lifePhase: string;

  /* Voice tab */
  audioPath: string | null;
  audioDurationSeconds: number | null;
  voiceName: string;
  voiceId: string | null;
  submissionMode: string;
  /** Member uploaded their own narration, so the voice selection is locked. */
  isHumanNarrated: boolean;
  voiceNotRequired: boolean;

  /* Character brief - private, never public */
  background: string;
  personality: string;
  lifestyle: string;
  situation: string;

  /** Admin-only. Never rendered inside the card preview. */
  contact: PublicationContact | null;

  /* Review state */
  statuses: PublicationStatuses;
  /** Reasons Publish is unavailable, straight from the server. Empty means ready. */
  publishBlockers: string[];
  publishedAt: string | null;

  moderationStatus: ModerationStatus;
  moderationNotes: string;
  submittedLabel: string;
};
