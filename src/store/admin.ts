import { BACKEND_URL } from "../util/constants"
import { serviceApi } from "./service"
import { unwrapResponse } from "./orders"
import { OrderAnalytics } from "../datatypes/Order"
import { AdminUsersResponse, AdminUsersQuery } from "../datatypes/User"

export interface MembershipAnalytics {
  daily: Array<{ date: string; count: number }>
  weekly: Array<{ date: string; count: number }>
  monthly: Array<{ date: string; count: number }>
}

const baseUrl = `/api/admin`
// Define a service using a base URL and expected endpoints
export const adminApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getActivityAdmin: builder.query<
      {
        daily: { date: string; count: number }[]
        weekly: { date: string; count: number }[]
        monthly: { date: string; count: number }[]
      },
      void
    >({
      query: () => `${baseUrl}/activity`,
      transformResponse: unwrapResponse,
    }),
    getOrderAnalytics: builder.query<OrderAnalytics, void>({
      query: () => `${baseUrl}/orders/analytics`,
      providesTags: ["Order" as const],
      transformResponse: unwrapResponse,
    }),
    getAdminUsers: builder.query<AdminUsersResponse, AdminUsersQuery>({
      query: (params) => ({
        url: `${baseUrl}/users`,
        params,
      }),
      providesTags: ["Profile" as const],
      transformResponse: unwrapResponse,
    }),
    getMembershipAnalytics: builder.query<MembershipAnalytics, void>({
      query: () => `${baseUrl}/membership/analytics`,
      providesTags: ["Profile" as const],
      transformResponse: unwrapResponse,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetActivityAdminQuery,
  useGetOrderAnalyticsQuery,
  useGetAdminUsersQuery,
  useGetMembershipAnalyticsQuery,
} = adminApi
