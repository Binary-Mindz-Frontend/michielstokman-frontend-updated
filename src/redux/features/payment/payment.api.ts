/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/redux/apiClient/apiClient';
import { IPaymentCheckoutRequest } from '@/types/payment.types';
import { TResponse } from '@/types/apiResponse.types';

const paymentApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Start Checkout
    startCheckout: builder.mutation<TResponse<any>, IPaymentCheckoutRequest>({
      query: (data) => ({
        url: '/payment/checkout/start',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useStartCheckoutMutation } = paymentApi;
