import { UnderlineLink } from "../typography/UnderlineLink"
import { Divider, Grid, Link, Typography } from "@mui/material"
import React from "react"

export function Footer() {
  return (
    <Grid item xs={12} sx={{ marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.primary" align="center">
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://discord.com/invite/N4Gy8py8J4"}
            >
              <UnderlineLink color={"text.secondary"}>Support</UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://discord.com/invite/N4Gy8py8J4"}
            >
              <UnderlineLink color={"text.secondary"}>Discord</UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={
                "https://discord.com/oauth2/authorize?client_id=868709691469987860&permissions=361314126849&integration_type=0&scope=bot"
              }
            >
              <UnderlineLink color={"text.secondary"}>
                Discord Bot
              </UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://github.com/henry232323/sc-market/wiki"}
            >
              <UnderlineLink color={"text.secondary"}>Wiki</UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://www.patreon.com/henry232323"}
            >
              <UnderlineLink color={"primary"}>Donate</UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://github.com/henry232323/sc-market"}
            >
              <UnderlineLink color={"text.secondary"}>Github</UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"/privacy-policy"}
            >
              <UnderlineLink color={"text.secondary"}>
                Privacy Policy
              </UnderlineLink>
            </Link>
            &nbsp;|&nbsp;
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"/terms-of-service"}
            >
              <UnderlineLink color={"text.secondary"}>
                Terms of Service
              </UnderlineLink>
            </Link>
          </Typography>
          <br />
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            SC Market {new Date().getFullYear() + 930}
            {"."}
            <br />
            {
              "Star Citizen®, Squadron 42®, Roberts Space Industries®, and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC"
            }
            <br />
            This is an unofficial Star Citizen fansite, not affiliated with the
            Cloud Imperium group of companies. All content on this site not
            authored by its host or users are property of their respective
            owners
            <br />
            Thank you to{" "}
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://www.youtube.com/@robinerino"}
            >
              <UnderlineLink color={"text.primary"} variant="body2">
                LadyFleur
              </UnderlineLink>
            </Link>{" "}
            for the site logo, and to{" "}
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://starcitizen-api.com/"}
            >
              <UnderlineLink color={"text.primary"} variant="body2">
                StarCitizen-API
              </UnderlineLink>
            </Link>
            ,{" "}
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://nexd.to/ "}
            >
              <UnderlineLink color={"text.primary"} variant="body2">
                NEXD
              </UnderlineLink>
            </Link>
            , and{" "}
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={"https://starcitizen.tools/"}
            >
              <UnderlineLink color={"text.primary"} variant="body2">
                Star Citizen Wiki
              </UnderlineLink>
            </Link>{" "}
            for their APIs.
            <br />
            Use our referral code: STAR-GSFY-MQW9
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
