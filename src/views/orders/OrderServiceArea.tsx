import React from "react"
import { Grid, Paper, Typography } from "@mui/material"
import { ServiceListingBase } from "../contracts/ServiceListings"
import { Stack } from "@mui/system"
import { Order } from "../../datatypes/Order"
import { useGetServiceByIdQuery } from "../../store/services"

export function OrderServiceArea(props: { order: Order }) {
  const { order } = props
  const { data: service } = useGetServiceByIdQuery(order.service_id!, {
    skip: !order.service_id,
  })

  if (order.service_id) {
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
            {service && <ServiceListingBase service={service} index={0} />}
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
