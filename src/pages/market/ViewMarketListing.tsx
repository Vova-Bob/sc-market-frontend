import { Link, Navigate, useParams } from "react-router-dom"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { CurrentMarketListingContext } from "../../hooks/market/CurrentMarketItem"
import {
  useMarketGetListingByIDQuery,
  useMarketGetMultipleByIDQuery,
} from "../../store/market"
import { MarketListingView } from "../../views/market/MarketListingView"
import { Page } from "../../components/metadata/Page"
import { MarketListingEditView } from "../../views/market/MarketListingEditView"
import { Button, Grid } from "@mui/material"
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded"
import { BackArrow } from "../../components/button/BackArrow"
import { MarketMultipleEditView } from "../../views/market/MarketMultipleEditView"
import { formatMarketUrl } from "../../util/urls"

export function ViewMarketListing(props: {}) {
  const { id } = useParams<{ id: string }>()

  /*
   * TODO:
   *   Contract appliants
   *   Accept applicant, update order status,
   *   order comments, update date,
   *   assigned person, payment
   */

  const { data: listing, error, refetch } = useMarketGetListingByIDQuery(id!)

  return (
    <Page
      title={listing?.details?.title}
      canonUrl={listing && formatMarketUrl(listing)}
    >
      <ContainerGrid sidebarOpen={true} maxWidth={"xl"}>
        <Grid
          item
          container
          justifyContent={"space-between"}
          spacing={2}
          xs={12}
        >
          <HeaderTitle md={7} lg={7} xl={7}>
            <BackArrow /> View Market Listing
          </HeaderTitle>

          <Grid item>
            <Link
              to={"/market/cart"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button
                color={"secondary"}
                startIcon={<ShoppingCartRoundedIcon />}
                variant={"contained"}
                size={"large"}
              >
                My Cart
              </Button>
            </Link>
          </Grid>
        </Grid>

        {error ? <Navigate to={"/404"} /> : null}
        {listing && (
          <CurrentMarketListingContext.Provider value={[listing!, refetch]}>
            {(() => {
              return <MarketListingView />

              // if (order.data!.customer === profile.data?.username) {
              //     return <ManageOrderOwner/>
              // } else if (order.data!.assigned_to === profile.data?.username) {
              //     return <ManageOrderOrg/>
              // } else {
              //     return <ViewPublicOrder/>
              // }
            })()}
          </CurrentMarketListingContext.Provider>
        )}
        {/* TODO: Add a skeleton to this section */}
      </ContainerGrid>
    </Page>
  )
}

export function EditMarketListing(props: {}) {
  const { id } = useParams<{ id: string }>()

  /*
   * TODO:
   *   Contract appliants
   *   Accept applicant, update order status,
   *   order comments, update date,
   *   assigned person, payment
   */

  const { data: listing, error, refetch } = useMarketGetListingByIDQuery(id!)

  return (
    <Page title={listing?.details?.title}>
      <ContainerGrid sidebarOpen={true} maxWidth={"lg"}>
        <HeaderTitle>
          <BackArrow /> Edit Market Listing
        </HeaderTitle>

        {error ? <Navigate to={"/404"} /> : null}
        {listing && (
          <CurrentMarketListingContext.Provider value={[listing!, refetch]}>
            {(() => {
              return <MarketListingEditView />

              // if (order.data!.customer === profile.data?.username) {
              //     return <ManageOrderOwner/>
              // } else if (order.data!.assigned_to === profile.data?.username) {
              //     return <ManageOrderOrg/>
              // } else {
              //     return <ViewPublicOrder/>
              // }
            })()}
          </CurrentMarketListingContext.Provider>
        )}
        {/* TODO: Add a skeleton to this section */}
      </ContainerGrid>
    </Page>
  )
}

export function EditMultipleListing(props: {}) {
  const { id } = useParams<{ id: string }>()

  const { data: listing, error, refetch } = useMarketGetMultipleByIDQuery(id!)

  return (
    <Page title={listing?.details?.title}>
      <ContainerGrid sidebarOpen={true} maxWidth={"lg"}>
        <HeaderTitle>
          <BackArrow /> Edit Multiple Listing
        </HeaderTitle>

        {error ? <Navigate to={"/404"} /> : null}
        {listing && (
          <CurrentMarketListingContext.Provider value={[listing!, refetch]}>
            {(() => {
              return <MarketMultipleEditView />

              // if (order.data!.customer === profile.data?.username) {
              //     return <ManageOrderOwner/>
              // } else if (order.data!.assigned_to === profile.data?.username) {
              //     return <ManageOrderOrg/>
              // } else {
              //     return <ViewPublicOrder/>
              // }
            })()}
          </CurrentMarketListingContext.Provider>
        )}
        {/* TODO: Add a skeleton to this section */}
      </ContainerGrid>
    </Page>
  )
}
