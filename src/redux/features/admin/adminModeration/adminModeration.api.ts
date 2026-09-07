import { apiClient } from '@/redux/apiClient/apiClient';

type ModerationQueueParams = {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
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
  location?: string;
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
};

const adminModerationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getModerationQueue: builder.query({
      query: ({ status, search, limit = 10, page = 1 }: ModerationQueueParams = {}) => ({
        url: '/admin/moderation/queue',
        params: {
          moderation_status: status,
          search,
          limit,
          page,
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
} = adminModerationApi;
