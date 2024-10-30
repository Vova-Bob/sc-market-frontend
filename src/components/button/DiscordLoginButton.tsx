import { BACKEND_URL } from "../../util/constants"
import { Button } from "@mui/material"
import React from "react"
import { useLocation } from "react-router-dom"
import { Discord } from "../icon/DiscordIcon"

export function DiscordLoginButton() {
  const location = useLocation()

  return (
    <Button
      onClick={() => {
        window.location.href = `${BACKEND_URL}/auth/discord?path=${encodeURIComponent(
          location.pathname === "/" ? "/market" : location.pathname,
        )}`
      }}
      color={"secondary"}
      variant={"contained"}
      startIcon={<Discord />}
    >
      Login with Discord
    </Button>
  )
}
