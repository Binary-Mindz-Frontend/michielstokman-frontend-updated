import { apiClient } from '@/redux/apiClient/apiClient';

const adminMetricsChatApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Admin Metrics Chat
     * Used for interacting with the metrics AI/Chat system.
     * @param {Object} body - Usually contains the prompt/message and optional session context.
     */
    sendMetricsChatMessage: builder.mutation({
      query: (payload) => ({
        url: '/v1/admin/chat',
        method: 'POST',
        body: payload,
      }),
      // We typically don't invalidate tags for a chat unless
      // the chat actually changes specific dashboard stats.
    }),
  }),
});

export const { useSendMetricsChatMessageMutation } = adminMetricsChatApi;
