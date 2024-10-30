import React, { useCallback, useState } from "react"
import { Button, Grid, Rating, TextField, Typography } from "@mui/material"
import { Section } from "../../components/paper/Section"
import { AddRounded, StarRounded } from "@mui/icons-material"
import { useCurrentOrder } from "../../hooks/order/CurrentOrder"
import { useLeaveOrderReviewMutation } from "../../store/orders"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { useTheme } from "@mui/material/styles"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { Order } from "../../datatypes/Order"

export function OrderReviewArea(props: {
  asCustomer?: boolean
  asContractor?: boolean
  order: Order
}) {
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)
  const { order } = props
  const theme = useTheme<ExtendedTheme>()

  const issueAlert = useAlertHook()

  const [
    addReview, // This is the mutation trigger
    // {isLoading}, // This is the destructured mutation result
  ] = useLeaveOrderReviewMutation()

  const submitReview = useCallback(
    async (event: any) => {
      // event.preventDefault();
      const res: { data?: any; error?: any } = await addReview({
        content: content,
        rating: rating,
        order_id: order.order_id,
        role: props.asCustomer ? "customer" : "contractor",
      })

      if (res?.data && !res?.error) {
        issueAlert({
          message: "Left review!",
          severity: "success",
        })

        setContent("")
      } else {
        issueAlert({
          message: `Failed to leave review! ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }
      return false
    },
    [addReview, content, order.order_id, props.asCustomer, rating, issueAlert],
  )

  return (
    <>
      <Section xs={12} lg={6} title={"Review"}>
        <Grid item xs={12}>
          Leave a review for{" "}
          {props.asContractor
            ? order.customer
            : order.contractor || order.assigned_to}
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            maxRows={5}
            minRows={5}
            value={content}
            onChange={(event: React.ChangeEvent<{ value: string }>) => {
              setContent(event.target.value)
            }}
            color={"secondary"}
            label={"Comment"}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{ textAlign: "left", verticalAlign: "middle" }}
            color={"text.secondary"}
          >
            Rating:{" "}
          </Typography>
          <Rating
            name="half-rating"
            defaultValue={0}
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue!)
            }}
            precision={0.5}
            size={"large"}
            color={"white"}
            icon={<StarRounded fontSize="inherit" />}
            emptyIcon={
              <StarRounded
                style={{ color: theme.palette.text.primary }}
                fontSize="inherit"
              />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent={"right"}>
            <Button
              color={"secondary"}
              startIcon={<AddRounded />}
              onClick={submitReview}
              variant={"contained"}
            >
              Leave Review
            </Button>
          </Grid>
        </Grid>
      </Section>
    </>
  )
}
