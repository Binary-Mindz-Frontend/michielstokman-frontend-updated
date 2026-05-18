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
    enrollJourney: builder.mutation<any, string>({
      query: (journey_id) => ({
        url: `/liberation/${journey_id}/enroll`,
        method: 'POST',
      }),
      invalidatesTags: ['Liberations'],
    }),
  }),
});

export const { useCompleteDayMutation, useEnrollJourneyMutation } = liberationApi;
