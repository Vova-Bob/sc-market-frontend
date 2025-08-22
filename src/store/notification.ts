import { BACKEND_URL } from "../util/constants"
import { serviceApi } from "./service"
import { Notification } from "../hooks/login/UserProfile"

const baseUrl = `${BACKEND_URL}/api/notification`
// Define a service using a base URL and expected endpoints
export const notificationApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    notificationUpdate: builder.mutation<
      { success: boolean; message: string },
      { notification_id: string; read: boolean }
    >({
      query: (body) => ({
        url: `${baseUrl}/${body.notification_id}`,
        method: "PATCH",
        body: { read: body.read },
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    notificationDelete: builder.mutation<
      { success: boolean; message: string; deleted_count: number },
      string[]
    >({
      query: (notificationIds) => ({
        url: `${baseUrl}`,
        method: "DELETE",
        body: { notification_ids: notificationIds },
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    getNotifications: builder.query<
      {
        notifications: Notification[]
        pagination: {
          total: number
          currentPage: number
          pageSize: number
          totalPages: number
          hasNextPage: boolean
          hasPreviousPage: boolean
        }
        unread_count: number
      },
      { page?: number; pageSize?: number; action?: string; entityId?: string }
    >({
      query: (params) => ({
        url: `${baseUrl}/${params.page || 0}`,
        params: {
          pageSize: params.pageSize || 20,
          ...(params.action && { action: params.action }),
          ...(params.entityId && { entityId: params.entityId }),
        },
      }),
      providesTags: (result, error, arg) => [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    notificationBulkUpdate: builder.mutation<
      { success: boolean; message: string; affected_count: number },
      { read: boolean }
    >({
      query: (body) => ({
        url: `${baseUrl}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    notificationBulkDelete: builder.mutation<
      { success: boolean; message: string; affected_count: number },
      { notification_ids?: string[] }
    >({
      query: (body) => ({
        url: `${baseUrl}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useNotificationUpdateMutation,
  useGetNotificationsQuery,
  useNotificationDeleteMutation,
  useNotificationBulkUpdateMutation,
  useNotificationBulkDeleteMutation,
} = notificationApi
