import React from "react"
import { Grid, List, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { FAQQuestion } from "../../pages/home/LandingPage"

export function DiscordBotDetails(props: { org?: boolean }) {
  const theme = useTheme<ExtendedTheme>()

  return (
    <>
      <Grid item xs={12} lg={4} md={4}>
        <Typography
          variant={"h3"}
          color={"text.secondary"}
          sx={{ maxWidth: 400 }}
        >
          Integrating with Discord
        </Typography>
      </Grid>
      <Grid item xs={12} lg={8} md={8}>
        <List
          sx={{
            borderRadius: theme.spacing(2),
            backgroundColor: "#000000A0",
            padding: 0,
          }}
        >
          <FAQQuestion
            question={"How to get notified when an order is placed"}
            answer={
              "Add the official [SC Market Discord Bot](https://discord.com/oauth2/authorize?client_id=868709691469987860&permissions=361314126849&integration_type=0&scope=bot) to your server " +
              "to automatically receive direct messages when an order is placed with you or assigned to you. " +
              "Alternatively, use the below configuration to fulfill orders through [SC Market's Official Server](https://discord.com/invite/N4Gy8py8J4)."
            }
            first
          />
          <FAQQuestion
            question={"How to communicate with buyers through Discord"}
            answer={
              "Add the official [SC Market Discord Bot](https://discord.com/oauth2/authorize?client_id=868709691469987860&permissions=361314126849&integration_type=0&scope=bot) to your server " +
              "and you can register a channel to automatically create threads between sellers and buyers when an order is placed. " +
              "Buyers will automatically be invited to your server where you can work with them to fulfill the order. " +
              `
                        
1. Add [the Bot](https://discord.com/oauth2/authorize?client_id=868709691469987860&permissions=361314126849&integration_type=0&scope=bot) to your server

2. Run \`/register Server\` targeting either an individual user or an org contractor. For example, to have orders associated with you as an individual, run \`/register Server User\`. To register on behalf on an org \`/register Server Contractor ORGNAME\`. After doing so, users will automatically be invited to your server when placing an order.

3. Run \`/register Channel\` targeting either an individual user or an org contractor. For example, to have orders associated with you as an individual, run \`/register Channel User\`. To register on behalf on an org \`/register Channel Contractor ORGNAME\`. After doing so, users will automatically be added to threads with the person assigned to their orders.`
            }
            last
          />
        </List>
      </Grid>
      {/*<Grid item xs={12}>*/}
      {/*    <Button variant={'outlined'} sx={{width: '100%'}} startIcon={<SendRounded/>}>*/}
      {/*        Test Discord Integration*/}
      {/*    </Button>*/}
      {/*</Grid>*/}
    </>
  )
}
