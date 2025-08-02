import React, { useMemo } from "react"
import {
  Box,
  CardActionArea,
  CardMedia,
  Grid,
  Link as MaterialLink,
  Rating,
  Typography,
} from "@mui/material"
import { Section } from "../../components/paper/Section"
import { StarRounded } from "@mui/icons-material"
import { useCurrentOrder } from "../../hooks/order/CurrentOrder"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { Link } from "react-router-dom"
import { getRelativeTime } from "../../util/time"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { useTheme } from "@mui/material/styles"
import { Order } from "../../datatypes/Order"
import { useTranslation } from "react-i18next"

export function OrderReviewView(props: {
  customer?: boolean
  contractor?: boolean
  order: Order
}) {
  const { order } = props
  const { t } = useTranslation()
  const theme = useTheme<ExtendedTheme>()
  const review = useMemo(
    () => (props.customer ? order.customer_review! : order.contractor_review!),
    [order.contractor_review, order.customer_review, props.customer],
  )

  return (
    <>
      <Section xs={12} lg={6} title={t("orderReviewView.review")}>
        <Grid item xs={8}>
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
            <MaterialLink
              component={Link}
              to={
                review.user_author
                  ? `/user/${review.user_author.username}`
                  : `/contractor/${review.contractor_author?.spectrum_id}`
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <UnderlineLink
                color={"text.primary"}
                variant={"h6"}
                sx={{
                  fontWeight: "600",
                }}
              >
                {review.user_author?.display_name ||
                  review.contractor_author!.name}
              </UnderlineLink>
            </MaterialLink>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {getRelativeTime(new Date(review.timestamp!))}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <CardActionArea
            component={Link}
            to={
              review.user_author
                ? `/user/${review.user_author.username}`
                : `/contractor/${review.contractor_author?.spectrum_id}`
            }
          >
            <CardMedia
              component="img"
              loading="lazy"
              sx={{ width: 96, objectFit: "cover", borderRadius: 2 }}
              image={
                review.user_author
                  ? review.user_author.avatar
                  : review.contractor_author!.avatar
              }
              alt={
                review.user_author
                  ? review.user_author.display_name
                  : review.contractor_author!.name
              }
            />
          </CardActionArea>
        </Grid>
        <Grid item xs={12}>
          <Typography>{review.content}</Typography>
          <br />

          <Typography
            sx={{ textAlign: "left", verticalAlign: "middle" }}
            color={"text.secondary"}
          >
            {t("orderReviewView.ratingLabel")}
          </Typography>
          <Rating
            name="half-rating"
            defaultValue={0}
            value={review.rating}
            readOnly
            precision={0.5}
            size={"large"}
            icon={<StarRounded fontSize="inherit" />}
            emptyIcon={
              <StarRounded
                style={{ color: theme.palette.text.primary }}
                fontSize="inherit"
              />
            }
          />
        </Grid>
      </Section>
    </>
  )
}
