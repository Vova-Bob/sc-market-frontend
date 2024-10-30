import React, { useState } from "react"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import {
  RecruitingPost,
  useRecruitingCommentOnPostMutation,
  useRecruitingGetPostByIDQuery,
  useRecruitingGetPostByOrgQuery,
  useRecruitingGetPostCommentsByIDQuery,
} from "../../store/recruiting"
import {
  RecruitingPostSkeleton,
  RecruitingPostView,
} from "../../views/recruiting/RecruitingPostView"
import { Navigate, useParams } from "react-router-dom"
import { CommentTree } from "../../views/comments/CommentTree"
import { Box, Button, Grid, TextField } from "@mui/material"

export function PostCommentArea(props: { post: RecruitingPost }) {
  const { post } = props
  const [submitCommentPost] = useRecruitingCommentOnPostMutation()
  const [content, setContent] = useState("")
  const { data: comments } = useRecruitingGetPostCommentsByIDQuery(post.post_id)

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ marginTop: 2 }} display={"flex"} alignItems={"center"}>
          <TextField
            fullWidth
            sx={{ marginRight: 2 }}
            value={content}
            label={"Reply to Post"}
            multiline
            onChange={(event: React.ChangeEvent<{ value: string }>) => {
              setContent(event.target.value)
            }}
          />

          <Button
            onClick={() => {
              submitCommentPost({ content, post_id: post!.post_id })
              setContent("")
            }}
          >
            Post
          </Button>
        </Box>
      </Grid>

      {(comments || []).map((c, i) => (
        <CommentTree comment={c} post={post} depth={0} key={i} />
      ))}
    </>
  )
}

export function RecruitingPostArea(props: { spectrum_id: string }) {
  const { data: post } = useRecruitingGetPostByOrgQuery(props.spectrum_id)

  return (
    <>
      {post ? <RecruitingPostView post={post} /> : <RecruitingPostSkeleton />}
      {post && <PostCommentArea post={post} />}
    </>
  )
}

export function RecruitingPostPage() {
  const { post_id } = useParams<{ post_id: string }>()

  const { data: post, isError } = useRecruitingGetPostByIDQuery(post_id!)

  return (
    <Page title={"Create Post"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        {isError && <Navigate to={"/404"} />}
        {post ? <RecruitingPostView post={post} /> : <RecruitingPostSkeleton />}
        {post && <PostCommentArea post={post} />}
      </ContainerGrid>
    </Page>
  )
}
