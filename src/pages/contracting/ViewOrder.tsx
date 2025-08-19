import { Link, Navigate, useParams } from "react-router-dom"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React, { useMemo } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { useGetOrderByIdQuery } from "../../store/orders"
import { Page } from "../../components/metadata/Page"
import { BackArrow } from "../../components/button/BackArrow"
import {
  Breadcrumbs,
  Grid,
  Link as MaterialLink,
  Skeleton,
} from "@mui/material"
import {
  OrderDetailsArea,
  OrderMessagesArea,
} from "../../views/orders/OrderDetailsArea"
import { useGetUserProfileQuery } from "../../store/profile"
import { OrderAvailabilityArea } from "../../views/orders/OrderAvailabilityArea"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { MemberAssignArea } from "../../views/orders/MemberAssignArea"
import { has_permission } from "../../views/contractor/OrgRoles"
import { OrderReviewArea } from "../../views/orders/OrderReviewArea"
import { OrderReviewView } from "../../views/orders/OrderReviewView"
import { useGetOfferSessionByIDQuery } from "../../store/offer"
import { OfferMarketListings } from "../../views/offers/OfferMarketListings"
import { OfferServiceArea } from "../../views/offers/OfferServiceArea"
import { useTranslation } from "react-i18next"

export function ViewOrder() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const { data: order, error } = useGetOrderByIdQuery(id!)
  const { data: profile } = useGetUserProfileQuery()
  const [currentOrg] = useCurrentOrg()

  const amCustomer = useMemo(
    () => !!profile && order?.customer === profile?.username,
    [order, profile],
  )
  const amAssigned = useMemo(
    () => order && order.assigned_to === profile?.username,
    [order, profile],
  )
  const amContractor = useMemo(
    () => currentOrg?.spectrum_id === order?.contractor,
    [currentOrg?.spectrum_id, order?.contractor],
  )
  const amRelated = useMemo(
    () => amCustomer || amAssigned || amContractor,
    [amCustomer, amAssigned, amContractor],
  )

  const amContractorManager = useMemo(
    () => amContractor && has_permission(currentOrg, profile, "manage_orders"),
    [currentOrg, profile, amContractor],
  )

  const isAssigned = useMemo(() => {
    if (!order) {
      return false
    }

    return !!(order.contractor || order.assigned_to)
  }, [order])

  const displayApply = useMemo(() => {
    if (!order) {
      return false
    }

    return (
      profile &&
      !(order.contractor || order.assigned_to) &&
      order.status === "not-started"
    )
  }, [order, profile])

  const displayApplicants = useMemo(() => {
    if (!order) {
      return false
    }

    return (
      amCustomer &&
      !order.assigned_to &&
      !order.contractor &&
      order.status === "not-started"
    )
  }, [amCustomer, order])

  const { data: session } = useGetOfferSessionByIDQuery(
    order?.offer_session_id!,
    { skip: !order?.offer_session_id },
  )

  return (
    <Page
      title={
        order?.title ? `${order?.title} - ${t("orders.orderTitle")}` : null
      }
    >
      <ContainerGrid sidebarOpen={true} maxWidth={"xl"}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <MaterialLink
              component={Link}
              to={"/dashboard"}
              underline="hover"
              color={"text.primary"}
            >
              {t("dashboard.title")}
            </MaterialLink>
            {order?.offer_session_id && (
              <MaterialLink
                component={Link}
                to={`/offer/${order?.offer_session_id}`}
                underline="hover"
                color={"text.secondary"}
              >
                {t("orders.offerShort", {
                  id: (order?.offer_session_id || "")
                    .substring(0, 8)
                    .toUpperCase(),
                })}
              </MaterialLink>
            )}

            <MaterialLink
              component={Link}
              to={`/contracts/${id}`}
              underline="hover"
              color={"text.secondary"}
            >
              {t("orders.orderShort", {
                id: (id || "").substring(0, 8).toUpperCase(),
              })}
            </MaterialLink>
          </Breadcrumbs>
        </Grid>
        <HeaderTitle>
          <BackArrow />
          {t("orders.viewOrder")}
        </HeaderTitle>

        {error ? <Navigate to={"/404"} /> : null}

        {order ? (
          <OrderDetailsArea order={order} />
        ) : (
          <Grid item xs={12} lg={8} md={6}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}

        {order ? (
          isAssigned ? (
            <OrderMessagesArea order={order} />
          ) : null
        ) : (
          <Grid item xs={12} lg={4} md={6}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}

        {order?.offer_session_id &&
          (session ? (
            <OfferServiceArea offer={session} />
          ) : (
            <Grid item xs={12} lg={4}>
              <Skeleton width={"100%"} height={400} />
            </Grid>
          ))}

        {order?.offer_session_id &&
          (session ? (
            <OfferMarketListings offer={session} />
          ) : (
            <Grid item xs={12} lg={4}>
              <Skeleton width={"100%"} height={400} />
            </Grid>
          ))}

        {order && (
          <>
            {amCustomer && !order.customer_review && (
              <OrderReviewArea asCustomer order={order} />
            )}
            {(amContractorManager || amAssigned) &&
              !order.contractor_review && (
                <OrderReviewArea asContractor order={order} />
              )}
            {order.customer_review && (
              <OrderReviewView customer order={order} />
            )}
            {order.contractor_review && (
              <OrderReviewView contractor order={order} />
            )}
          </>
        )}

        {amContractorManager &&
          order &&
          !["cancelled", "fulfilled"].includes(order.status) && (
            <MemberAssignArea order={order} />
          )}
        {amRelated && order && <OrderAvailabilityArea order={order} />}
      </ContainerGrid>
    </Page>
  )
}
