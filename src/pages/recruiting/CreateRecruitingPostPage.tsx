import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { Divider, Grid } from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { CreateRecruitingPost } from "../../views/recruiting/CreateRecruitingPost"
import { Navigate, useParams } from "react-router-dom"
import { useRecruitingGetPostByIDQuery } from "../../store/recruiting"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useTranslation } from "react-i18next"
import {
  shouldRedirectTo404,
  shouldShowErrorPage,
} from "../../util/errorHandling"
import { ErrorPage } from "../errors/ErrorPage"

export function CreateRecruitingPostPage() {
  const { t } = useTranslation()

  return (
    <Page title={t("recruiting_post.page.createPost")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle>{t("recruiting_post.page.createPost")}</HeaderTitle>

        <Grid item xs={12}>
          <Divider light />
        </Grid>

        <CreateRecruitingPost />
      </ContainerGrid>
    </Page>
  )
}

export function UpdateRecruitingPostPage() {
  const { post_id } = useParams<{ post_id: string }>()
  const { t } = useTranslation()

  const { data: post, error, isError } = useRecruitingGetPostByIDQuery(post_id!)
  const [currentOrg] = useCurrentOrg()

  return (
    <Page title={t("recruiting_post.page.updatePost")}>
      {shouldRedirectTo404(error) && <Navigate to={"/404"} />}
      {shouldShowErrorPage(error) && <ErrorPage />}

      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle>{t("recruiting_post.page.updatePost")}</HeaderTitle>

        <Grid item xs={12}>
          <Divider light />
        </Grid>

        {currentOrg && <CreateRecruitingPost post={post} />}
      </ContainerGrid>
    </Page>
  )
}
