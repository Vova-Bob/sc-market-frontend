import React from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { Navigate, useParams } from "react-router-dom"
import { Contractor } from "../../datatypes/Contractor"
import { OrgInfo, OrgInfoSkeleton } from "../../views/contractor/OrgInfo"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Skeleton } from "@mui/material"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { Page } from "../../components/metadata/Page"
import { BackArrow } from "../../components/button/BackArrow"

export function ViewOrg() {
  const { id } = useParams<{ id: string }>()

  const contractor = useGetContractorBySpectrumIDQuery(id!)

  return (
    <Page
      title={contractor.data?.name ? `${contractor.data?.name} - Org` : null}
    >
      {contractor.isLoading ? (
        <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
          <OrgSectionSkeleton />
        </ContainerGrid>
      ) : contractor.error ? (
        <Navigate to={"/404"} />
      ) : (
        <OrgInfo contractor={contractor.data!} />
      )}
    </Page>
  )
}

export function MyOrg() {
  const [contractor] = useCurrentOrg()

  return (
    <Page title={"My Org"}>
      {!contractor ? (
        <Navigate to={"/404"} />
      ) : (
        <OrgInfo contractor={contractor} />
      )}
    </Page>
  )
}

export function OrgSectionSkeleton() {
  return (
    <React.Fragment>
      <HeaderTitle>
        <Skeleton width={500} variant={"text"} />
      </HeaderTitle>
      <OrgInfoSkeleton />
    </React.Fragment>
  )
}
