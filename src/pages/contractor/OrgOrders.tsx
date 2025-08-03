import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { RecentOrders } from "../../views/orders/RecentOrders"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { OrgOrderTrend } from "../../views/orders/OrderTrend"
import { ReceivedOffersArea } from "../../views/offers/ReceivedOffersArea"
import { useTranslation } from "react-i18next"

export function OrgOrders() {
  const { t } = useTranslation()
  return (
    <Page title={t("orders.orgOrdersTitle")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>{t("orders.ordersTitle")}</HeaderTitle>

        {/*<OrderBreakdown/>*/}
        {/*<OrderTrend/>*/}
        <ReceivedOffersArea />
        <RecentOrders />
        <OrgOrderTrend />
      </ContainerGrid>
    </Page>
  )
}
