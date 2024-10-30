import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { CreateServiceForm } from "../../views/orders/CreateService"
import { useParams } from "react-router-dom"
import { useGetServiceByIdQuery } from "../../store/services"
import { Page } from "../../components/metadata/Page"

export function CreateService(props: {}) {
  return (
    <Page title={"Create Service"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          Create Service
        </HeaderTitle>

        {/*Order template list here, and create order form button*/}
        <CreateServiceForm />
      </ContainerGrid>
    </Page>
  )
}

export function UpdateService() {
  const { service_id } = useParams<{ service_id: string }>()
  const { data: service } = useGetServiceByIdQuery(service_id!)
  return (
    <Page title={"Update Service"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle lg={12} xl={12}>
          Update Service
        </HeaderTitle>

        <CreateServiceForm service={service} />
      </ContainerGrid>
    </Page>
  )
}
