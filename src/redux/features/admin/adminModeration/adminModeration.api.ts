import { apiClient } from '@/redux/apiClient/apiClient';
type ModerationQueueParams = {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
};

const adminModerationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Moderation Queue
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

    // Get Story Details
    getStoryDetails: builder.query({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'GET',
      }),
      providesTags: (storyId) => [{ type: 'Story', id: storyId }],
    }),

    // Update Story Details
    updateStory: builder.mutation({
      query: ({ storyId, ...patch }) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'PUT',
        body: patch, // This will now be { title, story_type, story_text }
      }),
      invalidatesTags: (_result, _error, { storyId }) => [
        { type: 'Story', id: storyId },
        'ModerationQueue',
        'MemberStories',
      ],
    }),

    // Delete Story
    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ModerationQueue', 'Story', 'MemberStories'],
    }),

    // Approve Story
    approveStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, storyId) => [
        { type: 'Story', id: storyId },
        'ModerationQueue',
        'MemberStories',
      ],
    }),

    // Reject Story
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
  useGetStoryDetailsQuery,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useApproveStoryMutation,
  useRejectStoryMutation,
} = adminModerationApi;
