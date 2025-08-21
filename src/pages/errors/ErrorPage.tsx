import React from "react"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Button, Divider, Grid, Typography } from "@mui/material"
import { Page } from "../../components/metadata/Page"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { RefreshRounded } from "@mui/icons-material"

export function ErrorPageBody() {
  const { t } = useTranslation()
  const location = useLocation()

  const handleRetry = () => {
    // Full page reload to avoid getting stuck in error loops
    window.location.reload()
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography
          variant={"h3"}
          sx={{ fontWeight: "bold" }}
          color={"text.secondary"}
          align={"center"}
        >
          {t("errorPage.title", "Something went wrong")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant={"subtitle2"}
          color={"text.primary"}
          align={"center"}
        >
          {t(
            "errorPage.subtitle",
            "We encountered an error while loading this page. This could be due to a temporary server issue or network problem.",
          )}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Grid>

      <Grid item>
        <Button
          color={"primary"}
          variant={"contained"}
          size={"large"}
          startIcon={<RefreshRounded />}
          onClick={handleRetry}
        >
          {t("errorPage.retry", "Try Again")}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant={"body2"}
          color={"text.secondary"}
          align={"center"}
          sx={{ mt: 2 }}
        >
          {t("errorPage.path", "Page")}: <code>{location.pathname}</code>
        </Typography>
      </Grid>
    </>
  )
}

export function ErrorPage() {
  const { t } = useTranslation()
  return (
    <Page title={t("errorPage.pageTitle", "Error")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <ErrorPageBody />
      </ContainerGrid>
    </Page>
  )
}
