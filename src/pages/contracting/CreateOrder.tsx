import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { CreateOrderForm } from "../../views/orders/CreateOrderForm"
import { MyOrders } from "../../views/orders/MyOrders"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { useGetServiceByIdQuery } from "../../store/services"
import { Navigate, useParams } from "react-router-dom"
import { ServiceView } from "../../views/contracts/ServiceView"
import { SentOffersArea } from "../../views/offers/ReceivedOffersArea"
import { CreatePublicContract } from "../../views/contracts/CreatePublicContract"
import { useTranslation } from "react-i18next"

export function CreateOrder(props: {}) {
  const { t } = useTranslation()
  return (
    <Page title={t("orders.ordersTitle")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          {t("orders.ordersTitle")}
        </HeaderTitle>

        <SentOffersArea />
        <MyOrders />

        <HeaderTitle>{t("contracts.createPublicContract")}</HeaderTitle>
        <CreatePublicContract />
      </ContainerGrid>
    </Page>
  )
}

export function ServiceCreateOrder() {
  const { t } = useTranslation()
  const { service_id } = useParams<{ service_id: string }>()
  const { data: service, isError } = useGetServiceByIdQuery(service_id!)

  return (
    <Page title={t("orders.createOrderTitle")}>
      <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
        {/*<HeaderTitle lg={12} xl={12}>*/}
        {/*    Orders*/}
        {/*</HeaderTitle>*/}

        {isError && <Navigate to={"/404"} />}

        {service && <ServiceView service={service} />}
        {service && (
          <CreateOrderForm
            service={service}
            contractor_id={service.contractor?.spectrum_id}
            assigned_to={service.user?.username}
          />
        )}
      </ContainerGrid>
    </Page>
  )
}
