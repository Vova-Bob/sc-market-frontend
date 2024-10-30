import { HeaderTitle } from "../../components/typography/HeaderTitle"
import React from "react"
import { Divider, Grid } from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Page } from "../../components/metadata/Page"
import { CreateRecruitingPost } from "../../views/recruiting/CreateRecruitingPost"
import { Navigate, useParams } from "react-router-dom"
import { useRecruitingGetPostByIDQuery } from "../../store/recruiting"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function CreateRecruitingPostPage() {
  return (
    <Page title={"Create Post"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle>Create Post</HeaderTitle>

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

  const { data: post, isError } = useRecruitingGetPostByIDQuery(post_id!)
  const [currentOrg] = useCurrentOrg()

  return (
    <Page title={"Create Post"}>
      {isError && <Navigate to={"/404"} />}

      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle>Update Post</HeaderTitle>

        <Grid item xs={12}>
          <Divider light />
        </Grid>

        {currentOrg && <CreateRecruitingPost post={post} />}
      </ContainerGrid>
    </Page>
  )
}
