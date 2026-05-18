/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/redux/apiClient/apiClient';
import { ILiberationCompleteRequest } from '@/types/liberation.types';

export const liberationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    completeDay: builder.mutation<
      any,
      { journey_id: string; day: number; data: ILiberationCompleteRequest }
    >({
      query: ({ journey_id, day, data }) => ({
        url: `/liberation/${journey_id}/day/${day}/complete`,
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
    generateDayExercise: builder.mutation<
      any,
      { journey_code: string; day: number; data: { morning_feeling: string } }
    >({
      query: ({ journey_code, day, data }) => ({
        url: `/liberation/${journey_code}/day/${day}/generate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Liberations'],
    }),
    getJourneyStatus: builder.query<any, string>({
      query: (journey_code) => ({
        url: `/liberation/${journey_code}/status`,
        method: 'GET',
      }),
      providesTags: ['Liberations'],
    }),
    getDayExercises: builder.query<any, { journey_code: string; day: number }>({
      query: ({ journey_code, day }) => ({
        url: `/liberation/${journey_code}/day/${day}`,
        method: 'GET',
      }),
      providesTags: ['Liberations'],
    }),
  }),
});

export const {
  useCompleteDayMutation,
  useEnrollJourneyMutation,
  useGenerateDayExerciseMutation,
  useGetJourneyStatusQuery,
  useGetDayExercisesQuery,
} = liberationApi;
