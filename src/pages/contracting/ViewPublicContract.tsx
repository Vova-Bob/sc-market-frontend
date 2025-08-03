import {
  PublicContract,
  useGetPublicContractQuery,
} from "../../store/public_contracts"
import { Link, useParams } from "react-router-dom"
import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import {
  Breadcrumbs,
  Grid,
  Link as MaterialLink,
  Skeleton,
} from "@mui/material"
import React from "react"
import { BackArrow } from "../../components/button/BackArrow"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { PageBody404 } from "../errors/Error404"
import { ContractDetailsArea } from "../../views/contracts/ContractDetailsArea"
import { ContractOfferForm } from "../../views/contracts/ContractOfferForm"
import { useGetUserProfileQuery } from "../../store/profile"
import { useTranslation } from "react-i18next"

export function ViewPublicContractBody(props: { contract: PublicContract }) {
  const { contract } = props
  const { data: profile } = useGetUserProfileQuery()

  return (
    <>
      <ContractDetailsArea contract={contract} />
      {profile && <ContractOfferForm contract={contract} />}
    </>
  )
}

export function ViewPublicContract() {
  const { t } = useTranslation()
  const { contract_id } = useParams<{ contract_id: string }>()
  const { data: contract, isError } = useGetPublicContractQuery(
    contract_id || "",
  )

  return (
    <Page title={`${contract?.title} - ${t("contracts.publicOrderTitle")}`}>
      <ContainerGrid sidebarOpen={true} maxWidth={"lg"}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <MaterialLink
              component={Link}
              to={"/contracts"}
              underline="hover"
              color={"text.primary"}
            >
              {t("contracts.publicContracts")}
            </MaterialLink>

            <MaterialLink
              component={Link}
              to={`/contracts/public/${contract_id}`}
              underline="hover"
              color={"text.secondary"}
            >
              {t("contracts.contractShort", {
                id: (contract_id || "").substring(0, 8).toUpperCase(),
              })}
            </MaterialLink>
          </Breadcrumbs>
        </Grid>
        <HeaderTitle>
          <BackArrow />
          {t("contracts.viewContract")}
        </HeaderTitle>

        {isError ? (
          <PageBody404 />
        ) : contract ? (
          <ViewPublicContractBody contract={contract} />
        ) : (
          <Grid item xs={12}>
            <Skeleton width={"100%"} height={800} />
          </Grid>
        )}
      </ContainerGrid>
    </Page>
  )
}
