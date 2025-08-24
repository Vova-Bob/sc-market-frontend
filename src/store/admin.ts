import { BACKEND_URL } from "../util/constants"
import { serviceApi } from "./service"
import { unwrapResponse } from "./orders"
import { OrderAnalytics } from "../datatypes/Order"
import { AdminUsersResponse, AdminUsersQuery } from "../datatypes/User"

export interface MembershipAnalytics {
  daily_totals: Array<{
    date: string
    new_members: string
    new_members_rsi_verified: string
    new_members_rsi_unverified: string
    cumulative_members: string
    cumulative_members_rsi_verified: string
    cumulative_members_rsi_unverified: string
  }>
  weekly_totals: Array<{
    date: string
    new_members: string
    new_members_rsi_verified: string
    new_members_rsi_unverified: string
    cumulative_members: string
    cumulative_members_rsi_verified: string
    cumulative_members_rsi_unverified: string
  }>
  monthly_totals: Array<{
    date: string
    new_members: string
    new_members_rsi_verified: string
    new_members_rsi_unverified: string
    cumulative_members: string
    cumulative_members_rsi_verified: string
    cumulative_members_rsi_unverified: string
  }>
  summary: {
    total_members: string
    admin_members: string
    regular_members: string
    rsi_confirmed_members: string
    banned_members: string
    new_members_30d: string
    new_members_7d: string
  }
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
