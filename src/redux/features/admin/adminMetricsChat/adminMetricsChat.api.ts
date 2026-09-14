import { apiClient } from '@/redux/apiClient/apiClient';

export type MetricsChatRequest = {
  query: string;
};

export type MetricsChatResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    answer: string;
    metrics_snapshot?: Record<string, unknown> | null;
  } | null;
};

const adminMetricsChatApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    sendMetricsChatMessage: builder.mutation<MetricsChatResponse, MetricsChatRequest>({
      query: (payload) => ({
        url: '/admin/chat',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useSendMetricsChatMessageMutation } = adminMetricsChatApi;
