'use client';

import { joinLocation, splitLocation } from '@/lib/publications/adapter';
import {
  useUpdateStoryMutation,
  type ModerationStoryUpdate,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationDetail, PublicationDraft } from '@/types/publication.types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

/** Every field the admin PUT accepts, held as strings for the inputs. */
export type WorkspaceForm = {
  title: string;
  storyType: string;
  storyText: string;
  heroHook: string;
  heroTagline: string;
  editorialBrief: string;
  pseudonym: string;
  city: string;
  country: string;
  gender: string;
  sexualOrientation: string;
  occupation: string;
  age: string;
  tags: string[];
  growthAreas: string[];
  lifePhase: string;
  explicit: boolean;
  voiceName: string;
};

const formFromDetail = (detail: PublicationDetail, draft: PublicationDraft): WorkspaceForm => {
  const { city, country } = splitLocation(detail.location, draft);
  return {
    title: detail.title === 'Untitled' ? '' : detail.title,
    storyType: detail.type,
    storyText: detail.storyText,
    heroHook: detail.heroHook,
    heroTagline: detail.heroTagline,
    editorialBrief: detail.editorialBrief,
    pseudonym: detail.pseudonym,
    city,
    country,
    gender: detail.gender,
    sexualOrientation: detail.sexualOrientation,
    occupation: detail.occupation,
    age: detail.age,
    tags: detail.tags,
    growthAreas: detail.growthAreas,
    lifePhase: detail.lifePhase,
    explicit: detail.explicit,
    voiceName: detail.voiceName,
  };
};

export const useWorkspaceDraft = (detail: PublicationDetail, draft: PublicationDraft) => {
  const initial = useMemo(() => formFromDetail(detail, draft), [detail, draft]);
  const [form, setForm] = useState<WorkspaceForm>(initial);
  const detailId = useRef(detail.id);

  // Reset when the route switches to another publication.
  useEffect(() => {
    if (detailId.current !== detail.id) {
      detailId.current = detail.id;
      setForm(initial);
    }
  }, [detail.id, initial]);

  const [updateStory, { isLoading: isSaving }] = useUpdateStoryMutation();

  const patch = useCallback(
    (partial: Partial<WorkspaceForm>) => setForm((prev) => ({ ...prev, ...partial })),
    [],
  );

  const reset = useCallback(() => setForm(initial), [initial]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  // Browser-level guard; in-app navigation is guarded by the workspace shell.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const buildPayload = useCallback((): ModerationStoryUpdate => {
    const parsedAge = Number(form.age);
    return {
      storyId: detail.id,
      title: form.title,
      story_type: form.storyType,
      story_text: form.storyText,
      hero_hook: form.heroHook,
      hero_tagline: form.heroTagline,
      editorial_brief: form.editorialBrief,
      first_name: form.pseudonym,
      location: joinLocation(form.city, form.country),
      gender: form.gender,
      sexual_orientation: form.sexualOrientation,
      occupation: form.occupation,
      age: form.age.trim() !== '' && Number.isFinite(parsedAge) ? parsedAge : undefined,
      tags: form.tags,
      growth_areas: form.growthAreas,
      life_phase: form.lifePhase,
      high_intensity: form.explicit,
      // Voice name is locked for member-narrated pieces.
      ...(detail.isHumanNarrated ? {} : { voice_name: form.voiceName || undefined }),
    };
  }, [detail.id, detail.isHumanNarrated, form]);

  const save = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      try {
        const res = await updateStory(buildPayload()).unwrap();
        if (!silent && res?.success) toast.success('Saved');
        return true;
      } catch (error) {
        const message =
          error && typeof error === 'object' && 'data' in error
            ? (error as { data?: { message?: string } }).data?.message
            : undefined;
        toast.error(message || 'Failed to save');
        return false;
      }
    },
    [buildPayload, updateStory],
  );

  return { form, patch, reset, isDirty, isSaving, save };
};
