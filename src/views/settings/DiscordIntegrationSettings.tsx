import { Grid } from "@mui/material"
import React from "react"
import { MyWebhooks } from "../notifications/ListNotificationWebhooks"
import { AddNotificationWebhook } from "../notifications/AddNotificationWebhook"
import { DiscordBotDetails } from "./DiscordBotDetails"
import { ConfigureDiscord } from "../notifications/ConfigureDiscord"

export function DiscordIntegrationSettings() {
  return (
    <Grid container spacing={4} alignItems={"flex-start"}>
      <DiscordBotDetails />
      <ConfigureDiscord />
      <AddNotificationWebhook />
      <MyWebhooks />
    </Grid>
  )
}
