import {
  RecruitingPost,
  useRecruitingDownvotePostMutation,
  useRecruitingUpvotePostMutation,
} from "../../store/recruiting"
import { Button, ButtonGroup } from "@mui/material"
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material"
import React from "react"
import { Comment as RecruitingComment } from "../../store/recruiting"
import {
  Comment,
  useCommentsDownvoteMutation,
  useCommentsUpvoteMutation,
} from "../../store/comments"

export function CommentVotes(props: {
  comment: Comment | RecruitingComment
  post?: RecruitingPost
}) {
  const { comment, post } = props

  const [
    doUpvote, // This is the mutation trigger
  ] = useCommentsUpvoteMutation()

  const [
    doDownvote, // This is the mutation trigger
  ] = useCommentsDownvoteMutation()

  return (
    <ButtonGroup orientation={"vertical"} variant={"text"} size={"small"}>
      <Button
        color={"success"}
        startIcon={<KeyboardArrowUpRounded />}
        onClick={() =>
          doUpvote({ comment_id: comment.comment_id, post_id: post?.post_id })
        }
      >
        {comment.upvotes}
      </Button>
      <Button
        color={"error"}
        startIcon={<KeyboardArrowDownRounded />}
        onClick={() =>
          doDownvote({ comment_id: comment.comment_id, post_id: post?.post_id })
        }
      >
        {comment.downvotes}
      </Button>
    </ButtonGroup>
  )
}
