import { BACKEND_URL } from "../util/constants"
import { serviceApi } from "./service"
import { Notification } from "../hooks/login/UserProfile"

let baseUrl = `${BACKEND_URL}/api/notification`
// Define a service using a base URL and expected endpoints
export const notificationApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    notificationUpdate: builder.mutation<
      void,
      { notification_id: string; read: boolean }[]
    >({
      query: (body) => ({
        url: `${baseUrl}/update`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    notificationDelete: builder.mutation<void, string[]>({
      query: (body) => ({
        url: `${baseUrl}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "Notifications" as const,
        { type: "Notifications" as const },
      ],
    }),
    getNotifications: builder.query<Notification[], void>({
      query: () => `${baseUrl}`,
      providesTags: (result, error, arg) => [
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
} = notificationApi
