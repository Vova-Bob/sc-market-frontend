import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { RecentOrders } from "../../views/orders/RecentOrders"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { OrgOrderTrend } from "../../views/orders/OrderTrend"
import { ReceivedOffersArea } from "../../views/offers/ReceivedOffersArea"

export function OrgOrders() {
  return (
    <Page title={"Org Orders"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>Orders</HeaderTitle>

        {/*<OrderBreakdown/>*/}
        {/*<OrderTrend/>*/}
        <ReceivedOffersArea />
        <RecentOrders />
        <OrgOrderTrend />
      </ContainerGrid>
    </Page>
  )
}
