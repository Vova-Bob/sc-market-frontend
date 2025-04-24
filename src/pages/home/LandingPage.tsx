import React, { useMemo, useState } from "react"
import { Page } from "../../components/metadata/Page"
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Container,
  Divider,
  Fade,
  Grid,
  Grid2,
  Link as MaterialLink,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material"
import { Theme, useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import logo from "../../assets/scmarket-logo.png"
import recruitingCap from "../../assets/recruiting.png"
import manageStockCap from "../../assets/manage-stock.png"
import servicesCap from "../../assets/services-cap.png"
import { OpenLayout } from "../../components/layout/ContainerGrid"
import { Footer } from "../../components/footer/Footer"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { useMarketStatsQuery, useSearchMarketQuery } from "../../store/market"
import {
  convertToLegacy,
  DisplayListingsHorizontal,
} from "../../views/market/ItemListings"
import { CURRENT_CUSTOM_ORG } from "../../hooks/contractor/CustomDomain"
import { Link, Navigate } from "react-router-dom"
import { MetricSection } from "../../views/orders/OrderMetrics"
import AnimatedNumbers from "react-animated-numbers"
import { Stack } from "@mui/system"
import CharLogo from "../../assets/CharHoldings_Logo.png"
import UNNLogo from "../../assets/UNN_Traders_Logo.jpg"

const bg = "https://media.tenor.com/4LKXThFQuHMAAAAd/perseus-star-citizen.gif"

function LandingSmallImage(props: { src: string; title: string }) {
  const { src, title } = props
  const theme = useTheme<Theme>()

  return (
    <Stack
      direction={"column"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <img
        src={src}
        style={{
          width: "100%",
          aspectRatio: "1/1",
          border: `1px solid ${theme.palette.outline.main}`,
          marginBottom: theme.spacing(2),
          objectFit: "cover",
          borderRadius: theme.spacing(2),
        }}
        alt={title}
        loading="lazy"
      />
      <Typography
        variant={"h5"}
        sx={{ fontWeight: "bold", textAlign: "center" }}
        color={"text.secondary"}
      >
        {title}
      </Typography>
    </Stack>
  )
}

export function RecentListings() {
  const { data: results, isLoading } = useSearchMarketQuery({
    index: 0,
    page_size: 5,
    quantityAvailable: 1,
    sort: "date-old",
    listing_type: "not-aggregate",
  })

  const { total, listings } = useMemo(
    () => results || { total: 0, listings: [] },
    [results],
  )
  const filledListings = useMemo(
    () => (listings || []).map((l) => convertToLegacy(l)),
    [listings],
  )

  return !isLoading ? (
    <DisplayListingsHorizontal listings={filledListings} />
  ) : (
    <RecentListingsSkeleton />
  )
}

export function RecentListingsSkeleton() {
  return (
    <Box
      display={"flex"}
      sx={{
        maxWidth: "100%",
        overflowX: "scroll",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
        (item, index) => (
          <Box
            sx={{
              marginLeft: 1,
              marginRight: 1,
              width: 250,
              display: "inline-block",
              flexShrink: 0,
            }}
            key={index}
          >
            <Fade
              in={true}
              style={{
                transitionDelay: `${50 + 50 * index}ms`,
                transitionDuration: "500ms",
              }}
            >
              <Skeleton
                variant={"rectangular"}
                height={400}
                width={250}
                sx={{ borderRadius: 3 }}
              />
            </Fade>
          </Box>
        ),
      )}
    </Box>
  )
}

export function OrderStatistics() {
  const { data: stats } = useMarketStatsQuery()
  const { total_orders, total_order_value, week_orders, week_order_value } =
    stats || {
      total_orders: 0,
      total_order_value: 0,
      week_orders: 0,
      week_order_value: 0,
    }

  return (
    <Grid container spacing={2} justifyContent={"center"}>
      <MetricSection
        title={"Total Orders"}
        body={<AnimatedNumbers includeComma animateToNumber={total_orders} />}
      />
      <MetricSection
        title={"Total Order Value"}
        body={
          <Box display={"flex"}>
            {
              <AnimatedNumbers
                includeComma
                animateToNumber={total_order_value}
              />
            }
            &nbsp;aUEC
          </Box>
        }
      />
      {+week_orders > 0 && (
        <>
          <MetricSection
            title={"Orders This Week"}
            body={
              <Box display={"flex"}>
                {<AnimatedNumbers includeComma animateToNumber={week_orders} />}
              </Box>
            }
          />
          <MetricSection
            title={"Value of Orders This Week"}
            body={
              <Box display={"flex"}>
                {
                  <AnimatedNumbers
                    includeComma
                    animateToNumber={week_order_value}
                  />
                }
                &nbsp;aUEC
              </Box>
            }
          />
        </>
      )}
    </Grid>
  )
}

export function LandingPage() {
  const theme = useTheme<ExtendedTheme>()

  return (
    <Page>
      <OpenLayout
        sidebarOpen={true}
        style={{
          // "& > *": { paddingBottom: 4 },
          position: "relative",
          overflowY: "scroll",
          overflowX: "hidden",
          paddingTop: 20,
          background: `radial-gradient(at 100% 0%, ${theme.palette.primary.main}80 0px, transparent 60%),radial-gradient(at 0% 0%, ${theme.palette.secondary.main}80 0px, transparent 60%)`,
        }}
        noFooter
      >
        {CURRENT_CUSTOM_ORG && (
          <Navigate to={`/contractor/${CURRENT_CUSTOM_ORG}`} />
        )}
        <Stack
          direction={"column"}
          sx={{
            maxWidth: "100%",
            paddingBottom: theme.spacing(4),
            paddingTop: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              // background: `url(${bg})`,
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              backgroundPosition: "center",
              paddingBottom: theme.spacing(8),
            }}
          >
            <Container>
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Avatar
                  sx={{
                    [theme.breakpoints.up("lg")]: {
                      width: theme.spacing(32),
                      height: theme.spacing(32),
                    },
                    [theme.breakpoints.down("lg")]: {
                      width: theme.spacing(24),
                      height: theme.spacing(24),
                    },
                    // marginBottom: -8
                  }}
                  src={logo}
                  alt={`SC Market Logo`}
                />
                <Typography color={"secondary"} variant={"h1"}>
                  <b>SC MARKET</b>
                </Typography>
                <Typography variant={"h2"}>
                  Buy and sell goods. Buy and sell services.
                </Typography>
              </Stack>
            </Container>
          </Box>
          <Container>
            <Stack
              spacing={theme.spacing(6)}
              alignItems={"center"}
              justifyContent={"center"}
              direction={"column"}
            >
              <OrderStatistics />

              <Box
                maxWidth={"100%"}
                sx={{
                  overflowX: "scroll",
                }}
              >
                <RecentListings />
              </Box>

              <Grid2 container justifyContent={"center"} spacing={8}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Stack direction={"column"}>
                    <Typography
                      variant={"h4"}
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                      color={"text.secondary"}
                    >
                      Buy and Sell Items
                    </Typography>
                    <Typography
                      variant={"body1"}
                      sx={{ textAlign: "left" }}
                      color={"text.secondary"}
                    >
                      List your items to be sold in whatever quantity you
                      support. Get alerts in Discord when someone places an
                      order, and work with buyers to fulfill their orders.{" "}
                      <b>{"We don't take a cut."}</b>
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Stack direction={"column"}>
                    <Typography
                      variant={"h4"}
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                      color={"text.secondary"}
                    >
                      Trade in Bulk
                    </Typography>
                    <Typography
                      variant={"body1"}
                      sx={{ textAlign: "left" }}
                      color={"text.secondary"}
                    >
                      Whether you have 5 FS-9s to sell or 50, we want to support
                      you. List your items in bulk or individually and manage
                      your stock with the click of a button.
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Stack direction={"column"}>
                    <Typography
                      variant={"h4"}
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                      color={"text.secondary"}
                    >
                      Order Services
                    </Typography>
                    <Typography
                      variant={"body1"}
                      sx={{ textAlign: "left" }}
                      color={"text.secondary"}
                    >
                      Do you or your org have provide a service? Whether its
                      medical rescue, hauler escort, sourcing items or
                      otherwise, find a home on SC Market where you can discover
                      the many services being provided throughout the
                      &apos;verse.
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>
            </Stack>
          </Container>
          <Container>
            <Stack
              direction={"column"}
              spacing={theme.spacing(8)}
              sx={{
                paddingTop: theme.spacing(3),
                paddingBottom: theme.spacing(13),
              }}
            >
              <Stack justifyContent={"center"} alignItems={"center"}>
                <Typography
                  variant={"h3"}
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                  color={"text.secondary"}
                >
                  SC Market
                </Typography>
                <Typography
                  variant={"h4"}
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                  color={"text.secondary"}
                >
                  <span style={{ color: theme.palette.secondary.main }}>
                    For Orgs
                  </span>
                </Typography>
              </Stack>

              <Grid2 container justifyContent={"center"} spacing={4}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <LandingSmallImage
                    src={recruitingCap}
                    title={"Org Recruitment"}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <LandingSmallImage
                    src={servicesCap}
                    title={"Service Listings"}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <LandingSmallImage
                    src={manageStockCap}
                    title={"Stock Management"}
                  />
                </Grid2>
              </Grid2>

              <Stack
                direction={"column"}
                spacing={theme.spacing(8)}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  variant={"h5"}
                  sx={{ textAlign: "center" }}
                  color={"text.secondary"}
                >
                  We enable orgs to coordinate their members to fulfill orders
                  and render services. Become a trusted group customers come to
                  when they need work done.
                </Typography>
                <Button
                  variant={"outlined"}
                  color={"secondary"}
                  href={`https://github.com/henry232323/sc-market/wiki`}
                >
                  Learn More
                </Button>
              </Stack>
              <SupportersSection />
              <FAQSection />
            </Stack>
          </Container>
          <Footer />
        </Stack>
      </OpenLayout>
    </Page>
  )
}

export function FAQQuestion(props: {
  question: React.ReactNode
  answer: string
  last?: boolean
  first?: boolean
}) {
  const [open, setOpen] = useState(false)
  const { question, answer, last, first } = props
  const theme = useTheme<ExtendedTheme>()

  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{
          ...(first
            ? {
                borderTopLeftRadius: theme.spacing(0.5),
                borderTopRightRadius: theme.spacing(0.5),
              }
            : {}),
          ...(last
            ? {
                borderBottomLeftRadius: theme.spacing(0.5),
                borderBottomRightRadius: theme.spacing(0.5),
              }
            : {}),
        }}
      >
        <ListItemText>
          <Typography variant={"h5"} color={"text.secondary"}>
            {question}
          </Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {/*<Box sx={{*/}
        {/*    padding: theme.spacing(1)*/}
        {/*}}>*/}
        <ListItem
          sx={
            {
              // border: `1px solid ${theme.palette.outline.main}`,
              // borderRadius: theme.spacing(1),
            }
          }
        >
          <Typography color={"text.secondary"} variant={"body1"}>
            <MarkdownRender text={answer} />
          </Typography>
        </ListItem>
        {/*</Box>*/}
      </Collapse>
      {!last && <Divider light />}
    </>
  )
}

function FAQSection() {
  const theme = useTheme<ExtendedTheme>()

  return (
    <Stack direction={"row"} sx={{ flexWrap: "wrap" }}>
      <Typography
        variant={"h3"}
        color={"text.secondary"}
        sx={{ maxWidth: "min(400px, 100%)", flexShrink: "0", marginBottom: 2 }}
      >
        Your questions, answered
      </Typography>
      <Paper sx={{ flexGrow: "1" }}>
        <List
          sx={{
            borderRadius: theme.spacing(2),
            padding: 0,
          }}
        >
          <FAQQuestion
            question={"How do I sell items?"}
            answer={
              "Create market listings for the items you want to sell. Buyers can add the items they want " +
              "to their cart, then place an order with you for those items. From there it is up to you " +
              "and the buyer to arrange a time and place to exchange the aUEC and goods."
            }
            first
          />
          <FAQQuestion
            question={"Is SC Market safe to use?"}
            answer={
              "Because we don't handle any of the goods or aUEC ourselves, we cannot make any guarantees. " +
              "However, we do provide ways for buyers and sellers to review each other, so you can be sure " +
              "that others have had positive experiences with a seller if you are wary of being scammed."
            }
          />
          <FAQQuestion
            question={"What kinds of things can I list on SC Market?"}
            answer={
              "You can list any item or service as long as you accept aUEC in exchange for it. " +
              "Items and services should generally be related to Star Citizen and services may be conducted " +
              "in our out of the game itself."
            }
          />
          <FAQQuestion
            question={"Does SC Market take a fee?"}
            answer={
              "No we do not. All services are provided here free of charge and no aUEC passes through us."
            }
          />
          <FAQQuestion
            question={"Can I list items for real money?"}
            answer={
              "No. All transactions on SC Market should be completed in aUEC."
            }
            last
          />
        </List>
      </Paper>
    </Stack>
  )
}

function SupportersSection() {
  const supporters = [
    {
      avatar: CharLogo,
      url: "https://robertsspaceindustries.com/orgs/CHAR",
      name: "Char Holdings",
    },
    {
      avatar: UNNLogo,
      url: "https://joinunn.com/",
      name: "The Unnamed",
    },
  ]

  return (
    <Stack spacing={2} sx={{ maxWidth: "100%" }}>
      <Typography
        variant={"h3"}
        sx={{ fontWeight: "bold", textAlign: "center" }}
        color={"text.secondary"}
      >
        Our Supporters
      </Typography>
      <Typography
        variant={"h5"}
        sx={{ textAlign: "center" }}
        color={"text.primary"}
      >
        Thank you to all of our{" "}
        <MaterialLink
          color={"secondary"}
          target={"_blank"}
          rel="noopener noreferrer"
          underline={"hover"}
          href={"https://www.patreon.com/henry232323"}
        >
          Patreon
        </MaterialLink>{" "}
        supporters
      </Typography>
      <Stack
        sx={{ maxWidth: "100%", overflow: "scroll", flexWrap: "wrap" }}
        useFlexGap
        spacing={2}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {supporters.map((supporter) => (
          <Link
            to={supporter.url}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            key={supporter.name}
          >
            <Stack
              spacing={1}
              direction={"column"}
              key={supporter.name}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <ButtonBase sx={{ borderRadius: 1 }}>
                <img
                  src={supporter.avatar}
                  style={{ maxHeight: 128, maxWidth: "100%", borderRadius: 4 }}
                  alt={supporter.name}
                />
              </ButtonBase>

              <MaterialLink underline={"hover"} color={"text.secondary"}>
                <Typography variant={"body2"} align={"center"}>
                  {supporter.name}
                </Typography>
              </MaterialLink>
            </Stack>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

export default LandingPage
