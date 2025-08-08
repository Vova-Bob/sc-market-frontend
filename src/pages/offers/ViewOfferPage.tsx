import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React, { useEffect } from "react"
import { useGetOfferSessionByIDQuery } from "../../store/offer"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  OfferDetailsArea,
  OfferMessagesArea,
} from "../../views/offers/OfferDetailsArea"
import {
  Breadcrumbs,
  Grid,
  Link as MaterialLink,
  Skeleton,
} from "@mui/material"
import { OfferMarketListings } from "../../views/offers/OfferMarketListings"
import { OfferServiceArea } from "../../views/offers/OfferServiceArea"
import { useTranslation } from "react-i18next"

export function ViewOfferPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useGetOfferSessionByIDQuery(id!)
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Redirect to order if offer has an associated order
  useEffect(() => {
    if (session?.order_id) {
      navigate(`/contract/${session.order_id}`, { replace: true })
    }
  }, [session?.order_id, navigate])

  return (
    <Page title={t("offers.viewOffer")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <MaterialLink
              component={Link}
              to={"/dashboard"}
              underline="hover"
              color={"text.primary"}
            >
              {t("offers.dashboard")}
            </MaterialLink>
            <MaterialLink
              component={Link}
              to={`/offer/${id}`}
              underline="hover"
              color={"text.secondary"}
            >
              {t("offers.offer")} {(id || "").substring(0, 8).toUpperCase()}
            </MaterialLink>
          </Breadcrumbs>
        </Grid>

        <HeaderTitle lg={12} xl={12}>
          {t("offers.viewOffer")}
        </HeaderTitle>

        {session ? (
          <OfferDetailsArea session={session} />
        ) : (
          <Grid item xs={12} lg={8} md={6}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}

        {session ? (
          <OfferMessagesArea offer={session} />
        ) : (
          <Grid item xs={12} lg={4} md={6}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}

        {session ? (
          <OfferServiceArea offer={session} />
        ) : (
          <Grid item xs={12} lg={4}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}

        {session ? (
          <OfferMarketListings offer={session} />
        ) : (
          <Grid item xs={12} lg={4}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}
      </ContainerGrid>
    </Page>
  )
}

export default ViewOfferPage
