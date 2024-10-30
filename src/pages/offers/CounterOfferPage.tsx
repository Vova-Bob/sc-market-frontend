import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React, { useEffect, useState } from "react"
import {
  CounterOfferBody,
  useGetOfferSessionByIDQuery,
} from "../../store/offer"
import { Link, useParams } from "react-router-dom"
import {
  Breadcrumbs,
  Grid,
  Link as MaterialLink,
  Skeleton,
  Typography,
} from "@mui/material"
import { OfferDetailsEditArea } from "../../views/offers/OfferDetailsEditArea"
import { CounterOfferSubmitArea } from "../../views/offers/CounterOfferSubmitArea"
import { CounterOfferDetailsContext } from "../../hooks/offer/CounterOfferDetails"
import { OfferServiceEditArea } from "../../views/offers/OfferServiceEditArea"
import { OfferMarketListingsEditArea } from "../../views/offers/OfferMarketListingsEditArea"

export function CounterOfferPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useGetOfferSessionByIDQuery(id!)

  const [counterOffer, setCounterOffer] = useState<CounterOfferBody>({
    cost: "0",
    description: "",
    kind: "",
    market_listings: [],
    payment_type: "",
    service_id: null,
    title: "",
    session_id: id || "",
    status: "counteroffered",
  })

  useEffect(() => {
    if (session) {
      setCounterOffer({
        cost: session.offers[0].cost,
        description: session.offers[0].description,
        kind: session.offers[0].kind,
        payment_type: session.offers[0].payment_type,
        session_id: session.id,
        service_id: session.offers[0].service?.service_id ?? null,
        title: session.offers[0].title,
        market_listings: session.offers[0].market_listings,
        status: "counteroffered",
      })
    }
  }, [session])

  return (
    <Page title={"View Offer"}>
      <CounterOfferDetailsContext.Provider
        value={[counterOffer, setCounterOffer]}
      >
        <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
          <Grid item xs={12}>
            <Breadcrumbs>
              <MaterialLink
                component={Link}
                to={"/dashboard"}
                underline="hover"
                color={"text.primary"}
              >
                Dashboard
              </MaterialLink>
              <MaterialLink
                component={Link}
                to={"/offers/received"}
                underline="hover"
                color={"text.primary"}
              >
                Received Offers
              </MaterialLink>
              <MaterialLink
                component={Link}
                to={"/offers/received"}
                underline="hover"
                color={"text.primary"}
              >
                Offer {(id || "").substring(0, 8).toUpperCase()}
              </MaterialLink>
              <Typography color={"text.secondary"}>Counter Offer</Typography>
            </Breadcrumbs>
          </Grid>

          <HeaderTitle lg={12} xl={12}>
            View Offer
          </HeaderTitle>

          {session ? (
            <OfferDetailsEditArea session={session} />
          ) : (
            <Grid item xs={12} lg={8} md={6}>
              <Skeleton width={"100%"} height={400} />
            </Grid>
          )}

          {session ? (
            <OfferServiceEditArea offer={session} />
          ) : (
            <Grid item xs={12} lg={4}>
              <Skeleton width={"100%"} height={400} />
            </Grid>
          )}

          {session ? (
            <OfferMarketListingsEditArea offer={session} />
          ) : (
            <Grid item xs={12} lg={8}>
              <Skeleton width={"100%"} height={400} />
            </Grid>
          )}

          {session && <CounterOfferSubmitArea session={session} />}
        </ContainerGrid>
      </CounterOfferDetailsContext.Provider>
    </Page>
  )
}
