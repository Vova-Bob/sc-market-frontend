import { Button, Grid, Link, TextField, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Section } from "../../components/paper/Section"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import {
  RecruitingPost,
  useRecruitingCreatePostMutation,
  useRecruitingUpdatePostMutation,
} from "../../store/recruiting"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import throttle from "lodash/throttle"
import { RecruitingPostView } from "./RecruitingPostView"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { MarkdownEditor } from "../../components/markdown/Markdown"

export interface RecruitingPostState {
  title: string
  body: string
}

export function CreateRecruitingPost(props: { post?: RecruitingPost }) {
  const { post } = props
  const [state, setState] = React.useState<RecruitingPostState>({
    title: "",
    body: "",
  })

  useEffect(() => {
    if (post) {
      setState({
        title: post.title,
        body: post.body,
      })
    }
  }, [post])

  const issueAlert = useAlertHook()
  const [contractor] = useCurrentOrg()

  const [
    createPost, // This is the mutation trigger
  ] = useRecruitingCreatePostMutation()
  const [
    updatePost, // This is the mutation trigger
  ] = useRecruitingUpdatePostMutation()

  const submitPost = useCallback(
    async (event: any) => {
      // event.preventDefault();
      let res: { data?: any; error?: any }

      if (!post) {
        res = await createPost({
          ...state,
          contractor: contractor!.spectrum_id,
        })
      } else {
        res = await updatePost({
          body: state,
          post_id: post.post_id,
        })
      }

      if (res?.data && !res?.error) {
        setState({
          title: "",
          body: "",
        })

        issueAlert({
          message: "Submitted!",
          severity: "success",
        })

        window.location.href = `/recruiting/post/${res.data.post_id}`
      } else {
        issueAlert({
          message: `Failed to submit! ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }
      return false
    },
    [contractor, createPost, post, issueAlert, state, updatePost],
  )

  const [stateBuffer, setStateBuffer] = useState(state)

  const updateStateBuffer = React.useMemo(
    () =>
      throttle(async (s) => {
        setStateBuffer(s)
      }, 2000),
    [setStateBuffer],
  )

  useEffect(() => {
    updateStateBuffer(state)
  }, [state, updateStateBuffer])

  const fullPost: RecruitingPost = useMemo(
    () => ({
      ...stateBuffer,
      post_id: "",
      contractor: contractor!,
      timestamp: Date.now(),
      comments: [],
      upvotes: 25,
      downvotes: 4,
    }),
    [stateBuffer, contractor],
  )

  return (
    <>
      {/*TODO: Make it only update render every second or so*/}
      <RecruitingPostView post={fullPost} />
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            About
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              label="Title*"
              fullWidth
              id="order-title"
              value={state.title}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, title: event.target.value })
              }}
              color={"secondary"}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant={"body2"}>
              Github flavored markdown is enabled, YouTube URLs will
              automatically embed, and images can be embedded as long as they
              are hosted from Imgur or RSI. See{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={
                  "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                }
              >
                <UnderlineLink color={"text.secondary"}>here</UnderlineLink>
              </Link>{" "}
              for details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <MarkdownEditor
              TextFieldProps={{
                label: "Description*",
              }}
              value={state.body}
              onChange={(value: string) => {
                setState({ ...state, body: value })
              }}
              noPreview
            />
          </Grid>
        </Grid>
      </Section>

      <Grid item xs={12} container justifyContent={"right"}>
        <Button
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          onClick={submitPost}
        >
          Submit
        </Button>
      </Grid>
    </>
  )
}
