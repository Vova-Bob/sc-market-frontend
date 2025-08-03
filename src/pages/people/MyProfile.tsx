import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React from "react"
import { Navigate } from "react-router-dom"
import { ProfileSkeleton, ViewProfile } from "../../views/people/ViewProfile"
import {
  useGetUserByUsernameQuery,
  useGetUserProfileQuery,
} from "../../store/profile"
import { Page } from "../../components/metadata/Page"
import { useTheme } from "@mui/material/styles"
import { useTranslation } from "react-i18next"

export function MyProfile() {
  const { data: profile, error, isLoading } = useGetUserProfileQuery()
  const { data: user } = useGetUserByUsernameQuery(profile?.username!)
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Page title={t("viewProfile.myProfile")}>
      {error && <Navigate to={"/"} />}
      {user ? (
        <ViewProfile profile={user!} />
      ) : (
        <ContainerGrid
          sidebarOpen={true}
          maxWidth={"xxl"}
          sx={{ paddingTop: theme.spacing(4) }}
        >
          <ProfileSkeleton />
        </ContainerGrid>
      )}
    </Page>
  )
}
