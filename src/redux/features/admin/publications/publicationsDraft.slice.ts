import type { RootState } from '@/redux/store';
import { emptyPublicationDraft, type PublicationDraft } from '@/types/publication.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DraftEntries } from './publicationsDraft.storage';

/**
 * Holds the review-only half of a publication: the per-asset approvals, locally
 * picked replacement files and the city/country split, none of which the backend
 * can store yet. Persisted to sessionStorage so a reload mid-review does not wipe
 * the walkthrough. Delete this slice once the real columns exist.
 */
type PublicationsDraftState = {
  entries: DraftEntries;
  hydrated: boolean;
};

const initialState: PublicationsDraftState = {
  entries: {},
  hydrated: false,
};

const entryFor = (state: PublicationsDraftState, id: string): PublicationDraft => {
  if (!state.entries[id]) state.entries[id] = emptyPublicationDraft();
  return state.entries[id];
};

type ApprovalKey = 'contentApproved' | 'coverApproved' | 'voiceApproved';

const publicationsDraftSlice = createSlice({
  name: 'publicationsDraft',
  initialState,
  reducers: {
    hydrateDrafts: (state, action: PayloadAction<DraftEntries>) => {
      state.entries = action.payload;
      state.hydrated = true;
    },

    setApproval: (
      state,
      action: PayloadAction<{ id: string; key: ApprovalKey; value: boolean }>,
    ) => {
      const { id, key, value } = action.payload;
      const entry = entryFor(state, id);
      entry[key] = value;
      // Approving settles whichever regeneration was in flight.
      if (value && key === 'coverApproved') entry.coverRegeneratedAt = null;
      if (value && key === 'voiceApproved') entry.voiceRegeneratedAt = null;
    },

    setNoVoice: (state, action: PayloadAction<{ id: string; value: boolean }>) => {
      const entry = entryFor(state, action.payload.id);
      entry.hasNoVoice = action.payload.value;
      if (action.payload.value) {
        entry.voiceApproved = false;
        entry.voiceRegeneratedAt = null;
      }
    },

    markCoverRegenerated: (state, action: PayloadAction<{ id: string }>) => {
      const entry = entryFor(state, action.payload.id);
      entry.coverRegeneratedAt = Date.now();
      entry.coverApproved = false;
    },

    markVoiceRegenerated: (state, action: PayloadAction<{ id: string }>) => {
      const entry = entryFor(state, action.payload.id);
      entry.voiceRegeneratedAt = Date.now();
      entry.voiceApproved = false;
    },

    setReplacedCover: (
      state,
      action: PayloadAction<{ id: string; url: string | null; name: string | null }>,
    ) => {
      const entry = entryFor(state, action.payload.id);
      entry.replacedCoverUrl = action.payload.url;
      entry.replacedCoverName = action.payload.name;
      entry.coverApproved = false;
      entry.coverRegeneratedAt = null;
    },

    setReplacedAudio: (
      state,
      action: PayloadAction<{ id: string; url: string | null; name: string | null }>,
    ) => {
      const entry = entryFor(state, action.payload.id);
      entry.replacedAudioUrl = action.payload.url;
      entry.replacedAudioName = action.payload.name;
      entry.voiceApproved = false;
      entry.voiceRegeneratedAt = null;
    },

    setCityCountry: (
      state,
      action: PayloadAction<{ id: string; city: string; country: string }>,
    ) => {
      const entry = entryFor(state, action.payload.id);
      entry.city = action.payload.city;
      entry.country = action.payload.country;
    },

    resetPublicationDraft: (state, action: PayloadAction<{ id: string }>) => {
      delete state.entries[action.payload.id];
    },

    resetAllPublicationDrafts: (state) => {
      state.entries = {};
    },
  },
});

export const {
  hydrateDrafts,
  setApproval,
  setNoVoice,
  markCoverRegenerated,
  markVoiceRegenerated,
  setReplacedCover,
  setReplacedAudio,
  setCityCountry,
  resetPublicationDraft,
  resetAllPublicationDrafts,
} = publicationsDraftSlice.actions;

export default publicationsDraftSlice.reducer;

const EMPTY_DRAFT = emptyPublicationDraft();

export const selectPublicationDrafts = (state: RootState): DraftEntries =>
  state.publicationsDraft.entries;

export const selectPublicationDraft =
  (id: string) =>
  (state: RootState): PublicationDraft =>
    state.publicationsDraft.entries[id] ?? EMPTY_DRAFT;

export const selectDraftCount = (state: RootState): number =>
  Object.values(state.publicationsDraft.entries).filter((draft) =>
    Boolean(
      draft.contentApproved ||
      draft.coverApproved ||
      draft.voiceApproved ||
      draft.hasNoVoice ||
      draft.replacedCoverName ||
      draft.replacedAudioName,
    ),
  ).length;
