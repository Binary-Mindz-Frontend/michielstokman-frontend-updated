'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  hydrateDrafts,
  selectPublicationDrafts,
} from '@/redux/features/admin/publications/publicationsDraft.slice';
import {
  loadDraftEntries,
  saveDraftEntries,
} from '@/redux/features/admin/publications/publicationsDraft.storage';
import { useEffect, useRef } from 'react';

/**
 * Keeps the review-only draft state in sessionStorage. Mounted once by the
 * publications layout; goes away with the rest of the draft shim.
 */
const PublicationsDraftSync = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectPublicationDrafts);
  const hydrated = useAppSelector((state) => state.publicationsDraft.hydrated);
  const skippedFirstSave = useRef(false);

  useEffect(() => {
    if (hydrated) return;
    dispatch(hydrateDrafts(loadDraftEntries()));
  }, [dispatch, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    // The hydrate pass itself must not write back over storage.
    if (!skippedFirstSave.current) {
      skippedFirstSave.current = true;
      return;
    }
    saveDraftEntries(entries);
  }, [entries, hydrated]);

  return null;
};

export default PublicationsDraftSync;
