import React from "react"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Button, Divider, Grid, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { Page } from "../../components/metadata/Page"
import { useTranslation } from "react-i18next"

export function PageBody404() {
  const { t } = useTranslation()
  return (
    <>
      <Grid item xs={12}>
        <Typography
          variant={"h3"}
          sx={{ fontWeight: "bold" }}
          color={"text.secondary"}
          align={"center"}
        >
          {t("error404.title")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant={"subtitle2"}
          color={"text.primary"}
          align={"center"}
        >
          {t("error404.subtitle")}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Grid>

      <Grid item>
        <Link
          to={"/dashboard"}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button color={"secondary"} variant={"outlined"}>
            {t("error404.returnToDashboard")}
          </Button>
        </Link>
      </Grid>
    </>
  )
}

export function Error404() {
  const { t } = useTranslation()
  return (
    <Page title={"404"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <PageBody404 />
      </ContainerGrid>
    </Page>
  )
}
