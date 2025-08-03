import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { CreateServiceForm } from "../../views/orders/CreateService"
import { useParams } from "react-router-dom"
import { useGetServiceByIdQuery } from "../../store/services"
import { Page } from "../../components/metadata/Page"
import { useTranslation } from "react-i18next"

export function CreateService(props: {}) {
  const { t } = useTranslation()
  return (
    <Page title={t("services.createService")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          {t("services.createService")}
        </HeaderTitle>

        {/*Order template list here, and create order form button*/}
        <CreateServiceForm />
      </ContainerGrid>
    </Page>
  )
}

export function UpdateService() {
  const { t } = useTranslation()
  const { service_id } = useParams<{ service_id: string }>()
  const { data: service } = useGetServiceByIdQuery(service_id!)
  return (
    <Page title={t("services.updateService")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          {t("services.updateService")}
        </HeaderTitle>

        <CreateServiceForm service={service} />
      </ContainerGrid>
    </Page>
  )
}
