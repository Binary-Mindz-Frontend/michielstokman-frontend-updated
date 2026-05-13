import { apiClient } from '@/redux/apiClient/apiClient';

const adminModerationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Moderation Queue
    getModerationQueue: builder.query({
      query: () => ({
        url: '/admin/moderation/queue',
        method: 'GET',
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
        body: patch,
      }),
      invalidatesTags: ({ storyId }) => [{ type: 'Story', id: storyId }, 'ModerationQueue'],
    }),

    // Delete Story
    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ModerationQueue', 'Story'],
    }),

    // Approve Story
    approveStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (storyId) => [{ type: 'Story', id: storyId }, 'ModerationQueue'],
    }),

    // Reject Story
    rejectStory: builder.mutation({
      query: (storyId) => ({
        url: `/admin/moderation/story/${storyId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (storyId) => [{ type: 'Story', id: storyId }, 'ModerationQueue'],
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
