import React, { Suspense } from "react"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { Button, Grid, Link, Typography } from "@mui/material"
import { Page, PageFallback } from "../../components/metadata/Page"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { DISCORD_INVITE } from "../../util/constants"
import { HookProvider } from "../../hooks/HookProvider"
import { Root } from "../../components/layout/Root"
import { useSearchParams } from "react-router-dom"

export function FrontendErrorBody() {
  const [searchParams] = useSearchParams()
  const target = searchParams.get("target")
  const message = searchParams.get("message")

  return (
    <>
      <Grid item xs={12}>
        <Typography
          variant={"h3"}
          sx={{ fontWeight: "bold" }}
          color={"text.secondary"}
          align={"center"}
        >
          An Error Occurred Loading the Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant={"subtitle2"}
          color={"text.primary"}
          align={"center"}
        >
          Please let us know in{" "}
          <Link rel="noopener noreferrer" target="_blank" href={DISCORD_INVITE}>
            <UnderlineLink color={"text.secondary"}>Discord</UnderlineLink>
          </Link>{" "}
          if you see this error after refreshing the page.
        </Typography>

        <Typography variant={"body2"} align={"center"}>
          Error page: <code>{target}</code>
        </Typography>
        <Typography variant={"body2"} align={"center"}>
          Message: <code>{message}</code>
        </Typography>
      </Grid>

      <Grid item>
        <a
          href={"/dashboard"}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button color={"secondary"} variant={"outlined"}>
            Return to Dashboard
          </Button>
        </a>
      </Grid>
    </>
  )
}

export function FrontendErrorPage() {
  return (
    <Page title={"An Error Occurred"}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <FrontendErrorBody />
      </ContainerGrid>
    </Page>
  )
}

export function FrontendErrorElement() {
  return (
    <HookProvider>
      <Root>
        <Suspense fallback={<PageFallback />}>
          <FrontendErrorPage />
        </Suspense>
      </Root>
    </HookProvider>
  )
}
