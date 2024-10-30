import { serviceApi } from "./service"
import { MinimalUser } from "../datatypes/User"
import { OrderKind, PaymentType } from "../datatypes/Order"
import { unwrapResponse } from "./orders"

export interface PublicContract {
  id: string
  title: string
  customer: MinimalUser
  description: string
  kind: OrderKind
  collateral: number
  cost: number
  payment_type: PaymentType
  timestamp: Date
  status: string
  expiration: Date
}

export interface ContractOfferBody {
  contract_id: string
  contractor: string | null
  title: string
  description: string
  kind: string
  collateral: number
  cost: number
  payment_type: PaymentType
}

export interface PublicContractBody {
  title: string
  description: string
  kind: string
  collateral: number
  cost: number
  payment_type: PaymentType
}

export const publicContractsApi = serviceApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicContract: builder.query<PublicContract, string>({
      query: (arg) => `/api/contracts/${arg}`,
      providesTags: (result, error, arg) => [
        "PublicContracts" as const,
        { type: "PublicContracts" as const, id: arg },
      ],
      transformResponse: unwrapResponse,
    }),
    getPublicContracts: builder.query<PublicContract[], void>({
      query: () => `/api/contracts`,
      providesTags: ["PublicContracts" as const],
      transformResponse: unwrapResponse,
    }),
    createContractOffer: builder.mutation<
      { session_id: string },
      ContractOfferBody
    >({
      query: ({ contract_id, ...body }) => ({
        url: `/api/contracts/${contract_id}/offers`,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
    }),
    createPublicContract: builder.mutation<
      { contract_id: string },
      PublicContractBody
    >({
      query: (body) => ({
        url: `/api/contracts`,
        method: "POST",
        body,
      }),
      transformResponse: unwrapResponse,
    }),
  }),
})

export const {
  useGetPublicContractQuery,
  useGetPublicContractsQuery,
  useCreateContractOfferMutation,
  useCreatePublicContractMutation,
} = publicContractsApi
