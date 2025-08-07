import { BACKEND_URL } from "../util/constants"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import i18n from "../util/i18n"

export const serviceApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept-Language", i18n.language)
      return headers
    },
  }),
  endpoints: (builder) => ({}),
  reducerPath: "serviceApi",
  refetchOnReconnect: true,
  tagTypes: [
    "RecruitingPostComments",
    "RecruitingPosts",
    "RecruitingPost",
    "Comment",
    "Order",
    "Orders",
    "Profile",
    "MyProfile",
    "Listing",
    "Contractor",
    "MyShips",
    "Service",
    "OrderWebhook",
    "ContractorInvite",
    "AllListings",
    "ContractorListings",
    "Chat",
    "Notifications",
    "Aggregates",
    "Aggregate",
    "Offers",
    "Offer",
    "PublicContracts",
  ],
})
