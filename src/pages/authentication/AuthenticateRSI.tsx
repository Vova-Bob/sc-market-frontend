import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useGetUserProfileQuery } from "../../store/profile"
import { Navigate } from "react-router-dom"
import { Grid } from "@mui/material"
import { AuthenticateRSI } from "../../views/authentication/AuthenticateRSI"
import { Page } from "../../components/metadata/Page"

export function AuthenticateRSIPage() {
  const profile = useGetUserProfileQuery()

  return (
    <Page title={"Account Link"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={false}>
        {profile.data?.rsi_confirmed && <Navigate to={"/dashboard"} />}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={4} alignItems={"flex-start"}>
            <HeaderTitle>Authenticate with RSI</HeaderTitle>
            <AuthenticateRSI />
          </Grid>
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
