import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Link as MaterialLink,
  TextField,
  Typography,
} from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { getRelativeTime } from "../../util/time"
import { Section } from "../../components/paper/Section"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import {
  AddShoppingCartRounded,
  CreateRounded,
  GavelRounded,
  PersonRounded,
  RefreshRounded,
} from "@mui/icons-material"
import { useCurrentMarketListing } from "../../hooks/market/CurrentMarketItem"
import { BaseListingType, UniqueListing } from "../../datatypes/MarketListing"
import { UserList } from "../../components/list/UserList"
import {
  useMarketBidMutation,
  useMarketPurchaseMutation,
} from "../../store/market"
import { OrderList } from "../../components/list/OrderList"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { Bids } from "./Bids"
import { Helmet } from "react-helmet"
import { useCookies } from "react-cookie"
import { Cart } from "../../datatypes/Cart"
import { ListingNameAndRating } from "../../components/rating/ListingRating"
import { has_permission } from "../contractor/OrgRoles"
import { useTheme } from "@mui/material/styles"
import { BACKEND_URL } from "../../util/constants"
import { NumericFormat } from "react-number-format"
import { Stack } from "@mui/system"
import { ImagePreviewPaper } from "../../components/paper/ImagePreviewPaper"
import moment from "moment"
import { ClockAlert } from "mdi-material-ui"

export function ListingDetailItem(props: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
      {props.icon}
      <Typography color={"text.primary"} variant={"subtitle2"}>
        {props.children}
      </Typography>
    </Stack>
  )
}

export function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.abs((utc2 - utc1) / _MS_PER_DAY)
}

export function PurchaseArea(props: { listing: BaseListingType }) {
  const { listing } = props
  const [quantity, setQuantity] = useState(1)
  const [offer, setOffer] = useState(1)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const containerRef = React.useRef(null)
  const issueAlert = useAlertHook()

  const { data: profile } = useGetUserProfileQuery()
  const location = useLocation()

  const [cookies, setCookie] = useCookies(["market_cart"])
  const [cartRedirect, setCartRedirect] = useState(false)

  const addToCart = useCallback(async () => {
    if (!profile) {
      window.location.href = `${BACKEND_URL}/auth/discord?path=${encodeURIComponent(
        location.pathname === "/" ? "/market" : location.pathname,
      )}`
      return
    }

    const cart: Cart = cookies.market_cart || []
    let found = false
    for (const seller of cart) {
      if (
        seller.contractor_seller_id &&
        seller.contractor_seller_id ===
          listing.listing.contractor_seller?.spectrum_id
      ) {
        const entry = seller.items.find(
          (l) => l.listing_id === listing.listing.listing_id,
        )
        if (entry) {
          entry.quantity = Math.min(
            entry.quantity + quantity,
            listing.listing.quantity_available,
          )
        } else {
          seller.items.push({
            listing_id: listing.listing.listing_id,
            quantity,
            type: listing.type,
          })
        }
        found = true
        break
      } else if (
        seller.user_seller_id &&
        seller.user_seller_id === listing.listing.user_seller?.username
      ) {
        const entry = seller.items.find(
          (l) => l.listing_id === listing.listing.listing_id,
        )
        if (entry) {
          entry.quantity = Math.min(
            entry.quantity + quantity,
            listing.listing.quantity_available,
          )
        } else {
          seller.items.push({
            listing_id: listing.listing.listing_id,
            quantity,
            type: listing.type,
          })
        }
        found = true
        break
      }
    }

    if (!found) {
      cart.push({
        user_seller_id: listing.listing.user_seller?.username,
        contractor_seller_id: listing.listing.contractor_seller?.spectrum_id,
        items: [
          {
            listing_id: listing.listing.listing_id,
            quantity,
            type: listing.type,
          },
        ],
      })
    }

    setCookie("market_cart", cart, { path: "/", sameSite: "strict" })
    issueAlert({
      message: `Added to cart!`,
      severity: "success",
    })
    setCartRedirect(true)
  }, [
    cookies.market_cart,
    listing.listing.contractor_seller?.spectrum_id,
    listing.listing.listing_id,
    listing.listing.quantity_available,
    listing.listing.user_seller?.username,
    listing.type,
    location.pathname,
    profile,
    quantity,
    issueAlert,
    setCookie,
  ])

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
      }}
    >
      {cartRedirect && <Navigate to={"/market/cart"} />}
      <Stack direction={"row"} justifyContent={"space-between"} padding={2}>
        <Stack
          spacing={1}
          direction={"column"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography
              variant={"body1"}
              fontWeight={"bold"}
              color={"text.secondary"}
            >
              Price
            </Typography>
            <Typography
              variant={"h5"}
              sx={{
                fontWeight: "bold",
              }}
              // color={'primary'}
            >
              {listing.listing.price.toLocaleString(undefined)} aUEC
            </Typography>
          </Box>
          <NumericFormat
            decimalScale={0}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            onValueChange={async (values, sourceInfo) => {
              setQuantity(values.floatValue || 0)
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {`of ${listing.listing.quantity_available.toLocaleString(
                    undefined,
                  )} available`}
                </InputAdornment>
              ),
              inputMode: "numeric",
            }}
            size="small"
            label={"Quantity"}
            value={quantity}
            color={"secondary"}
          />
        </Stack>
        <Stack
          spacing={1}
          direction={"column"}
          justifyContent={"space-between"}
        >
          <Box />
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<AddShoppingCartRounded />}
            size={"large"}
            onClick={addToCart}
            sx={{
              display: purchaseOpen || offerOpen ? "none" : undefined,
              marginBottom: 1,
            }}
          >
            Add to Cart
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

function BidArea(props: { listing: UniqueListing }) {
  const { listing } = props
  const [bid, setBid] = useState(
    listing.listing.price + listing.auction_details!.minimum_bid_increment,
  )

  const issueAlert = useAlertHook()

  const [purchaseListing, { isLoading }] = useMarketBidMutation()

  const handleBid = useCallback(async () => {
    const res: { data?: any; error?: any } = await purchaseListing({
      body: { listing_id: listing.listing.listing_id, bid },
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Bid successful!",
        severity: "success",
      })
      setBid(bid + listing.auction_details!.minimum_bid_increment)
    } else {
      // console.log(res.error)
      issueAlert({
        message: `Error while bidding! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
  }, [
    bid,
    listing.auction_details,
    listing.listing.listing_id,
    purchaseListing,
    issueAlert,
  ])

  return (
    <Box
      sx={{
        padding: 2,
        "& > *": {
          marginRight: 1,
        },
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          variant={"h5"}
          sx={{
            marginBottom: 2,
            fontWeight: "bold",
          }}
        >
          Current Bid: {listing.listing.price.toLocaleString(undefined)} aUEC
        </Typography>
        <NumericFormat
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          onValueChange={async (values, sourceInfo) => {
            setBid(values.floatValue || 0)
          }}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{`aUEC`}</InputAdornment>
            ),
            inputMode: "numeric",
          }}
          size="small"
          label={"Bid"}
          value={bid}
          color={"secondary"}
          disabled={listing.listing.status === "archived"}
        />
      </Box>
      <Box>
        <LoadingButton
          variant={"outlined"}
          color={"secondary"}
          startIcon={<GavelRounded />}
          size={"large"}
          disabled={
            bid <
              listing.listing.price +
                listing.auction_details!.minimum_bid_increment ||
            listing.listing.status === "archived"
          }
          onClick={handleBid}
          loading={isLoading}
        >
          Place Bid
        </LoadingButton>
      </Box>
    </Box>
  )
}

export function MarketListingView() {
  // TODO: Update listing details
  const [complete] = useCurrentMarketListing<UniqueListing>()
  const { listing, details, photos, auction_details } = complete
  const { data: profile } = useGetUserProfileQuery()
  const [currentOrg] = useCurrentOrg()

  const amContractor = useMemo(
    () =>
      profile &&
      currentOrg?.spectrum_id === listing.contractor_seller?.spectrum_id,
    [currentOrg?.spectrum_id, listing?.contractor_seller],
  )
  const amSeller = useMemo(
    () =>
      profile &&
      profile?.username === listing.user_seller?.username &&
      !currentOrg,
    [currentOrg, listing?.user_seller?.username, profile?.username],
  )

  const amContractorManager = useMemo(
    () => amContractor && has_permission(currentOrg, profile, "manage_market"),
    [currentOrg, profile, amContractor],
  )

  const [timeDisplay, setTimeDisplay] = useState(
    auction_details ? getRelativeTime(new Date(auction_details.end_time)) : "",
  )

  useEffect(() => {
    if (auction_details) {
      const interval = setInterval(
        () =>
          auction_details &&
          setTimeDisplay(getRelativeTime(new Date(auction_details.end_time))),
        1000,
      )
      return () => {
        clearInterval(interval)
      }
    }
  }, [auction_details, listing])

  const ending = useMemo(
    () =>
      timeDisplay.endsWith("seconds") ||
      timeDisplay.endsWith("minutes") ||
      timeDisplay.endsWith("minute") ||
      timeDisplay.endsWith("minute"),
    [timeDisplay],
  )

  const amRelated = useMemo(
    () => amSeller || amContractorManager || profile?.role === "admin",
    [amSeller, amContractorManager, profile?.role],
  )

  // const {data: contractor} = useGetContractorBySpectrumIDQuery(listing.listing.contractor_seller?.spectrum_id!, {skip: !listing.listing.contractor_seller})

  return (
    <>
      <Grid item xs={12} lg={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <ImagePreviewPaper photos={photos} />

                <Helmet>
                  <meta name="description" content={details.description} />
                  <meta name="thumbnail" content={photos[0]} />

                  <meta property="og:description" content={details.description} />
                  <meta property="og:image" content={photos[0]} />

                  <script type="application/ld+json">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Product",
                      seller: {
                        "@type": listing.contractor_seller
                          ? "Contractor"
                          : "User",
                        name:
                          listing.contractor_seller?.name ||
                          listing.user_seller?.display_name,
                      },
                      description: details.description,
                      name: details.title,
                      price: `${listing.price} aUEC`,
                      kind: details.item_type,
                      image: photos[0],
                      offers: {
                        "@type": "Offer",
                        url: `https://sc-market.space/market/${listing.listing_id}`,
                        priceCurrency: "JPY",
                        price: listing.price,
                        // "priceValidUntil": "2020-11-20",
                        // "itemCondition": "https://schema.org/NewCondition",
                        availability:
                          listing.quantity_available > 0
                            ? "https://schema.org/InStock"
                            : "https://schema.org/OutOfStock",
                      },
                    })}
                  </script>
                </Helmet>
              </Grid>

              {amRelated && (
                <Grid item lg={12} xs={12}>
                  <Grid container spacing={2}>
                    <Section
                      disablePadding
                      xs={12}
                      title={"People"}
                      innerJustify={"flex-start"}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          paddingTop: 2,
                          paddingBottom: 2,
                          boxSizing: "border-box",
                        }}
                      >
                        <UserList
                          users={[
                            listing.user_seller || listing.contractor_seller,
                          ]}
                          title={"Seller"}
                        />
                        {/*{*/}
                        {/*    amRelated &&*/}
                        {/*    (*/}
                        {/*        <UserList users={[]}*/}
                        {/*                  title={listing.sale_type === 'sale' ? 'Customers' : 'Bidders'}/>*/}
                        {/*    )*/}
                        {/*}*/}
                      </Grid>
                    </Section>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Fade in={true}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      minHeight: 400,
                    }}
                  >
                    <CardHeader
                      disableTypography
                      sx={{
                        padding: 3,
                        paddingBottom: 1,
                      }}
                      title={
                        <Stack
                          direction={"column"}
                          alignItems={"left"}
                          spacing={1}
                          justifyContent={"left"}
                        >
                          <Breadcrumbs
                            aria-label="breadcrumb"
                            color={"text.primary"}
                          >
                            <MaterialLink
                              component={Link}
                              underline="hover"
                              color="inherit"
                              to="/market"
                            >
                              Market
                            </MaterialLink>
                            <MaterialLink
                              component={Link}
                              underline="hover"
                              color="inherit"
                              to={`/market?type=${encodeURIComponent(
                                details.item_type,
                              )}`}
                            >
                              {details.item_type}
                            </MaterialLink>
                            {details.item_name && (
                              <MaterialLink
                                component={Link}
                                underline="hover"
                                color="text.secondary"
                                to={`/market?query=${encodeURIComponent(
                                  details.item_name,
                                )}`}
                              >
                                {details.item_name}
                              </MaterialLink>
                            )}
                          </Breadcrumbs>
                          <Typography
                            sx={{
                              marginRight: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                            variant={"h5"}
                            color={"text.secondary"}
                            fontWeight={"bold"}
                          >
                            {details.title}{" "}
                            <Typography
                              display={"inline"}
                              sx={{ marginLeft: 1 }}
                            >
                              {dateDiffInDays(
                                new Date(),
                                new Date(listing.timestamp),
                              ) <= 1 && (
                                <Chip
                                  color={"secondary"}
                                  label={"New"}
                                  sx={{
                                    marginRight: 1,
                                    textTransform: "uppercase",
                                    fontSize: "0.85em",
                                    fontWeight: "bold",
                                  }}
                                />
                              )}
                            </Typography>
                          </Typography>
                          {auction_details && (
                            <Typography
                              display={"inline"}
                              color={ending ? "error.light" : "inherit"}
                            >
                              {timeDisplay.endsWith("ago")
                                ? "Ended"
                                : "Ending in"}{" "}
                              {timeDisplay}
                            </Typography>
                          )}
                        </Stack>
                      }
                      subheader={
                        <Stack direction={"column"} alignItems={"left"}>
                          <ListingDetailItem
                            icon={<PersonRounded fontSize={"inherit"} />}
                          >
                            <ListingNameAndRating
                              user={listing.user_seller}
                              contractor={listing.contractor_seller}
                            />
                          </ListingDetailItem>

                          <ListingDetailItem
                            icon={<CreateRounded fontSize={"inherit"} />}
                          >
                            Listed{" "}
                            {getRelativeTime(new Date(listing.timestamp))}
                          </ListingDetailItem>

                          <ListingDetailItem
                            icon={<RefreshRounded fontSize={"inherit"} />}
                          >
                            Updated{" "}
                            {getRelativeTime(
                              moment(listing.expiration)
                                .subtract(30, "days")
                                .toDate(),
                            )}
                          </ListingDetailItem>

                          <ListingDetailItem
                            icon={<ClockAlert fontSize={"inherit"} />}
                          >
                            Expires{" "}
                            {getRelativeTime(new Date(listing.expiration))}
                          </ListingDetailItem>
                        </Stack>
                      }
                      action={
                        <Stack direction={"row"} spacing={1}>
                          {/*<ReportListingButton />*/}

                          {amRelated &&
                          listing.status !== "archived" &&
                          listing.sale_type !== "auction" ? (
                            <Link
                              to={`/market_edit/${listing.listing_id}`}
                              style={{ color: "inherit" }}
                            >
                              <IconButton>
                                <CreateRounded style={{ color: "inherit" }} />
                              </IconButton>
                            </Link>
                          ) : undefined}
                        </Stack>
                      }
                    />
                    <CardContent
                      sx={{
                        width: "auto",
                        minHeight: 192,
                        padding: 3,
                        paddingTop: 0,
                      }}
                    >
                      {listing.status === "active" && (
                        <>
                          <Divider light />
                          {listing.sale_type === "auction" ? (
                            <BidArea listing={complete as UniqueListing} />
                          ) : (
                            <PurchaseArea listing={complete} />
                          )}
                          <Divider light />
                        </>
                      )}
                      <Box sx={{ paddingTop: 2 }}>
                        <Typography
                          variant={"subtitle1"}
                          fontWeight={"bold"}
                          color={"text.secondary"}
                        >
                          Description
                        </Typography>
                        <Typography variant={"body2"}>
                          <MarkdownRender text={details.description} />
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
              {/*{*/}
              {/*    amRelated && (listing.sale_type === 'sale') &&*/}
              {/*    <Offers listing={listing}/>*/}
              {/*}*/}
              {amRelated &&
                listing.sale_type === "auction" &&
                (complete as UniqueListing).bids && (
                  <Bids listing={complete as UniqueListing} />
                )}

              {amRelated && !!listing.orders?.length && (
                <Section
                  disablePadding
                  xs={12}
                  title={"Active Orders"}
                  innerJustify={"flex-start"}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: 2,
                      paddingBottom: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <OrderList
                      orders={listing.orders.filter(
                        (o) => !["cancelled", "fulfilled"].includes(o.status),
                      )}
                    />
                  </Grid>
                </Section>
              )}

              {amRelated && !!listing.orders?.length && (
                <Section
                  disablePadding
                  xs={12}
                  title={"Previous Orders"}
                  innerJustify={"flex-start"}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: 2,
                      paddingBottom: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <OrderList
                      orders={listing.orders.filter((o) =>
                        ["cancelled", "fulfilled"].includes(o.status),
                      )}
                    />
                  </Grid>
                </Section>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
