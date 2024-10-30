import { BACKEND_URL } from "../util/constants"
import {
  AggregateListingUpdateBody,
  AggregateMarketListingBody,
  BaseListingType,
  GameItem,
  MarketAggregate,
  MarketAggregateListing,
  MarketBuyOrderBody,
  MarketListingBody,
  MarketListingType,
  MarketListingUpdateBody,
  MarketMultiple,
  MarketMultipleBody,
  SellerListingType,
} from "../datatypes/MarketListing"
import { serviceApi } from "./service"
import { Order } from "../datatypes/Order"

export interface SerializedError {
  error?: string
}

export interface MarketSearchQuery {
  item_type: string | null
  sale_type: string | null
  minCost: number
  rating: number | null
  maxCost: number | null
  quantityAvailable: number
  query: string
  sort: string | null
  seller_rating: number
  index: number
  page_size: number
  reverseSort: boolean
  contractor_seller: string
  user_seller: string
  listing_type?: string | null
}

export interface MarketSearchResult {
  user_seller: string | null
  contractor_seller: string | null
  status: string
  listing_id: string
  listing_type: string
  details_id: string
  item_type: string
  item_name: string | null
  game_item_id: string | null
  sale_type: "auction" | "sale"
  price: string
  minimum_price: string
  maximum_price: string
  quantity_available: number
  total_rating: number
  avg_rating: number
  rating_count: number
  rating_streak: number
  total_orders: number
  title: string
  photo: string
  timestamp: number
  auction_end_time: number
}

let baseUrl = `${BACKEND_URL}/api/market`
// Define a service using a base URL and expected endpoints
export const marketApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    marketGetListingByID: builder.query<BaseListingType, string>({
      query: (listing_id) => `${baseUrl}/listing/${listing_id}`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
      ],
    }),
    marketGetListingByUser: builder.query<SellerListingType[], string>({
      query: (username) => `${baseUrl}/user/${username}`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
      ],
    }),
    marketGetAggregateByID: builder.query<MarketAggregate, string | number>({
      query: (listing_id) => `${baseUrl}/aggregate/${listing_id}`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
        { type: "Listing" as const },
      ],
    }),
    marketGetAggregateChartByID: builder.query<
      {
        close: number
        high: number
        low: number
        open: number
        timestamp: number
        volume: number
      }[],
      string
    >({
      query: (listing_id) => `${baseUrl}/aggregate/${listing_id}/chart`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
        { type: "Listing" as const },
      ],
    }),
    marketGetAggregateHistoryByID: builder.query<
      {
        close: number
        high: number
        low: number
        open: number
        timestamp: number
        volume: number
      }[],
      string
    >({
      query: (listing_id) => `${baseUrl}/aggregate/${listing_id}/history`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
        { type: "Listing" as const },
      ],
    }),
    marketGetMultipleByID: builder.query<MarketMultiple, string | number>({
      query: (listing_id) => `${baseUrl}/multiple/${listing_id}`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
      ],
    }),
    marketGetAggregateListingByID: builder.query<
      MarketAggregateListing,
      string
    >({
      query: (listing_id) => `${baseUrl}/aggregate/listing/${listing_id}`,
      providesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg },
        { type: "Listing" as const },
      ],
    }),
    marketGetAggregates: builder.query<MarketAggregate[], void>({
      query: (listing_id) => `${baseUrl}/aggregates`,
      providesTags: (result, error) => [
        { type: "Listing" as const },
        { type: "Aggregates" as const },
      ],
    }),
    marketGetBuyOrderListings: builder.query<MarketAggregate[], void>({
      query: () => `${baseUrl}/aggregates/buyorders`,
      providesTags: (result, error) => [
        { type: "Listing" as const },
        { type: "Aggregates" as const },
      ],
    }),
    marketCreateContractorListing: builder.mutation<
      void,
      { spectrum_id: string; body: MarketListingBody }
    >({
      query: ({ spectrum_id, body }) => ({
        url: `${baseUrl}/contractor/${spectrum_id}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AllListings" as const }],
    }),
    marketUpdateListing: builder.mutation<
      void,
      { listing_id: string; body: MarketListingUpdateBody }
    >({
      query: ({ listing_id, body }) => ({
        url: `${baseUrl}/listing/${listing_id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Listing" as const,
          id: arg.listing_id,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketUpdateAggregateAdmin: builder.mutation<
      void,
      {
        game_item_id: string
        body: AggregateListingUpdateBody
      }
    >({
      query: ({ game_item_id, body }) => ({
        url: `${baseUrl}/aggregate/${game_item_id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Listing" as const,
          id: arg.game_item_id,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketUpdateListingQuantity: builder.mutation<
      void,
      {
        listing_id: string
        body: { quantity_available: number }
      }
    >({
      query: ({ listing_id, body }) => ({
        url: `${baseUrl}/listing/${listing_id}/update_quantity`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Listing" as const,
          id: arg.listing_id,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketRefreshListing: builder.mutation<void, string>({
      query: (listing_id) => ({
        url: `${baseUrl}/listing/${listing_id}/refresh`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Listing" as const,
          id: arg,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketUpdateAggregateListingQuantity: builder.mutation<
      void,
      {
        listing_id: string
        body: { quantity_available: number }
      }
    >({
      query: ({ listing_id, body }) => ({
        url: `${baseUrl}/aggregate/listing/${listing_id}/update_quantity`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Listing" as const,
          id: arg.listing_id,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketCreateUserListing: builder.mutation<void, MarketListingBody>({
      query: (body) => ({
        url: `${baseUrl}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing" as const, user: arg },
        { type: "AllListings" as const },
      ],
    }),
    marketCreateBuyOrder: builder.mutation<void, MarketBuyOrderBody>({
      query: (body) => ({
        url: `${baseUrl}/buyorder/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Listing" as const }],
    }),
    marketFulfillBuyOrder: builder.mutation<
      Order,
      { buy_order_id: string; contractor_spectrum_id?: string }
    >({
      query: ({ buy_order_id, ...body }) => ({
        url: `${baseUrl}/buyorder/${buy_order_id}/fulfill`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Listing" as const }],
    }),
    marketCancelBuyOrder: builder.mutation<Order, string>({
      query: (buy_order_id) => ({
        url: `${baseUrl}/buyorder/${buy_order_id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Listing" as const }],
    }),
    marketCreateListing: builder.mutation<
      void,
      { body: MarketListingBody; spectrum_id?: string | null }
    >({
      query: ({ body, spectrum_id }) => ({
        url: spectrum_id
          ? `${baseUrl}/contractor/${spectrum_id}/create`
          : `${baseUrl}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.spectrum_id
          ? [
              { type: "AllListings" as const },
              { type: "ContractorListings" as const, id: arg.spectrum_id },
            ]
          : [{ type: "AllListings" as const }],
    }),
    marketCreateAggregateListing: builder.mutation<
      void,
      {
        body: AggregateMarketListingBody
        spectrum_id?: string | null
      }
    >({
      query: ({ body, spectrum_id }) => ({
        url: spectrum_id
          ? `${baseUrl}/aggregate/contractor/${spectrum_id}/create`
          : `${baseUrl}/aggregate/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.spectrum_id
          ? [
              { type: "AllListings" as const },
              { type: "ContractorListings" as const, id: arg.spectrum_id },
            ]
          : [{ type: "AllListings" as const }],
    }),
    marketCreateMultipleListing: builder.mutation<
      void,
      {
        body: MarketMultipleBody
        spectrum_id?: string | null
      }
    >({
      query: ({ body, spectrum_id }) => ({
        url: spectrum_id
          ? `${baseUrl}/multiple/contractor/${spectrum_id}/create`
          : `${baseUrl}/multiple/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.spectrum_id
          ? [
              { type: "AllListings" as const },
              { type: "ContractorListings" as const, id: arg.spectrum_id },
            ]
          : [{ type: "AllListings" as const }],
    }),
    marketUpdateMultipleListing: builder.mutation<
      void,
      Partial<MarketMultipleBody> & { multiple_id: string }
    >({
      query: (body) => ({
        url: `${baseUrl}/multiple/${body.multiple_id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AllListings" as const },
        { type: "Listing" as const, id: arg.multiple_id },
      ],
    }),
    marketPurchase: builder.mutation<
      {
        result: string
        offer_id: string
        session_id: string
        discord_invite: string | null
      },
      {
        body: {
          items: { listing_id: string; quantity: number }[]
          note?: string
          offer?: number | null
        }
        spectrum_id?: string | null
      }
    >({
      query: ({ body }) => ({
        url: `${baseUrl}/purchase`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AllListings" as const },
        { type: "Order" as const },
        ...arg.body.items.map((listing) => ({
          type: "Listing" as const,
          id: listing.listing_id,
        })),
      ],
    }),
    marketOffer: builder.mutation<
      void,
      {
        body: { offer: number; items: { listing_id: string; quantity: number } }
        spectrum_id?: string | null
      }
    >({
      query: ({ body }) => ({
        url: `${baseUrl}/offer`,
        method: "POST",
        body,
      }),
      // invalidatesTags: (result, error, arg) => [
      //     {type: 'Listing', id: arg.body.listing_id}, {type: 'Listing'},
      // ],
    }),
    marketAcceptOffer: builder.mutation<
      void,
      { listing_id: string; offer_id: string }
    >({
      query: (body) => ({
        url: `${baseUrl}/offer/accept`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg.listing_id },
      ],
    }),
    marketBid: builder.mutation<
      void,
      {
        body: { listing_id: string; bid: number }
        spectrum_id?: string | null
      }
    >({
      query: ({ body }) => ({
        url: `${baseUrl}/bid`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg.body.listing_id },
        { type: "Listing" as const },
      ],
    }),
    marketAcceptBid: builder.mutation<
      void,
      { listing_id: string; bid_id: string }
    >({
      query: (body) => ({
        url: `${baseUrl}/bid/accept`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg.listing_id },
      ],
    }),
    marketGetMine: builder.query<SellerListingType[], void>({
      query: () => `${baseUrl}/mine`,
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
    }),
    marketGetMyListings: builder.query<SellerListingType[], string | undefined>(
      {
        query: (spectrum_id) =>
          spectrum_id
            ? `${baseUrl}/contractor/${spectrum_id}/mine`
            : `${baseUrl}/mine`,
        providesTags: (result, error, arg) => [
          { type: "AllListings" as const },
        ],
      },
    ),
    marketGetMyOrg: builder.query<SellerListingType[], string>({
      query: (spectrum_id) => `${baseUrl}/contractor/${spectrum_id}/mine`,
      providesTags: (result, error, arg) => [
        { type: "AllListings" as const },
        {
          type: "ContractorListings",
          id: arg,
        },
      ],
    }),
    marketGetPublic: builder.query<MarketListingType[], void>({
      query: () => `${baseUrl}/public`,
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
    }),
    searchMarket: builder.query<
      { total: number; listings: MarketSearchResult[] },
      Partial<MarketSearchQuery>
    >({
      query: (params) => ({
        url: `${baseUrl}/public/search`,
        params,
      }),
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
    }),
    marketGetAllListings: builder.query<SellerListingType[], void>({
      query: () => `${baseUrl}/all_listings`,
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
    }),
    marketGetListingsByContractor: builder.query<SellerListingType[], string>({
      query: (spectrum_id) => `${baseUrl}/contractor/${spectrum_id}`,
      providesTags: (result, error, arg) => [
        {
          type: "ContractorListings",
          id: arg,
        },
        { type: "AllListings" as const },
      ],
    }),
    marketStats: builder.query<
      {
        total_orders: number
        total_order_value: number
        week_orders: number
        week_order_value: number
      },
      void
    >({
      query: () => `${baseUrl}/stats`,
    }),
    marketCategories: builder.query<
      { category: string; subcategory: string }[],
      void
    >({
      query: () => `${baseUrl}/categories`,
    }),
    marketItemsByCategory: builder.query<GameItem[], string>({
      query: (category) =>
        `${baseUrl}/category/${encodeURIComponent(category)}`,
    }),
  }),
})

export const {
  useMarketGetAllListingsQuery,
  useMarketUpdateListingQuantityMutation,
  useMarketUpdateAggregateListingQuantityMutation,
  useMarketCreateAggregateListingMutation,
  useMarketGetAggregateByIDQuery,
  useMarketGetAggregateChartByIDQuery,
  useMarketGetAggregateHistoryByIDQuery,
  useMarketGetAggregateListingByIDQuery,
  useMarketGetAggregatesQuery,
  useMarketGetListingByUserQuery,
  useMarketUpdateAggregateAdminMutation,
  useMarketCreateMultipleListingMutation,
  useMarketUpdateMultipleListingMutation,
  useMarketGetMyListingsQuery,
  useMarketGetMultipleByIDQuery,
  useMarketCreateBuyOrderMutation,
  useMarketFulfillBuyOrderMutation,
  useMarketCancelBuyOrderMutation,
  useSearchMarketQuery,
  useMarketStatsQuery,
  useMarketRefreshListingMutation,
  useMarketCategoriesQuery,
  useMarketItemsByCategoryQuery,
  useMarketGetBuyOrderListingsQuery,
} = marketApi
export const useGetListingByIDQuery =
  marketApi.endpoints.marketGetListingByID.useQuery
export const useGetListingsByContractor =
  marketApi.endpoints.marketGetListingsByContractor.useQuery
export const usePurchaseListing = marketApi.endpoints.marketPurchase.useMutation
export const useMarketBid = marketApi.endpoints.marketBid.useMutation
export const useMarketAcceptBid =
  marketApi.endpoints.marketAcceptBid.useMutation
export const useMarketAcceptOffer =
  marketApi.endpoints.marketAcceptOffer.useMutation
export const useUpdateMarketListing =
  marketApi.endpoints.marketUpdateListing.useMutation
export const useCreateListing =
  marketApi.endpoints.marketCreateListing.useMutation
export const useGetPublicListings = marketApi.endpoints.marketGetPublic.useQuery
