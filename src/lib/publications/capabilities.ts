/**
 * Which publication actions the current backend can actually persist.
 *
 * `api`   - wired to a real endpoint, saved server-side.
 * `draft` - works in the UI but only in `publicationsDraft` (sessionStorage), so the
 *           complete flow can be reviewed before the backend exists.
 *
 * When an endpoint lands, flip its entry to `api` and wire the mutation. Nothing else
 * in the UI needs to change: every draft-only control reads its badge from here.
 */
export type Capability = 'api' | 'draft';

export const PUBLICATION_CAPABILITIES = {
  /* Content */
  saveText: 'api',
  suggestFields: 'api',
  requestChanges: 'api',
  rejectStory: 'api',
  approveContent: 'draft',

  /* Story card */
  saveCardFields: 'api',
  regenerateCover: 'draft',
  replaceCover: 'draft',
  approveCover: 'draft',
  splitCityCountry: 'draft',

  /* Voice */
  selectVoice: 'api',
  regenerateVoice: 'api',
  replaceAudio: 'draft',
  approveVoice: 'draft',
  markNoVoice: 'draft',

  /* Publication */
  publish: 'api',
  deleteStory: 'api',
} as const satisfies Record<string, Capability>;

export type PublicationAction = keyof typeof PUBLICATION_CAPABILITIES;

export const isDraftOnly = (action: PublicationAction): boolean =>
  PUBLICATION_CAPABILITIES[action] === 'draft';

/** True while any part of the review flow is still running on local state. */
export const HAS_DRAFT_ONLY_ACTIONS = Object.values(PUBLICATION_CAPABILITIES).some(
  (capability) => capability === 'draft',
);

/**
 * Backend work this UI implies. Kept next to the flags so the two never drift.
 * Rendered in the review banner so reviewers can see the gap without reading code.
 */
export const BACKEND_REQUIREMENTS = [
  'Columns: content_status, cover_status, voice_status, has_no_voice, published_at',
  'Split approve-content from publish (today /approve does both)',
  'Per-story cover regenerate + cover upload endpoints',
  'Audio upload/replace + voice approve endpoints',
  'Queue item fields: first_name, audio_path, updated_at, high_intensity',
  'Queue params: story_type, missing-asset filters, sort',
  'Split location into city and country',
  'Expose submitted contact details to admins only',
] as const;
