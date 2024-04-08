import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import base64 from 'base-64';
import createHeaders from '../../utlis/helper';

const API_BASE_URL = 'https://api-m.sandbox.paypal.com';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: builder => ({
    getToken: builder.query({
      query: () => ({
        url: '/v1/oauth2/token',
        method: 'POST',
        body: `grant_type=client_credentials`,
        headers: createHeaders('', 'application/x-www-form-urlencoded'),
      }),
    }),
    createOrder: builder.mutation({
      query: ({ token, orderDetail }) => ({
        url: '/v2/checkout/orders',
        method: 'POST',
        body: JSON.stringify(orderDetail),
        headers: createHeaders(token),
      }),
    }),
    capturePayment: builder.mutation({
      query: ({ id, token = '' }) => ({
        url: `/v2/checkout/orders/${id}/capture`,
        method: 'POST',
        headers: createHeaders(token),
      }),
    }),
  }),
});

export const { useGetTokenQuery, useCreateOrderMutation, useCapturePaymentMutation } = api;

// Export the API reducer
export const { reducer: apiReducer } = api;