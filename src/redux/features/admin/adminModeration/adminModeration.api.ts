import { apiClient } from '@/redux/apiClient/apiClient';

type ModerationQueueParams = {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
  /** `confession` | `meditation` | `journey`. */
  storyType?: string;
  /** Assets that must be missing, e.g. `['text', 'voice']`. */
  missing?: string[];
  /** One rung of the publication ladder, e.g. `ready_for_review`. */
  publicationStatus?: string;
  sort?: string;
};

export type ModerationSuggestField = 'hook' | 'tagline' | 'moods' | 'analysis' | 'voice';

export type ModerationStoryUpdate = {
  storyId: string;
  title?: string;
  story_type?: string;
  story_text?: string;
  hero_hook?: string;
  hero_tagline?: string;
  first_name?: string;
  city?: string;
  country?: string;
  gender?: string;
  sexual_orientation?: string;
  occupation?: string;
  age?: number | null;
  tags?: string[];
  growth_areas?: string[];
  life_phase?: string;
  high_intensity?: boolean;
  editorial_brief?: string;
  voice_name?: string;
  voice_not_required?: boolean;
};

/** Which of a publication's three assets an approval applies to. */
export type PublicationAsset = 'content' | 'cover' | 'voice';

const ASSET_PATH: Record<PublicationAsset, string> = {
  content: 'approve-content',
  cover: 'approve-cover',
  voice: 'approve-voice',
};

/** Everything a publication touches, so one approval refreshes every view of it. */
const publicationTags = (storyId: string) =>
  [
    { type: 'Story' as const, id: storyId },
    'ModerationQueue' as const,
    'MemberStories' as const,
    'Voice_Review' as const,
    'Discovery_Feed' as const,
  ] as const;

const adminModerationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getModerationQueue: builder.query({
      query: ({
        status,
        search,
        limit = 10,
        page = 1,
        storyType,
        missing,
        publicationStatus,
        sort,
      }: ModerationQueueParams = {}) => ({
        url: '/admin/moderation/queue',
        params: {
          moderation_status: status,
          search,
          limit,
          page,
          story_type: storyType,
          missing: missing?.length ? missing.join(',') : undefined,
          publication_status: publicationStatus,
          sort,
        },
      }),
      providesTags: ['ModerationQueue'],
    }),

    getModerationStoryDetails: builder.query({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, storyId) => [{ type: 'Story', id: storyId }],
    }),

    updateStory: builder.mutation({
      query: ({ storyId, ...patch }: ModerationStoryUpdate) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { storyId }) => [
        { type: 'Story', id: storyId },
        'ModerationQueue',
        'MemberStories',
      ],
    }),

    suggestStoryField: builder.mutation({
      query: ({ storyId, field }: { storyId: string; field: ModerationSuggestField }) => ({
        url: `/admin/moderation/story/${storyId}/suggest`,
        method: 'POST',
        body: { field },
      }),
    }),

    requestStoryChanges: builder.mutation({
      query: ({ storyId, reason }: { storyId: string; reason: string }) => ({
        url: `/admin/moderation/story/${storyId}/request-changes`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { storyId }) => [
        { type: 'Story', id: storyId },
        'ModerationQueue',
        'MemberStories',
      ],
    }),

    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ModerationQueue', 'Story', 'MemberStories'],
    }),

    approveStory: builder.mutation({
      query: (arg: string | { storyId: string; notes?: string }) => {
        const storyId = typeof arg === 'string' ? arg : arg.storyId;
        const notes = typeof arg === 'string' ? undefined : arg.notes;
        return {
          url: `/admin/moderation/story/${storyId}/approve`,
          method: 'POST',
          body: notes ? { notes } : undefined,
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const storyId = typeof arg === 'string' ? arg : arg.storyId;
        return [{ type: 'Story', id: storyId }, 'ModerationQueue', 'MemberStories'];
      },
    }),

    rejectStory: builder.mutation({
      query: ({ data, storyId }) => ({
        url: `/admin/moderation/story/${storyId}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { storyId }) => [
        { type: 'Story', id: storyId },
        'ModerationQueue',
        'MemberStories',
      ],
    }),

    /**
     * Approve one asset of a publication. `approved: false` sends it back for
     * review, so the same endpoint drives the toggle.
     */
    approvePublicationAsset: builder.mutation({
      query: ({
        storyId,
        asset,
        approved = true,
      }: {
        storyId: string;
        asset: PublicationAsset;
        approved?: boolean;
      }) => ({
        url: `/admin/moderation/story/${storyId}/${ASSET_PATH[asset]}`,
        method: 'POST',
        body: { approved },
      }),
      invalidatesTags: (_result, _error, { storyId }) => [...publicationTags(storyId)],
    }),

    /** Waive narration for this publication, so it stops gating publish. */
    setVoiceRequirement: builder.mutation({
      query: ({ storyId, voiceNotRequired }: { storyId: string; voiceNotRequired: boolean }) => ({
        url: `/admin/moderation/story/${storyId}/voice-requirement`,
        method: 'PATCH',
        body: { voice_not_required: voiceNotRequired },
      }),
      invalidatesTags: (_result, _error, { storyId }) => [...publicationTags(storyId)],
    }),

    /** Publish content, story card and voice together. 409 if anything is unapproved. */
    publishPublication: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/moderation/story/${storyId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, storyId) => [...publicationTags(storyId)],
    }),

    regeneratePublicationCover: builder.mutation({
      query: (storyId: string) => ({
        url: `/admin/moderation/story/${storyId}/regenerate-cover`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, storyId) => [...publicationTags(storyId)],
    }),

    replacePublicationCover: builder.mutation({
      query: ({ storyId, file }: { storyId: string; file: File }) => {
        const body = new FormData();
        body.append('file', file);
        return {
          url: `/admin/moderation/story/${storyId}/cover`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _error, { storyId }) => [...publicationTags(storyId)],
    }),

    replacePublicationAudio: builder.mutation({
      query: ({ storyId, file }: { storyId: string; file: File }) => {
        const body = new FormData();
        body.append('file', file);
        return {
          url: `/admin/moderation/story/${storyId}/audio`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _error, { storyId }) => [...publicationTags(storyId)],
    }),
  }),
});

export const {
  useGetModerationQueueQuery,
  useGetModerationStoryDetailsQuery,
  useUpdateStoryMutation,
  useSuggestStoryFieldMutation,
  useRequestStoryChangesMutation,
  useDeleteStoryMutation,
  useApproveStoryMutation,
  useRejectStoryMutation,
  useApprovePublicationAssetMutation,
  useSetVoiceRequirementMutation,
  usePublishPublicationMutation,
  useRegeneratePublicationCoverMutation,
  useReplacePublicationCoverMutation,
  useReplacePublicationAudioMutation,
} = adminModerationApi;
