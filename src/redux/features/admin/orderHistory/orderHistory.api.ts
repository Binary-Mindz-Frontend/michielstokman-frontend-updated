import { apiClient } from '@/redux/apiClient/apiClient';

export const adminLiberationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get Complete Order History (Admin)
    getOrderHistory: builder.query({
      query: ({ search, days_back, limit = 10, page = `` }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (days_back) params.append('days_back', days_back.toString());
        params.append('limit', limit.toString());
        params.append('page', page.toString());

        return {
          url: `/admin/orders?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Orders_History'],
    }),

    // get all orders stats
    getOrdersStats: builder.query({
      query: () => ({
        url: '/admin/orders/stats',
        method: 'GET',
      }),
      providesTags: ['Orders_History'],
    }),
  }),
});

export const { useGetOrderHistoryQuery, useGetOrdersStatsQuery } = adminLiberationApi;
