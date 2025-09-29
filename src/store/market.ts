import { BACKEND_URL } from "../util/constants"
import {
  AggregateListingUpdateBody,
  AggregateMarketListingBody,
  BaseListingType,
  GameItem,
  GameItemDescription,
  MarketAggregate,
  MarketAggregateListing,
  MarketBuyOrderBody,
  MarketListing,
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
  statuses?: string
  internal?: string
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
  // Add responsive badge data
  total_assignments: number | null
  response_rate: number | null
  title: string
  photo: string
  timestamp: number
  auction_end_time: number
  expiration: string
}

const baseUrl = `${BACKEND_URL}/api/market`
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
    marketGetListingOrders: builder.query<
      { data: Order[]; pagination: any },
      {
        listing_id: string;
        page?: number;
        pageSize?: number;
        status?: string[];
        sortBy?: 'timestamp' | 'status';
        sortOrder?: 'asc' | 'desc';
      }
    >({
      query: ({ listing_id, page = 1, pageSize = 20, status, sortBy = 'timestamp', sortOrder = 'desc' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          sortBy,
          sortOrder,
        });
        
        if (status && status.length > 0) {
          status.forEach(s => params.append('status', s));
        }
        
        return `${baseUrl}/listing/${listing_id}/orders?${params.toString()}`;
      },
      providesTags: (result, error, arg) => [
        { type: "Orders" as const, id: arg.listing_id },
      ],
      serializeQueryArgs: ({ queryArgs }) => {
        const { listing_id, page, pageSize, status, sortBy, sortOrder } = queryArgs;
        return {
          listing_id,
          page,
          pageSize,
          status: status ? [...status].sort().join(',') : undefined, // Create new array and sort for consistent cache keys
          sortBy,
          sortOrder,
        };
      },
    }),
    marketGetGameItemByName: builder.query<GameItemDescription, string>({
      query: (name) => `${baseUrl}/item/${encodeURIComponent(name)}`,
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
      MarketListing,
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
      // Add better caching strategy
      keepUnusedDataFor: 300, // Keep data for 5 minutes
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
    }),
    marketGetAllListings: builder.query<SellerListingType[], void>({
      query: () => `${baseUrl}/all_listings`,
      providesTags: (result, error, arg) => [{ type: "AllListings" as const }],
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
    marketUploadListingPhotos: builder.mutation<
      { message: string; photo_urls: string[] },
      {
        listing_id: string
        photos: File[]
      }
    >({
      query: ({ listing_id, photos }) => {
        const formData = new FormData()
        photos.forEach((photo, index) => {
          formData.append(`photos`, photo)
        })

        return {
          url: `${baseUrl}/listing/${listing_id}/photos`,
          method: "POST",
          body: formData,
          // Don't set Content-Type header, let the browser set it with boundary for multipart/form-data
        }
      },
      invalidatesTags: (result, error, arg) => [
        // Invalidate the specific listing by ID
        { type: "Listing" as const, id: arg.listing_id },
        // Invalidate general listing tags to ensure all listing queries are refreshed
        { type: "Listing" as const },
        // Invalidate all listings to ensure list views are updated
        { type: "AllListings" as const },
        // Invalidate any cached listing data that might include this listing
        "Listing",
        "AllListings",
      ],
    }),
    marketTrackListingView: builder.mutation<
      { message: string },
      { listing_id: string }
    >({
      query: ({ listing_id }) => ({
        url: `${baseUrl}/listing/${listing_id}/view`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing" as const, id: arg.listing_id },
        { type: "Listing" as const },
      ],
    }),
    marketGetSellerAnalytics: builder.query<
      {
        market_listings: number
        services: number
        total_market_views: number
        total_service_views: number
        time_period: string
      },
      { period?: "7d" | "30d" | "90d" }
    >({
      query: ({ period = "30d" }) => ({
        url: `${baseUrl}/seller/analytics?period=${period}`,
        method: "GET",
      }),
      providesTags: ["SellerAnalytics"],
    }),
  }),
})

export const {
  useMarketGetAllListingsQuery,
  useMarketUpdateListingQuantityMutation,
  useMarketCreateAggregateListingMutation,
  useMarketGetAggregateByIDQuery,
  useMarketGetAggregateChartByIDQuery,
  useMarketGetAggregateHistoryByIDQuery,
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
  useMarketPurchaseMutation,
  useMarketGetListingByIDQuery,
  useMarketGetListingOrdersQuery,
  useMarketGetGameItemByNameQuery,
  useMarketBidMutation,
  useMarketAcceptBidMutation,
  useMarketUpdateListingMutation,
  useMarketCreateListingMutation,
  useMarketGetPublicQuery,
  useMarketUploadListingPhotosMutation,
  useMarketTrackListingViewMutation,
  useMarketGetSellerAnalyticsQuery,
} = marketApi
