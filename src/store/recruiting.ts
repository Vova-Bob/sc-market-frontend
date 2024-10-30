import { serviceApi } from "./service"
import { MinimalUser } from "../datatypes/User"
import { Contractor } from "../datatypes/Contractor"
import { RecruitingSearchState } from "../hooks/recruiting/RecruitingSearch"

export interface Comment {
  comment_id: string
  author: MinimalUser | null
  content: string
  replies: Comment[]
  timestamp: number
  upvotes: number
  downvotes: number
  deleted: boolean
}

export interface RecruitingPost {
  post_id: string
  contractor: Contractor
  title: string
  body: string
  timestamp: number
  upvotes: number
  downvotes: number
}

// Define a service using a base URL and expected endpoints
export const recruitingApi = serviceApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    recruitingGetAllPosts: builder.query<
      { total: number; items: RecruitingPost[] },
      { index: number; pageSize: number } & RecruitingSearchState
    >({
      query: (params) => ({ url: `/api/recruiting/posts`, params }),
      providesTags: ["RecruitingPosts"],
    }),
    recruitingGetPostByID: builder.query<RecruitingPost, string>({
      query: (id) => `/api/recruiting/post/${id}`,
      providesTags: (result, error, post_id) => [
        "RecruitingPosts",
        {
          type: "RecruitingPosts" as const,
          id: post_id,
        },
      ],
    }),
    recruitingGetPostCommentsByID: builder.query<Comment[], string>({
      query: (id) => `/api/recruiting/post/${id}/comments`,
      providesTags: (result, error, post_id) => [
        {
          type: "RecruitingPostComments" as const,
          id: post_id,
        },
      ],
    }),
    recruitingGetPostByOrg: builder.query<RecruitingPost, string>({
      query: (id) => `/api/recruiting/org/${id}`,
      providesTags: (result, error, spectrum_id) => [
        "RecruitingPosts",
        {
          type: "RecruitingPosts" as const,
          id: result?.post_id,
        },
      ],
    }),
    recruitingCreatePost: builder.mutation<
      void,
      { contractor: string; title: string; body: string }
    >({
      query: (body) => ({
        url: `/api/recruiting/post/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecruitingPosts" as const],
    }),
    recruitingUpdatePost: builder.mutation<
      void,
      { post_id: string; body: { title: string; body: string } }
    >({
      query: ({ post_id, body }) => ({
        url: `/api/recruiting/post/${post_id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "RecruitingPosts" as const,
        {
          type: "RecruitingPosts" as const,
          id: arg.post_id,
        },
      ],
    }),
    recruitingUpvotePost: builder.mutation<{ already_voted: boolean }, string>({
      query: (post_id) => ({
        url: `/api/recruiting/post/${post_id}/upvote`,
        method: "POST",
      }),
      // invalidatesTags: (result, error, post_id) => ['RecruitingPosts' as const, {
      //     type: "RecruitingPosts" as const,
      //     id: post_id
      // }]
    }),
    recruitingDownvotePost: builder.mutation<void, string>({
      query: (post_id) => ({
        url: `/api/recruiting/post/${post_id}/downvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, post_id) => [
        "RecruitingPosts" as const,
        {
          type: "RecruitingPosts" as const,
          id: post_id,
        },
      ],
    }),
    recruitingCommentOnPost: builder.mutation<
      void,
      { post_id: string; content: string; reply_to?: string }
    >({
      query: ({ post_id, content, reply_to }) => ({
        url: `/api/recruiting/post/${post_id}/comment`,
        method: "POST",
        body: { content, reply_to },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "RecruitingPostComments" as const,
          id: arg.post_id,
        },
      ],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRecruitingCreatePostMutation,
  useRecruitingGetAllPostsQuery,
  useRecruitingGetPostByIDQuery,
  useRecruitingGetPostByOrgQuery,
  useRecruitingUpvotePostMutation,
  useRecruitingDownvotePostMutation,
  useRecruitingUpdatePostMutation,
  useRecruitingCommentOnPostMutation,
  useRecruitingGetPostCommentsByIDQuery,
} = recruitingApi
