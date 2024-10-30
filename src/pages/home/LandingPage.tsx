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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
  Link as MaterialLink,
} from "@mui/material"
import { Theme, useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import logo from "../../assets/scmarket-logo.png"
import recruitingCap from "../../assets/recruiting.png"
import manageStockCap from "../../assets/manage-stock.png"
import servicesCap from "../../assets/services-cap.png"
import { OpenGrid } from "../../components/layout/ContainerGrid"
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
import { Navigate, Link } from "react-router-dom"
import { MetricSection } from "../../views/orders/OrderMetrics"
import AnimatedNumbers from "react-animated-numbers"
import { Stack } from "@mui/system"
import CharLogo from "../../assets/CharHoldings_Logo.png"

const bg = "https://media.tenor.com/4LKXThFQuHMAAAAd/perseus-star-citizen.gif"

function LandingSmallImage(props: { src: string; title: string }) {
  const { src, title } = props
  const theme = useTheme<Theme>()

  return (
    <Grid
      item
      xs={12}
      md={4}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
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
    </Grid>
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
    <Grid item xs={12}>
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
    </Grid>
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
    <Grid item xs={12}>
      <Grid container spacing={2}>
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
      </Grid>
    </Grid>
  )
}

export function LandingPage() {
  const theme = useTheme<ExtendedTheme>()

  return (
    <Page>
      <OpenGrid
        sidebarOpen={true}
        sx={{
          "& > *": { zIndex: "1", paddingBottom: 4 },
          overflow: "hidden",
        }}
        noFooter
        position={"relative"}
        mainProps={{
          style: {
            background: `radial-gradient(at 100% 0%, ${theme.palette.primary.main}80 0px, transparent 60%),radial-gradient(at 0% 0%, ${theme.palette.secondary.main}80 0px, transparent 60%)`,
          },
        }}
      >
        {CURRENT_CUSTOM_ORG && (
          <Navigate to={`/contractor/${CURRENT_CUSTOM_ORG}`} />
        )}
        <Grid
          item
          xs={12}
          sx={{
            paddingBottom: theme.spacing(4),
            zIndex: "1",
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
            {/*<Box position={'absolute'} sx={{*/}
            {/*    background: `url(${bg})`, height: 800,*/}
            {/*    backgroundSize: 'cover', width: '100%', zIndex: '0',*/}
            {/*    marginRight: -4,*/}
            {/*    marginTop: -8*/}
            {/*}}>*/}
            {/*    <Box sx={{width: '100%', height: '100%', backgroundColor: '#00000099'}}>*/}

            {/*    </Box>*/}
            {/*</Box>*/}
            <Grid container spacing={theme.spacing(8)}>
              <Grid item xs={12}>
                <Container>
                  <Grid container spacing={theme.spacing(8)}>
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      flexDirection={"column"}
                      // sx={{marginTop: -8}}
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
                    </Grid>
                  </Grid>
                </Container>
              </Grid>
            </Grid>
          </Box>
          <Container>
            <Grid container spacing={theme.spacing(6)}>
              {/*<Grid item xs={12} justifyContent={'center'} alignItems={'center'}>*/}
              {/*    <Typography variant={'h3'} sx={{fontWeight: 'bold', textAlign: 'center'}}*/}
              {/*                color={'text.secondary'}>*/}
              {/*        Make it easy to find what you need*/}
              {/*    </Typography>*/}
              {/*</Grid>*/}

              <OrderStatistics />

              <RecentListings />

              {/*<Grid item xs={12} lg={12}>*/}
              {/*    <img src={marketCap} style={{*/}
              {/*        width: '100%', borderRadius: 4,*/}
              {/*        border: `1px solid ${theme.palette.outline.main}`,*/}
              {/*    }} alt={"A screen capture of the market page"}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12}>
                <Grid container spacing={theme.spacing(8)}>
                  <Grid item xs={12} lg={4}>
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
                  </Grid>
                  <Grid item xs={12} lg={4}>
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
                  </Grid>

                  <Grid item xs={12} lg={4}>
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
                  </Grid>
                </Grid>
              </Grid>
              {/*<Grid item xs={12}>*/}
              {/*    <Grid container spacing={theme.spacing(8)} justifyContent={'center'} alignItems={'center'}>*/}
              {/*        <Grid item xs={12}>*/}
              {/*            <Typography variant={'h4'} sx={{fontWeight: 'bold', textAlign: 'center'}}*/}
              {/*                        color={'text.secondary'}>*/}
              {/*                Ready to Get Started?*/}
              {/*            </Typography>*/}
              {/*        </Grid>*/}
              {/*        <Grid item xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>*/}
              {/*            <Button variant={'contained'} size={'large'} startIcon={<Login/>}*/}
              {/*                    sx={{height: 50, width: 160}}*/}
              {/*                    onClick={() => {*/}
              {/*                        window.location.href = `${BACKEND_URL}/auth/discord?path=${encodeURIComponent("/market")}`*/}
              {/*                    }}*/}
              {/*            >*/}
              {/*                <b>Sign up</b>*/}
              {/*            </Button>*/}
              {/*        </Grid>*/}
              {/*    </Grid>*/}
              {/*</Grid>*/}
            </Grid>
          </Container>
          {/*</Grid>*/}

          {/*<Grid item xs={12} height={theme.spacing(3)}/>*/}

          {/*<Grid item xs={12} sx={{backgroundColor: '#070b11', marginBottom: -4}}>*/}
          <Container>
            <Grid container spacing={theme.spacing(8)}>
              <Grid item xs={12} height={theme.spacing(3)} />

              <Grid
                item
                xs={12}
                justifyContent={"center"}
                alignItems={"center"}
              >
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
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={theme.spacing(8)}>
                  <LandingSmallImage
                    src={recruitingCap}
                    title={"Org Recruitment"}
                  />
                  <LandingSmallImage
                    src={servicesCap}
                    title={"Service Listings"}
                  />
                  <LandingSmallImage
                    src={manageStockCap}
                    title={"Stock Management"}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  spacing={theme.spacing(8)}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant={"h5"}
                      sx={{ textAlign: "center" }}
                      color={"text.secondary"}
                    >
                      We enable orgs to coordinate their members to fulfill
                      orders and render services. Become a trusted group
                      customers come to when they need work done.
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Button
                      variant={"outlined"}
                      color={"secondary"}
                      href={`https://github.com/henry232323/sc-market/wiki`}
                    >
                      Learn More
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <SupportersSection />
              <FAQSection />
              <Grid item xs={12} height={theme.spacing(15)} />
            </Grid>
          </Container>
          <Footer />
        </Grid>
      </OpenGrid>
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
    <>
      <Grid item xs={12} lg={4} md={4}>
        <Typography
          variant={"h3"}
          color={"text.secondary"}
          sx={{ maxWidth: 400 }}
        >
          Your questions, answered
        </Typography>
      </Grid>
      <Grid item xs={12} lg={8} md={8}>
        <Paper>
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
              question={"What kinds of things can I list on SC Market"}
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
      </Grid>
    </>
  )
}

function SupportersSection() {
  const supporters = [
    {
      avatar: CharLogo,
      url: "https://robertsspaceindustries.com/orgs/CHAR",
      name: "Char Holdings",
    },
  ]

  return (
    <>
      <Grid item xs={12}>
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
            sx={{ maxWidth: "100%", overflow: "scroll" }}
            spacing={2}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {supporters.map((supporter) => (
              <Link
                to={supporter.url}
                style={{ color: "inherit", textDecoration: "none" }}
                key={supporter.name}
              >
                <Stack
                  spacing={1}
                  direction={"column"}
                  key={supporter.name}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <ButtonBase>
                    <img
                      src={supporter.avatar}
                      style={{ maxHeight: 128, borderRadius: 4 }}
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
      </Grid>
    </>
  )
}

export default LandingPage
