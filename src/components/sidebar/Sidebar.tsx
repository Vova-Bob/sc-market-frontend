import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { matchPath, NavLink, useLocation } from "react-router-dom"
import { ExtendedTheme } from "../../hooks/styles/Theme"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import ExpandMore from "@mui/icons-material/ExpandMore"
import ExpandLess from "@mui/icons-material/ExpandLess"
import IconButton from "@mui/material/IconButton"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import { ChevronLeftRounded } from "@mui/icons-material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { all_sidebar_entries } from "./SidebarEntries"
import { SidebarActorSelect } from "./SidebarActorSelect"
import { has_permission } from "../../views/contractor/OrgRoles"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { CURRENT_CUSTOM_ORG } from "../../hooks/contractor/CustomDomain"
import { Stack } from "@mui/system"
import SCMarketLogo from "../../assets/scmarket-logo.png"
import { useTranslation } from "react-i18next"

export function SidebarDropdown(props: SidebarItemProps) {
  const [open, setOpen] = useState(false)
  const { icon, text, chip, children } = props
  const theme: Theme = useTheme()
  const loc = useLocation()
  const anyChild = props.children?.some(
    (child) => !!matchPath(loc.pathname, child.to || ""),
  )
  const { t } = useTranslation()

  const contrast = theme.palette.getContrastText(
    theme.palette.background.sidebar,
  )

  return (
    <>
      <ListItemButton
        color={"primary"}
        sx={{
          padding: 1,
          paddingLeft: 2,
          borderRadius: 2,
          marginBottom: 0.5,
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "rgba(36,41,58,0.43)",
          },
          // ...makeCut('12px'),
        }}
        // selected={open}
        key={text}
        onClick={() => setOpen((open) => !open)}
      >
        <ListItemIcon
          sx={{
            color: anyChild ? theme.palette.primary.main : contrast,
            transition: "0.3s",
            fontSize: "0.9em",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ marginLeft: -2 }}>
          <Typography
            color={anyChild ? "primary" : contrast}
            sx={{
              display: "inline-block",
              position: "relative",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            variant={"subtitle2"}
          >
            {t(text)}
          </Typography>
        </ListItemText>
        {chip ? (
          <Chip
            label={
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.9em",
                  fontWeight: 700,
                }}
                variant={"button"}
              >
                {chip}
              </Typography>
            }
            color={"primary"}
            size={"small"}
          />
        ) : null}
        {children && open ? <ExpandLess style={{ color: contrast }} /> : null}
        {children && !open ? <ExpandMore style={{ color: contrast }} /> : null}
      </ListItemButton>
      {children ? (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ marginLeft: 2 }}>
          <Box
            sx={{
              borderLeft: 1,
              borderColor: theme.palette.outline.main,
              paddingLeft: 1,
            }}
          >
            {children.map((child) => (
              <SidebarLink {...child} to={child.to || "a"} key={child.text} />
            ))}
          </Box>
        </Collapse>
      ) : null}
    </>
  )
}

export function SidebarLinkBody(props: SidebarItemProps & { to: string }) {
  const loc = useLocation()
  const selected = !!matchPath(loc.pathname, props.to || "")
  const { icon, text, chip } = props
  const theme: Theme = useTheme()
  const { t } = useTranslation()

  const xs = useMediaQuery(theme.breakpoints.down("sm"))
  const [drawerOpen, setDrawerOpen] = useDrawerOpen()

  const contrast = theme.palette.getContrastText(
    theme.palette.background.sidebar || "#000000",
  )

  return (
    <React.Fragment>
      <ListItemButton
        color={"primary"}
        sx={{
          padding: 0.5,
          paddingLeft: 2,
          borderRadius: 2,
          marginTop: 0.5,
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "rgba(36,41,58,0.43)",
          },
          // ...makeCut('12px'),
        }}
        selected={selected}
        key={text}
        onClick={() => {
          if (xs) {
            setDrawerOpen(false)
          }
        }}
      >
        <ListItemIcon
          sx={{
            color: selected ? theme.palette.primary.main : contrast,
            transition: "0.3s",
            fontSize: "0.9em",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ marginLeft: -2 }}>
          <Typography
            color={selected ? "primary" : contrast}
            sx={{
              display: "inline-block",
              position: "relative",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            variant={"subtitle2"}
          >
            {t(text)}
          </Typography>
        </ListItemText>
        {chip ? (
          <Chip
            label={
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.9em",
                  fontWeight: 700,
                }}
                variant={"button"}
              >
                {chip}
              </Typography>
            }
            color={"primary"}
            size={"small"}
          />
        ) : null}
      </ListItemButton>
    </React.Fragment>
  )
}

export function SidebarLink(props: SidebarItemProps & { to: string }) {
  return props.external ? (
    <a
      href={props.to}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <SidebarLinkBody {...props} />
    </a>
  ) : (
    <NavLink
      to={props.to + (props.params ? "?" + props.params : "")}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <SidebarLinkBody {...props} />
    </NavLink>
  )
}

export function SidebarItem(props: SidebarItemProps) {
  return (
    <React.Fragment>
      {props.children ? (
        <SidebarDropdown {...props} />
      ) : (
        <SidebarLink {...props} to={props.to || "a"} />
      )}
    </React.Fragment>
  )
}

export interface SidebarItemProps {
  to?: string
  params?: string
  text: string
  icon?: React.ReactNode
  chip?: string
  children?: SidebarItemProps[]
  hidden?: boolean
  logged_in?: boolean
  org?: boolean
  org_admin?: boolean
  site_admin?: boolean
  custom?: boolean
  external?: boolean
}

export interface SidebarSectionProps {
  title: string
  items: SidebarItemProps[]
}

export function Sidebar() {
  const theme: ExtendedTheme = useTheme()
  const { t } = useTranslation()
  const { data: profile, error: profile_error } = useGetUserProfileQuery()
  const [drawerOpen, setDrawerOpen] = useDrawerOpen()
  const [currentOrgObj, setCurrentOrgObj] = useCurrentOrg()
  const { data: customOrgData } = useGetContractorBySpectrumIDQuery(
    CURRENT_CUSTOM_ORG!,
    { skip: !CURRENT_CUSTOM_ORG },
  )

  const avatar = useMemo(() => {
    if (CURRENT_CUSTOM_ORG) {
      return customOrgData?.avatar || SCMarketLogo
    } else {
      return SCMarketLogo
    }
  }, [customOrgData])

  const filterItems = useCallback(
    (item: SidebarItemProps) => {
      if (item.hidden) {
        return false
      } else if (item.logged_in && profile_error) {
        return false
      } else if (
        item.org === false &&
        (currentOrgObj !== null || CURRENT_CUSTOM_ORG)
      ) {
        return false
      } else if ((item.org || item.org_admin) && !currentOrgObj) {
        return false
      } else if (item.org_admin) {
        if (
          !(
            [
              "manage_org_details",
              "manage_invites",
              "manage_roles",
              "manage_webhooks",
              "manage_orders",
            ] as const
          ).some((perm) => has_permission(currentOrgObj, profile, perm))
        ) {
          return false
        }
      } else if (CURRENT_CUSTOM_ORG && item.custom === false) {
        return false
      } else if (!CURRENT_CUSTOM_ORG && item.custom) {
        return false
      } else if (item.site_admin && profile?.role !== "admin") {
        return false
      }

      return true
    },
    [currentOrgObj, profile?.role, profile?.username, profile_error],
  )

  const xs = useMediaQuery(theme.breakpoints.down("sm"))
  useEffect(() => {
    setDrawerOpen(!xs)
  }, [setDrawerOpen, xs])

  return (
    <Drawer
      elevation={1}
      PaperProps={{ elevation: 8 }}
      variant="permanent"
      open
      sx={{
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.easeOut,
          duration: "0.3s",
        }),
        // width: (drawerOpen ? sidebarDrawerWidth : 0),

        [theme.breakpoints.up("sm")]: {
          width: drawerOpen ? sidebarDrawerWidth : 0,
        },
        [theme.breakpoints.down("sm")]: {
          width: drawerOpen ? "100%" : 0,
        },

        "& .MuiDrawer-paper": {
          // width: (drawerOpen ? sidebarDrawerWidth : 0),
          [theme.breakpoints.up("sm")]: {
            width: drawerOpen ? sidebarDrawerWidth : 0,
          },
          [theme.breakpoints.down("sm")]: {
            width: drawerOpen ? "100%" : 0,
            borderRight: 0,
          },

          boxSizing: "border-box",
          backgroundColor: theme.palette.background.sidebar,
          overflow: "scroll",
          borderColor: theme.palette.outline.main,
          scrollPadding: 0,

          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: "0.3s",
          }),
        },
        position: "relative",
        whiteSpace: "nowrap",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Stack
        direction={"column"}
        spacing={1}
        sx={{
          width: "100%",
          display: "flex",
          padding: 2,
          borderColor: theme.palette.outline.main,
        }}
      >
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <NavLink
              to={"/"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Avatar
                  src={avatar}
                  aria-label={t("ui.aria.currentContractor")}
                  variant={"rounded"}
                  sx={{
                    maxHeight: theme.spacing(6),
                    maxWidth: theme.spacing(6),
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Typography color={"white"} fontWeight={600}>
                  {t("sidebar.sc_market")}
                </Typography>
              </Stack>
            </NavLink>
          </Grid>

          <IconButton
            color={"secondary"}
            onClick={() => setDrawerOpen(false)}
            sx={{ height: 40, width: 40 }}
          >
            <ChevronLeftRounded />
          </IconButton>
        </Grid>
        {profile && <SidebarActorSelect />}
      </Stack>
      <Stack
        direction={"column"}
        spacing={1.5}
        sx={{
          // backgroundColor: 'rgb(0,0,0,.6)',
          width: "100%",
          height: "100%",
          // justifyContent: 'space-between',
          display: "flex",
          // borderRight: 0,
          // borderLeft: 0,
          borderTop: 1,
          padding: 1,
          borderColor: theme.palette.outline.main,
        }}
      >
        {all_sidebar_entries
          .filter((item) => item.items.filter(filterItems).length)
          .map((item) => {
            return (
              <List
                key={item.title}
                sx={{
                  // height: '100%',
                  padding: 1,
                  transition: "0.3s",
                }}
                subheader={
                  <ListSubheader
                    sx={{
                      marginBottom: 0.5,
                      backgroundColor: "inherit",
                    }}
                  >
                    <Typography
                      sx={{
                        bgcolor: "inherit",
                        fontWeight: "bold",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        fontSize: "0.85em",
                        color: "#929ca1",
                        transition: "0.3s",
                      }}
                      variant={"body2"}
                    >
                      {t(item.title)}
                    </Typography>
                  </ListSubheader>
                }
              >
                {item.items.filter(filterItems).map((item) => (
                  <SidebarItem {...item} key={item.text} />
                ))}
              </List>
            )
          })}
      </Stack>
    </Drawer>
  )
}
