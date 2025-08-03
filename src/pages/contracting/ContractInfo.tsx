import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React, { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ViewContract } from "../../views/contracts/ViewContract"
import { ContractAppOpenContext } from "../../hooks/contract/ContractApp"
import { ContractApp } from "../../views/contracts/ContractApp"
import { useGetOrderByIdQuery } from "../../store/orders"
import { useTranslation } from "react-i18next"

export function ContractInfo(props: {}) {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const { data, error, isLoading } = useGetOrderByIdQuery(id!)

  const [appOpen, setAppOpen] = useState(false)

  return (
    <ContractAppOpenContext.Provider value={[appOpen, setAppOpen]}>
      <ContainerGrid sidebarOpen={true} maxWidth={appOpen ? "lg" : "md"}>
        <HeaderTitle>{t("contracts.contractTitle")}</HeaderTitle>
        {error && <Navigate to={"/404"} />}
        {/*TODO: Add contract skeleton*/}
        {!isLoading && <ViewContract listing={data!} />}
        {appOpen && <ContractApp />}
      </ContainerGrid>
    </ContractAppOpenContext.Provider>
  )
}
