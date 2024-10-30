import { Order, OrderStub, OrderBody } from "../datatypes/Order"
import { serviceApi } from "./service"

export interface ErrorResponse<E> {
  error: E
  errors: E[]
  validationErrors: E[]
  message?: string
}

export interface SuccessResponse<T> {
  data: T
}

export type Response<T, E> = ErrorResponse<E> | SuccessResponse<T>

export function unwrapResponse<T, E>(response: Response<T, E>) {
  if ((response as SuccessResponse<T>).data) {
    return (response as SuccessResponse<T>).data
  } else {
    return (response as ErrorResponse<E>).error
  }
}

const ordersApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getOrderById: builder.query<Order, string>({
      query: (order_id) => `/api/orders/${order_id}`,
      providesTags: (_result, _error, order_id) => [
        { type: "Order" as const, id: order_id },
      ],
      transformResponse: unwrapResponse,
    }),
    createOrder: builder.mutation<
      {
        discord_invite?: string
        session_id: string
      },
      OrderBody
    >({
      query: (body) => ({
        url: `/api/orders`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders" as const],
      transformResponse: unwrapResponse,
    }),
    createOrderThread: builder.mutation<void, string>({
      query: (order_id) => ({
        url: `/api/orders/${order_id}/thread`,
        method: "POST",
      }),
      invalidatesTags: (result, error, order_id) => [
        {
          type: "Order" as const,
          id: order_id,
        },
        "Order" as const,
        { type: "Order" as const },
      ],
      transformResponse: unwrapResponse,
    }),
    applyToOrder: builder.mutation<
      void,
      {
        order_id: string
        contractor_id: string | undefined | null
        message?: string
      }
    >({
      query: (arg) => ({
        url: `/api/orders/${arg.order_id}/applications`,
        method: "POST",
        body: { contractor: arg.contractor_id, message: arg.message },
      }),
      invalidatesTags: [
        {
          type: "Order" as const,
        },
        "Order" as const,
        { type: "Order" as const },
      ],
    }),
    acceptOrderApplicant: builder.mutation<
      void,
      {
        order_id: string
        contractor_id: string | undefined | null
        user_id: string | undefined | null
      }
    >({
      query: (arg) => ({
        url: `/api/orders/${arg.order_id}/applicants/${
          arg.contractor_id ? "contractors" : "users"
        }/${arg.contractor_id || arg.user_id}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Order" as const },
        "Order" as const,
        { type: "Order" },
      ],
    }),
    assignOrder: builder.mutation<
      void,
      {
        order_id: string
        user_id: string
      }
    >({
      query: (arg) => ({
        url: `/api/orders/${arg.order_id}`,
        method: "PUT",
        body: { assigned_to: arg.user_id },
      }),
      invalidatesTags: [
        {
          type: "Order" as const,
        },
        "Order" as const,
        { type: "Order" },
        "Chat" as const,
      ],
    }),
    unassignOrder: builder.mutation<
      void,
      {
        order_id: string
      }
    >({
      query: (arg) => ({
        url: `/api/orders/${arg.order_id}`,
        method: "PUT",
        body: { assigned_to: null },
      }),
      invalidatesTags: [
        {
          type: "Order" as const,
        },
        "Order" as const,
        { type: "Order" as const },
        "Chat" as const,
      ],
    }),
    leaveOrderReview: builder.mutation<
      void,
      {
        order_id: string
        content: string
        rating: number
        role: string
      }
    >({
      query: ({ order_id, ...body }) => ({
        url: `/api/orders/${order_id}/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        {
          type: "Order" as const,
        },
        "Order" as const,
        { type: "Order" as const },
        "Chat" as const,
      ],
    }),
    setOrderStatus: builder.mutation<
      void,
      {
        order_id: string
        status: string
      }
    >({
      query: (arg) => ({
        url: `/api/orders/${arg.order_id}`,
        method: "PUT",
        body: arg,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Order" as const, id: arg.order_id },
      ],
    }),
    getMyOrders: builder.query<OrderStub[], void>({
      query: () => `/api/orders/mine`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ order_id }) => ({
                type: "Order" as const,
                id: order_id,
              })),
              { type: "Order" as const },
              "Order" as const,
            ]
          : ["Order" as const, { type: "Order" as const }],
      transformResponse: unwrapResponse,
    }),
    getAllOrders: builder.query<OrderStub[], void>({
      query: () => `/api/orders/all`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ order_id }) => ({
                type: "Order" as const,
                id: order_id,
              })),
              "Order" as const,
            ]
          : ["Order" as const, { type: "Order" as const }],
      transformResponse: unwrapResponse,
    }),
    getOrdersByContractor: builder.query<OrderStub[], string>({
      query: (spectrum_id) => `/api/orders/contractor/${spectrum_id}`,
      providesTags: ["Order" as const, { type: "Order" as const }],
      transformResponse: unwrapResponse,
    }),
    getAssignedOrdersByContractor: builder.query<OrderStub[], string>({
      query: (spectrum_id) => `/api/orders/contractor/${spectrum_id}/assigned`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ order_id }) => ({
                type: "Order" as const,
                id: order_id,
              })),
              { type: "Order" as const },
              "Order" as const,
            ]
          : ["Order" as const, { type: "Order" as const }],
      transformResponse: unwrapResponse,
    }),
    getAllAssignedOrders: builder.query<OrderStub[], void>({
      query: () => `/api/orders/assigned`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ order_id }) => ({
                type: "Order" as const,
                id: order_id,
              })),
              { type: "Order" as const },
              "Order" as const,
            ]
          : ["Order" as const, { type: "Order" as const }],
      transformResponse: unwrapResponse,
    }),
  }),
})

export const {
  useUnassignOrderMutation,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useApplyToOrderMutation,
  useAcceptOrderApplicantMutation,
  useAssignOrderMutation,
  useLeaveOrderReviewMutation,
  useSetOrderStatusMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrdersByContractorQuery,
  useGetAssignedOrdersByContractorQuery,
  useGetAllAssignedOrdersQuery,
  useCreateOrderThreadMutation,
} = ordersApi
