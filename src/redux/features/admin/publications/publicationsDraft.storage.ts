import { emptyPublicationDraft, type PublicationDraft } from '@/types/publication.types';

const STORAGE_KEY = 'publications-review-draft:v1';

export type DraftEntries = Record<string, PublicationDraft>;

/**
 * Object URLs from locally picked files are dead after a reload, so they are
 * dropped before persisting instead of pointing the UI at a broken blob.
 */
const withoutObjectUrls = (draft: PublicationDraft): PublicationDraft => ({
  ...draft,
  replacedCoverUrl: null,
  replacedAudioUrl: null,
});

export const loadDraftEntries = (): DraftEntries => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};

    const entries: DraftEntries = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        entries[id] = { ...emptyPublicationDraft(), ...(value as Partial<PublicationDraft>) };
      }
    }
    return entries;
  } catch {
    return {};
  }
};

export const saveDraftEntries = (entries: DraftEntries): void => {
  if (typeof window === 'undefined') return;
  try {
    const persistable = Object.fromEntries(
      Object.entries(entries).map(([id, draft]) => [id, withoutObjectUrls(draft)]),
    );
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    /* storage full or blocked - review state is disposable, so ignore */
  }
};

export const clearDraftEntries = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};
