import { OfferSession } from "../../store/offer"
import React from "react"
import { Grid, Paper, Typography } from "@mui/material"
import { ServiceListingBase } from "../../views/contracts/ServiceListings"
import { Stack } from "@mui/system"

export function OfferServiceArea(props: { offer: OfferSession }) {
  const { offer: session } = props

  if (session.offers[0].service) {
    return (
      <Grid item xs={12} lg={4} md={12}>
        <Paper sx={{ padding: 2 }}>
          <Stack spacing={1}>
            <Typography
              variant={"h5"}
              sx={{ fontWeight: "bold" }}
              color={"text.secondary"}
            >
              Associated Services
            </Typography>
            <ServiceListingBase service={session.offers[0].service} index={0} />
          </Stack>
        </Paper>
      </Grid>
    )
  } else {
    return (
      <Grid item xs={12} lg={4} md={12}>
        <Paper sx={{ padding: 2 }}>
          <Stack spacing={1}>
            <Typography
              variant={"h5"}
              sx={{ fontWeight: "bold" }}
              color={"text.secondary"}
            >
              Associated Services
            </Typography>
            <Typography variant={"subtitle2"}>
              No associated services
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    )
  }
}
