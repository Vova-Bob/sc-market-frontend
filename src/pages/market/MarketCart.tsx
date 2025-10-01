import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Page } from "../../components/metadata/Page"
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Link as MaterialLink,
  TextField,
  Typography,
} from "@mui/material"
import { Section } from "../../components/paper/Section"
import { useCookies } from "react-cookie"
import { CartItem, CartSeller } from "../../datatypes/Cart"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Link, useNavigate } from "react-router-dom"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { useGetUserByUsernameQuery } from "../../store/profile"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import {
  useGetMarketListingQuery,
  usePurchaseMarketListingMutation,
} from "../../store/market"
import { LocalOfferRounded } from "@mui/icons-material"
import { TrashCan } from "mdi-material-ui"
import LoadingButton from "@mui/lab/LoadingButton"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { BackArrow } from "../../components/button/BackArrow"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import { MarketAggregateListingComposite } from "../../datatypes/MarketListing"
import { NumericFormat } from "react-number-format"
import { formatCompleteListingUrl, formatMarketUrl } from "../../util/urls"
import { FALLBACK_IMAGE_URL } from "../../util/constants"
import { useTranslation } from "react-i18next"

export function CartItemEntry(props: {
  item: CartItem
  updateCart: () => void
  removeCartItem: (item: CartItem) => void
}) {
  const { t } = useTranslation()
  const { item, updateCart, removeCartItem } = props
  const { data: listing } = useGetMarketListingQuery(item.listing_id)
  const composite = listing as MarketAggregateListingComposite | undefined

  useEffect(() => {
    if (listing && item.price !== listing.listing.price) {
      item.price = listing.listing.price
      updateCart()
    }

    if (listing && item.quantity > listing.listing.quantity_available) {
      item.quantity = listing.listing.quantity_available
      updateCart()
    }
  }, [item, listing, updateCart])

  return (
    <Grid item xs={12}>
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item>
          <img
            height={128}
            width={128}
            src={(listing?.photos || [])[0] || FALLBACK_IMAGE_URL}
            alt={listing?.details?.description}
            style={{
              borderRadius: 3,
              objectFit: "cover",
            }}
            loading="lazy"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = FALLBACK_IMAGE_URL
            }}
          />
        </Grid>
        <Grid item sx={{ "& > *": { marginBottom: 1 } }}>
          <Box>
            <MaterialLink
              component={Link}
              to={listing ? formatCompleteListingUrl(listing) : ""}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <UnderlineLink
                color={"text.secondary"}
                variant={"h6"}
                sx={{
                  fontWeight: "600",
                }}
              >
                {listing?.details?.title}
              </UnderlineLink>
            </MaterialLink>
          </Box>
          <Box>
            <NumericFormat
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              thousandSeparator
              onValueChange={async (values, sourceInfo) => {
                item.quantity = +values.floatValue! || 1
                updateCart()
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {t("cart.ofAvailable", {
                      available: (
                        listing?.listing?.quantity_available || 0
                      ).toLocaleString(undefined),
                    })}
                  </InputAdornment>
                ),
                inputMode: "numeric",
              }}
              size="small"
              label={t("cart.quantity")}
              value={item.quantity}
              color={"secondary"}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box display={"flex"} justifyContent={"space-between"} width={240}>
            <Box sx={{ width: 120 }}>
              <Typography>{t("cart.price")}</Typography>
              <Typography>{t("cart.quantity")}</Typography>
            </Box>
            <Box sx={{ width: 120 }}>
              <Typography sx={{ textAlign: "right" }}>
                {(listing?.listing?.price || 0).toLocaleString(undefined)} aUEC
              </Typography>
              <Typography sx={{ textAlign: "right" }}>
                x {item.quantity.toLocaleString(undefined)}
              </Typography>
            </Box>
          </Box>
          <Divider light />
          <Box display={"flex"} justifyContent={"space-between"} width={240}>
            <Box sx={{ width: 120 }}>
              <Typography>{t("cart.subtotal")}</Typography>
            </Box>
            <Box sx={{ width: 120 }}>
              <Typography sx={{ textAlign: "right" }}>
                {(
                  (listing?.listing?.price || 0) * item.quantity
                ).toLocaleString(undefined)}{" "}
                aUEC
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button
              color={"error"}
              variant={"text"}
              startIcon={<TrashCan />}
              size={"small"}
              onClick={() => removeCartItem(item)}
            >
              {t("cart.remove")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export function CartSellerEntry(props: {
  seller: CartSeller
  updateCart: () => void
  removeSellerEntry: (item: CartSeller) => void
}) {
  const { t } = useTranslation()
  const { seller, updateCart, removeSellerEntry } = props
  const { data: user_seller } = useGetUserByUsernameQuery(
    seller.user_seller_id!,
    { skip: !seller.user_seller_id },
  )
  const { data: contractor_seller } = useGetContractorBySpectrumIDQuery(
    seller.contractor_seller_id!,
    { skip: !seller.contractor_seller_id },
  )

  useEffect(() => {
    if (seller.contractor_seller_id) {
      if (contractor_seller) {
        seller.note = contractor_seller.market_order_template
      }
    } else {
      if (user_seller) {
        seller.note = user_seller?.market_order_template
      }
    }

    updateCart()
  }, [user_seller, contractor_seller])

  const removeCartItem = useCallback(
    (item: CartItem) => {
      const index = seller.items.indexOf(item)
      seller.items.splice(index, 1)
      if (!seller.items.length) {
        removeSellerEntry(seller)
      } else {
        updateCart()
      }
    },
    [seller.items, updateCart],
  )

  const [
    purchaseListing, // This is the mutation trigger
    { isLoading: purchaseLoading }, // This is the destructured mutation result
  ] = usePurchaseMarketListingMutation()

  const total = useMemo(
    () =>
      seller.items
        .map((x) => x.quantity * (x.price || 0))
        .reduce((partialSum, a) => partialSum + a, 0),
    [seller.items],
  )

  useEffect(() => {
    setOffer(total)
  }, [total])

  const [offer, setOffer] = useState(total)

  const issueAlert = useAlertHook()

  const navigate = useNavigate()

  const handlePurchase = useCallback(
    async (offer: number | undefined | null) => {
      purchaseListing({
        ...seller,
        offer,
      })
        .unwrap()
        .then((res) => {
          issueAlert({
            message: t("cart.purchaseSuccess"),
            severity: "success",
          })
          removeSellerEntry(seller)

          if (res.discord_invite) {
            const newWindow = window.open(
              `https://discord.gg/${res.discord_invite}`,
              "_blank",
            )
            if (newWindow) {
              newWindow.focus()
            }
          }

          navigate(`/offer/${res.session_id}`)
        })
        .catch((error) => {
          issueAlert(error)
        })
    },
    [seller, purchaseListing, issueAlert],
  )

  return (
    <Section
      xs={12}
      title={t("cart.seller")}
      element_title={
        <MaterialLink
          component={Link}
          to={
            user_seller
              ? `/user/${user_seller?.username}`
              : `/contractor/${contractor_seller?.spectrum_id}`
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
            {user_seller?.display_name || contractor_seller?.name}
          </UnderlineLink>
        </MaterialLink>
      }
    >
      {seller.items.map((item) => (
        <CartItemEntry
          key={item.listing_id}
          item={item}
          updateCart={updateCart}
          removeCartItem={removeCartItem}
        />
      ))}
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant={"h5"} color={"text.secondary"}>
            {t("cart.total")}
          </Typography>

          <Typography variant={"h5"} color={"text.secondary"}>
            {total.toLocaleString(undefined)} aUEC
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <MarkdownEditor
          sx={{ marginRight: 2, marginBottom: 1 }}
          TextFieldProps={{
            label: t("cart.note"),
          }}
          value={seller.note || ""}
          onChange={(value: string) => {
            seller.note = value
            updateCart()
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        {t("cart.submitOfferDesc")}
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid
          container
          spacing={1}
          justifyContent={"right"}
          alignItems={"center"}
          sx={{ marginBottom: 2 }}
        >
          <Grid item>
            <Typography
              variant={"body1"}
              sx={{ marginRight: 1, alignItems: "center" }}
            >
              {t("cart.payTotal", { total: total.toLocaleString(undefined) })}
            </Typography>
          </Grid>
          {/*<Grid item>
            <LoadingButton
              color={"primary"}
              variant={"contained"}
              loadingPosition="start"
              startIcon={<AddShoppingCartRounded />}
              loading={purchaseLoading}
              onClick={() => handlePurchase(undefined)}
            >
              {t("cart.submitOrder")}
            </LoadingButton>
          </Grid>*/}
        </Grid>
        <Grid container spacing={1} justifyContent={"right"}>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <NumericFormat
                  decimalScale={0}
                  allowNegative={false}
                  customInput={TextField}
                  thousandSeparator
                  onValueChange={async (values, sourceInfo) => {
                    setOffer(+(values.floatValue || 0))
                    updateCart()
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{"aUEC"}</InputAdornment>
                    ),
                    inputMode: "numeric",
                  }}
                  size="small"
                  label={t("cart.offerOptional")}
                  value={offer}
                  color={"secondary"}
                />
              </Grid>
              <Grid item>
                <LoadingButton
                  color={"secondary"}
                  variant={"outlined"}
                  startIcon={<LocalOfferRounded />}
                  loading={purchaseLoading}
                  onClick={() => handlePurchase(offer)}
                >
                  {t("cart.submitOffer")}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Section>
  )
}

export function MarketCart() {
  const { t } = useTranslation()
  const [cookies, setCookie, deleteCookie] = useCookies(["market_cart"])
  const cart = cookies.market_cart

  const updateCart = useCallback(() => {
    setCookie("market_cart", cart, { path: "/", sameSite: "strict" })
  }, [cart, setCookie])

  const removeSellerEntry = useCallback(
    (item: CartSeller) => {
      const index = cart.indexOf(item)
      cart.splice(index, 1)
      updateCart()
    },
    [cart, updateCart],
  )

  return (
    <Page title={t("marketActions.myCart")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <Grid
          item
          container
          justifyContent={"space-between"}
          spacing={2}
          xs={12}
        >
          <HeaderTitle>
            <BackArrow /> {t("cart.yourCart")}
          </HeaderTitle>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={2}>
            {(cart || []).map((seller: CartSeller) => (
              <CartSellerEntry
                key={seller.contractor_seller_id || seller.user_seller_id}
                seller={seller}
                updateCart={updateCart}
                removeSellerEntry={removeSellerEntry}
              />
            ))}
            {(!cart || !cart.length) && (
              <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                <Typography variant={"h5"}>{t("cart.empty")}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
