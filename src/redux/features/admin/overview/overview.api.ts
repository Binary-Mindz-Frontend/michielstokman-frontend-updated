import { apiClient } from '@/redux/apiClient/apiClient';

const adminOverviewStatsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Admin Dashboard Figma Stats
    getFigmaStats: builder.query({
      query: () => ({
        url: '/admin/dashboard/figma-stats',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),

    // Admin Dashboard Stats
    getDashboardStats: builder.query({
      query: () => ({
        url: '/admin/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),

    // Admin Dashboard Demo
    getDashboardDemo: builder.query({
      query: () => ({
        url: '/admin/dashboard/demo',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),
  }),
});

export const { useGetFigmaStatsQuery, useGetDashboardStatsQuery, useGetDashboardDemoQuery } =
  adminOverviewStatsApi;
