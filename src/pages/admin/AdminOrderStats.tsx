import React from "react"
import { Page } from "../../components/metadata/Page"
import { useGetOrderAnalyticsQuery } from "../../store/admin"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import {
  OrderAnalyticsCharts,
  TopContractorsAnalytics,
  TopUsersAnalytics,
  OrderSummary,
} from "../../views/orders/OrderAnalytics"
import { AdminRecentOrders } from "../../views/orders/RecentOrders"
import { useTranslation } from "react-i18next"
import { Skeleton, Grid } from "@mui/material"

export function AdminOrderStats() {
  const { t } = useTranslation()
  const { data: analytics, isLoading, error } = useGetOrderAnalyticsQuery()

  if (isLoading) {
    return (
      <Page title={t("admin.orderStats", "Admin Order Stats")}>
        <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
          <Grid item xs={12}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Skeleton width={"100%"} height={300} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Skeleton width={"100%"} height={300} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Skeleton width={"100%"} height={200} />
          </Grid>
        </ContainerGrid>
      </Page>
    )
  }

  if (error || !analytics) {
    return (
      <Page title={t("admin.orderStats", "Admin Order Stats")}>
        <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
          <Grid item xs={12}>
            <div>Error loading analytics data</div>
          </Grid>
        </ContainerGrid>
      </Page>
    )
  }

  return (
    <Page title={t("admin.orderStats", "Admin Order Stats")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <OrderAnalyticsCharts analytics={analytics} />
        <TopContractorsAnalytics analytics={analytics} />
        <TopUsersAnalytics analytics={analytics} />
        <OrderSummary analytics={analytics} />
        <AdminRecentOrders />
      </ContainerGrid>
    </Page>
  )
}
