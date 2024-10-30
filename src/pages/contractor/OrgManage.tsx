import React, { useMemo } from "react"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { OrgDetailEdit } from "../../views/contractor/OrgManage"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { OrgInvite } from "../../views/contractor/OrgInvite"
import { CustomerList } from "../../views/people/Customers"
import { MyWebhooks } from "../../views/notifications/ListNotificationWebhooks"
import { Page } from "../../components/metadata/Page"
import { Box, Grid, Tab, Tabs } from "@mui/material"
import {
  AccountBoxRounded,
  InfoRounded,
  PersonAddRounded,
} from "@mui/icons-material"
import { a11yProps, TabPanel } from "../../components/tabs/Tabs"
import { CreateOrgInviteCode } from "../../views/contractor/CreateOrgInviteCode"
import { ListInviteCodes } from "../../views/contractor/ListInviteCodes"
import { ManageMemberList } from "../../views/contractor/OrgMembers"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { AddNotificationWebhook } from "../../views/notifications/AddNotificationWebhook"
import {
  AddRole,
  has_permission,
  ManageRoles,
} from "../../views/contractor/OrgRoles"
import { DiscordBotDetails } from "../../views/settings/DiscordBotDetails"
import { Discord } from "../../components/icon/DiscordIcon"
import { ConfigureDiscord } from "../../views/notifications/ConfigureDiscord"

export function OrgManage() {
  const [contractor] = useCurrentOrg()
  const { data: profile } = useGetUserProfileQuery()

  const canManageRoles = useMemo(
    () => has_permission(contractor!, profile!, "manage_roles"),
    [contractor, profile],
  )
  const canManageOrgDetails = useMemo(
    () => has_permission(contractor!, profile!, "manage_org_details"),
    [contractor, profile],
  )
  const canManageInvites = useMemo(
    () => has_permission(contractor!, profile!, "manage_invites"),
    [contractor, profile],
  )
  const canManageWebhooks = useMemo(
    () => has_permission(contractor!, profile!, "manage_invites"),
    [contractor, profile],
  )

  const [page, setPage] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newPage: number) => {
    setPage(newPage)
  }

  return (
    <Page title={"Manage Org"}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <HeaderTitle>Dashboard</HeaderTitle>

        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: "divider.light" }}>
            <Tabs
              value={page}
              onChange={handleChange}
              aria-label="org info area"
              variant="scrollable"
            >
              {canManageOrgDetails && (
                <Tab label="About" icon={<InfoRounded />} {...a11yProps(0)} />
              )}

              {canManageInvites && (
                <Tab
                  label="Invites"
                  icon={<PersonAddRounded />}
                  {...a11yProps(1)}
                />
              )}
              {canManageRoles && (
                <Tab
                  label="Roles"
                  icon={<AccountBoxRounded />}
                  {...a11yProps(2)}
                />
              )}
              {canManageWebhooks && (
                <Tab
                  label="Discord Integration"
                  icon={<Discord />}
                  {...a11yProps(3)}
                />
              )}
              {/*<Tab*/}
              {/*    label="Customers"*/}
              {/*    icon={*/}
              {/*        <PeopleRounded/>*/}
              {/*    }*/}
              {/*    {...a11yProps(2)}*/}
              {/*/>*/}
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={page} index={0}>
            <Grid container spacing={2}>
              <OrgDetailEdit />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={1}>
            <Grid container spacing={2}>
              <OrgInvite />
              <CreateOrgInviteCode />
              <ListInviteCodes />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={2}>
            <Grid container spacing={2}>
              <ManageRoles />
              <ManageMemberList />
              <AddRole />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={3}>
            <Grid container spacing={2}>
              <DiscordBotDetails org />
              <ConfigureDiscord org />
              <AddNotificationWebhook org />
              <MyWebhooks org />
            </Grid>
          </TabPanel>
          <TabPanel value={page} index={4}>
            <Grid container spacing={2}>
              <CustomerList />
            </Grid>
          </TabPanel>
        </Grid>
      </ContainerGrid>
    </Page>
  )
}
