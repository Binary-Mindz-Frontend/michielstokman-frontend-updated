/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/redux/apiClient/apiClient';
import { ILiberationCompleteRequest } from '@/types/liberation.types';

export const liberationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    completeDay: builder.mutation<any, { day: number; data: ILiberationCompleteRequest }>({
      query: ({ day, data }) => ({
        url: `liberation/day/${day}/complete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Liberations'],
    }),
  }),
});

export const { useCompleteDayMutation } = liberationApi;
