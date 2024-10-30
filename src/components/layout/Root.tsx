import { Sidebar } from "../sidebar/Sidebar"
import { Box, Theme, useTheme } from "@mui/material"
import { Navbar } from "../navbar/Navbar"
import React from "react"
import { useDrawerOpen } from "../../hooks/layout/Drawer"
import { PreferencesButton } from "../../views/settings/PreferencesButton"
import { CookieConsent } from "../alert/CookieConsent"

export function Root(props: { children: React.ReactNode }) {
  const theme: Theme = useTheme()
  const [drawerOpen] = useDrawerOpen()

  return (
    <Box
      id={"rootarea"}
      sx={{
        display: "flex",
        background: theme.palette.background.default,
        backgroundSize: "400px",
        // backgroundSize: 'cover',
      }}
    >
      <CookieConsent />
      <Navbar />
      <Sidebar />
      {props.children}
      <PreferencesButton />
    </Box>
  )
}
