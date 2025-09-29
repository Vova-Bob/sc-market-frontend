import { serviceApi } from "./service"

export interface OrderSetting {
  id: string
  entity_type: 'user' | 'contractor'
  entity_id: string
  setting_type: 'offer_message' | 'order_message'
  message_content: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateOrderSettingRequest {
  setting_type: 'offer_message' | 'order_message'
  message_content: string
  enabled?: boolean
}

export interface UpdateOrderSettingRequest {
  message_content?: string
  enabled?: boolean
}

export const orderSettingsApi = serviceApi.injectEndpoints({
  endpoints: (builder) => ({
    // User order settings
    getUserOrderSettings: builder.query<OrderSetting[], void>({
      query: () => '/api/orders/settings',
      transformResponse: (response: { data: { settings: OrderSetting[] } }) => response.data.settings,
      providesTags: ['OrderSettings'],
    }),
    
    createUserOrderSetting: builder.mutation<{ setting: OrderSetting }, CreateOrderSettingRequest>({
      query: (setting) => ({
        url: '/api/orders/settings',
        method: 'POST',
        body: setting,
      }),
      transformResponse: (response: { data: { setting: OrderSetting } }) => response.data,
      invalidatesTags: ['OrderSettings'],
    }),
    
    updateUserOrderSetting: builder.mutation<{ setting: OrderSetting }, { id: string } & UpdateOrderSettingRequest>({
      query: ({ id, ...updates }) => ({
        url: `/api/orders/settings/${id}`,
        method: 'PUT',
        body: updates,
      }),
      transformResponse: (response: { data: { setting: OrderSetting } }) => response.data,
      invalidatesTags: ['OrderSettings'],
    }),
    
    deleteUserOrderSetting: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/orders/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrderSettings'],
    }),
    
    // Contractor order settings
    getContractorOrderSettings: builder.query<OrderSetting[], string>({
      query: (contractorId) => `/api/orders/contractors/${contractorId}/settings`,
      transformResponse: (response: { data: { settings: OrderSetting[] } }) => response.data.settings,
      providesTags: (result, error, contractorId) => [
        { type: 'OrderSettings', id: contractorId },
      ],
    }),
    
    createContractorOrderSetting: builder.mutation<{ setting: OrderSetting }, { contractorId: string } & CreateOrderSettingRequest>({
      query: ({ contractorId, ...setting }) => ({
        url: `/api/orders/contractors/${contractorId}/settings`,
        method: 'POST',
        body: setting,
      }),
      transformResponse: (response: { data: { setting: OrderSetting } }) => response.data,
      invalidatesTags: (result, error, { contractorId }) => [
        { type: 'OrderSettings', id: contractorId },
      ],
    }),
    
    updateContractorOrderSetting: builder.mutation<{ setting: OrderSetting }, { contractorId: string; id: string } & UpdateOrderSettingRequest>({
      query: ({ contractorId, id, ...updates }) => ({
        url: `/api/orders/contractors/${contractorId}/settings/${id}`,
        method: 'PUT',
        body: updates,
      }),
      transformResponse: (response: { data: { setting: OrderSetting } }) => response.data,
      invalidatesTags: (result, error, { contractorId }) => [
        { type: 'OrderSettings', id: contractorId },
      ],
    }),
    
    deleteContractorOrderSetting: builder.mutation<void, { contractorId: string; id: string }>({
      query: ({ contractorId, id }) => ({
        url: `/api/orders/contractors/${contractorId}/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { contractorId }) => [
        { type: 'OrderSettings', id: contractorId },
      ],
    }),
  }),
})

export const {
  useGetUserOrderSettingsQuery,
  useCreateUserOrderSettingMutation,
  useUpdateUserOrderSettingMutation,
  useDeleteUserOrderSettingMutation,
  useGetContractorOrderSettingsQuery,
  useCreateContractorOrderSettingMutation,
  useUpdateContractorOrderSettingMutation,
  useDeleteContractorOrderSettingMutation,
} = orderSettingsApi