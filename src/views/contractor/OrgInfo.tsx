import { Contractor } from "../../datatypes/Contractor"
import React, { useMemo } from "react"
import {
  Avatar,
  Box,
  Chip,
  Container,
  Fab,
  Grid,
  IconButton,
  Link as MaterialLink,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { contractorKindIcons } from "./ContractorList"
import CreateIcon from "@mui/icons-material/CreateRounded"
import { CreateOrderForm } from "../orders/CreateOrderForm"
import { ContractorReviewSummary, OrgReviews } from "./OrgReviews"
import InfoIcon from "@mui/icons-material/Info"
import { a11yProps, TabPanel } from "../../components/tabs/Tabs"
import {
  CreateRounded,
  DesignServicesRounded,
  GavelRounded,
  InfoRounded,
  LinkRounded,
  PersonAddRounded,
  RefreshRounded,
} from "@mui/icons-material"
import { MemberList } from "./OrgMembers"
import { OrgListings, OrgRecentListings } from "../market/ItemListings"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { Link, useParams } from "react-router-dom"
import {
  OrgRecentServices,
  ServiceListings,
} from "../contracts/ServiceListings"
import { Section } from "../../components/paper/Section"
import { useMarketGetListingsByContractorQuery } from "../../store/market"
import { RecruitingPostArea } from "../../pages/recruiting/RecruitingPostPage"
import { useRecruitingGetPostByOrgQuery } from "../../store/recruiting"
import {
  DarkBannerContainer,
  LightBannerContainer,
} from "../people/ViewProfile"
import { OpenLayout } from "../../components/layout/ContainerGrid"
import { useGetUserProfileQuery } from "../../store/profile"
import { useRefetchContractorDetailsMutation } from "../../store/contractor"
import { ListingSellerRating } from "../../components/rating/ListingRating"
import { useGetServicesContractorQuery } from "../../store/services"
import { useTranslation } from "react-i18next"

const name_to_index = new Map([
  ["", 0],
  ["services", 1],
  ["market", 2],
  ["order", 3],
  ["members", 4],
  ["recruiting", 5],
])

export function OrgRelevantListingsArea(props: { org: string }) {
  const { org } = props

  const { data: listings } = useMarketGetListingsByContractorQuery(org)
  const { data: services } = useGetServicesContractorQuery(org)

  const order = useMemo(
    () =>
      [
        { name: "listings", items: listings || [] },
        { name: "services", items: services || [] },
      ]
        .filter((item) => item.items.length)
        .sort((a, b) => b.items.length - a.items.length),
    [listings, services],
  )

  return (
    <>
      {order.map((item) =>
        item.name === "listings" ? (
          <OrgRecentListings org={org} key={org} />
        ) : (
          <OrgRecentServices org={org} key={org} />
        ),
      )}
    </>
  )
}

export function OrgRefetchButton(props: { org: Contractor }) {
  const { data: profile } = useGetUserProfileQuery()
  const [refetch] = useRefetchContractorDetailsMutation()
  const { t } = useTranslation()

  return (
    <>
      {profile?.role === "admin" && (
        <Fab
          color={"warning"}
          sx={{ left: 8, top: 8, position: "absolute" }}
          onClick={() => refetch(props.org.spectrum_id)}
        >
          <RefreshRounded />
        </Fab>
      )}
    </>
  )
}

export function OrgBannerArea(props: { org: Contractor }) {
  const { org } = props

  const theme = useTheme()

  return theme.palette.mode === "dark" ? (
    <DarkBannerContainer profile={org}>
      <OrgRefetchButton org={org} />
    </DarkBannerContainer>
  ) : (
    <LightBannerContainer profile={org} />
  )
}

export function OrgInfo(props: { contractor: Contractor }) {
  const { contractor } = props
  const theme = useTheme<ExtendedTheme>()
  const { t } = useTranslation()

  const { tab } = useParams<{ tab?: string }>()
  const page = useMemo(() => name_to_index.get(tab || "") || 0, [tab])
  const { data: recruiting_post } = useRecruitingGetPostByOrgQuery(
    contractor.spectrum_id,
  )

  return (
    <OpenLayout sidebarOpen={true}>
      <Box sx={{ position: "relative" }}>
        <OrgBannerArea org={contractor} />
        <Container
          maxWidth={"lg"}
          sx={{
            ...(theme.palette.mode === "dark"
              ? {
                  position: "relative",
                  top: -450,
                }
              : {
                  position: "relative",
                  top: -200,
                }),
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                alignItems={"flex-end"}
                minHeight={375}
              >
                <Grid item md={4}>
                  <Grid container spacing={1}>
                    <Grid item sm={4}>
                      <Avatar
                        src={contractor?.avatar}
                        aria-label={t("contractors.contractor")}
                        variant={"rounded"}
                        sx={{
                          maxHeight: theme.spacing(12),
                          maxWidth: theme.spacing(12),
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Grid>
                    <Grid item sm={8}>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Typography
                            color={"text.secondary"}
                            variant={"h6"}
                            fontWeight={600}
                          >
                            {contractor.name}{" "}
                            {!contractor.spectrum_id.startsWith("~") && (
                              <MaterialLink
                                component={"a"}
                                href={`https://robertsspaceindustries.com/orgs/${contractor.spectrum_id}`}
                                target="_blank"
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <IconButton color={"primary"}>
                                  <LinkRounded />
                                </IconButton>
                              </MaterialLink>
                            )}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          alignItems={"center"}
                          display={"flex"}
                        >
                          <PeopleAltRoundedIcon
                            style={{ color: theme.palette.text.primary }}
                          />
                          <Typography
                            sx={{ marginLeft: 1 }}
                            color={"text.primary"}
                            fontWeight={"bold"}
                          >
                            {contractor.size}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <ListingSellerRating contractor={contractor} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        {contractor.fields.map((field) => (
                          <Chip
                            key={field}
                            color={"primary"}
                            label={field}
                            sx={{
                              marginRight: 0.5,
                              padding: 1,
                              marginBottom: 0.5,
                              textTransform: "capitalize",
                            }}
                            variant={"outlined"}
                            icon={contractorKindIcons[field]}
                            onClick={
                              (event) => event.stopPropagation() // Don't highlight cell if button clicked
                            }
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Paper
                    sx={{ padding: 1, maxHeight: 350, overflow: "scroll" }}
                  >
                    <MarkdownRender text={contractor.description} />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: "divider.light" }}>
                <Tabs
                  value={page}
                  // onChange={handleChange}
                  aria-label={t("ui.aria.orgInfoArea")}
                  variant="scrollable"
                >
                  <Tab
                    label={t("orgInfo.about")}
                    component={Link}
                    to={`/contractor/${contractor.spectrum_id}`}
                    icon={<InfoRounded />}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={t("orgInfo.services")}
                    component={Link}
                    to={`/contractor/${contractor.spectrum_id}/services`}
                    icon={<DesignServicesRounded />}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label={t("orgInfo.market")}
                    component={Link}
                    to={`/contractor/${contractor.spectrum_id}/market`}
                    icon={<GavelRounded />}
                    {...a11yProps(2)}
                  />
                  <Tab
                    label={t("orgInfo.order")}
                    component={Link}
                    to={`/contractor/${contractor.spectrum_id}/order`}
                    icon={<CreateRounded />}
                    {...a11yProps(3)}
                  />
                  <Tab
                    label={t("orgInfo.members")}
                    component={Link}
                    to={`/contractor/${contractor.spectrum_id}/members`}
                    icon={<PeopleAltRoundedIcon />}
                    {...a11yProps(4)}
                  />
                  {recruiting_post && (
                    <Tab
                      label={t("orgInfo.recruiting")}
                      component={Link}
                      to={`/contractor/${contractor.spectrum_id}/recruiting`}
                      icon={<PersonAddRounded />}
                      {...a11yProps(5)}
                    />
                  )}
                </Tabs>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={page} index={0}>
                <Grid container spacing={2}>
                  <Grid item lg={12}>
                    <Grid container spacing={2}>
                      <OrgRelevantListingsArea org={contractor.spectrum_id} />
                    </Grid>
                  </Grid>

                  <ContractorReviewSummary contractor={contractor} />

                  <Section xs={12} lg={8} disablePadding>
                    <OrgReviews contractor={contractor} />
                  </Section>
                </Grid>
              </TabPanel>
              <TabPanel value={page} index={1}>
                <Grid container spacing={3}>
                  <ServiceListings contractor={contractor.spectrum_id} />
                </Grid>
              </TabPanel>
              <TabPanel value={page} index={2}>
                <Grid container spacing={3}>
                  <OrgListings org={contractor.spectrum_id} />
                </Grid>
              </TabPanel>
              <TabPanel value={page} index={3}>
                <Grid container spacing={3}>
                  <CreateOrderForm contractor_id={contractor.spectrum_id} />
                </Grid>
              </TabPanel>
              <TabPanel value={page} index={4}>
                <Grid container spacing={3}>
                  <MemberList contractor={contractor} />
                </Grid>
              </TabPanel>
              <TabPanel value={page} index={5}>
                <Grid container spacing={3}>
                  <RecruitingPostArea spectrum_id={contractor.spectrum_id} />
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </OpenLayout>
  )
}

export function OrgInfoSkeleton() {
  const [page, setPage] = React.useState(0)
  const { t } = useTranslation()

  const handleChange = (event: React.SyntheticEvent, newPage: number) => {
    setPage(newPage)
  }

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: "divider.light" }}>
          <Tabs
            value={page}
            onChange={handleChange}
            aria-label={t("ui.aria.orgInfoArea")}
            variant="scrollable"
          >
            <Tab
              label={t("orgInfo.about")}
              icon={<InfoIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label={t("orgInfo.order")}
              icon={<CreateIcon />}
              {...a11yProps(1)}
            />
            <Tab
              label={t("orgInfo.members")}
              icon={<PeopleAltRoundedIcon />}
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={page} index={0}>
          <Skeleton
            sx={{
              borderRadius: 3,
              width: "100%",
              padding: 0,
              height: 700,
            }}
          />
        </TabPanel>
        <TabPanel value={page} index={1}>
          <Skeleton
            sx={{
              borderRadius: 3,
              width: "100%",
              padding: 0,
              height: 700,
            }}
          />
        </TabPanel>
        <TabPanel value={page} index={2}>
          <Skeleton
            sx={{
              borderRadius: 3,
              width: "100%",
              padding: 0,
              height: 700,
            }}
          />
        </TabPanel>
      </Grid>
    </React.Fragment>
  )
}
