import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { Authenticate } from "../../views/authentication/Authenticate"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useGetUserProfileQuery } from "../../store/profile"
import { Navigate } from "react-router-dom"
import { LoginInfoPanel } from "./LoginInfoPanel"
import { Grid } from "@mui/material"
import { RegisterShip } from "../../views/fleet/RegisterShip"
import { DashNotificationArea } from "../../views/notifications/DashNotificationArea"
import { AuthenticateRSI } from "../../views/authentication/AuthenticateRSI"

export function Login() {
  const profile = useGetUserProfileQuery()

  return (
    <ContainerGrid maxWidth={"xl"} sidebarOpen={false}>
      {!profile.isLoading && !profile.error && <Navigate to={"/dashboard"} />}
      <Grid item xs={12} lg={8} container spacing={4}>
        <HeaderTitle></HeaderTitle>
        <LoginInfoPanel />
      </Grid>

      <Grid item xs={12} lg={4}>
        <Grid container spacing={4} alignItems={"flex-start"}>
          <HeaderTitle>Login</HeaderTitle>
          <AuthenticateRSI />
        </Grid>
      </Grid>

      <RegisterShip />
      <DashNotificationArea />
    </ContainerGrid>
  )
}
