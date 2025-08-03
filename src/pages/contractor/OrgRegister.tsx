import React, { useState } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { AuthenticateContractor } from "../../views/authentication/AuthenticateContractor"
import { Page } from "../../components/metadata/Page"
import { Grid, Tab, Tabs } from "@mui/material"
import {
  CreateRounded,
  HowToRegRounded,
  InfoRounded,
  PersonAddRounded,
} from "@mui/icons-material"
import { a11yProps, TabPanel } from "../../components/tabs/Tabs"
import { CreateNewContractor } from "../../views/authentication/CreateNewContractor"
import { useTranslation } from "react-i18next"

export function OrgRegister() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)

  return (
    <Page title={t("org.registerOrgTitle")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <HeaderTitle>{t("org.registerOrgTitle")}</HeaderTitle>

        <Grid item xs={12}>
          <Tabs
            value={page}
            onChange={(_, newPage) => setPage(newPage)}
            aria-label="org info area"
            variant="scrollable"
          >
            <Tab
              label={t("org.existingRsiOrg")}
              icon={<HowToRegRounded />}
              {...a11yProps(0)}
            />

            <Tab
              label={t("org.newContractor")}
              icon={<CreateRounded />}
              {...a11yProps(1)}
            />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={page} index={0}>
            <AuthenticateContractor />
          </TabPanel>
          <TabPanel value={page} index={1}>
            <CreateNewContractor />
          </TabPanel>
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
