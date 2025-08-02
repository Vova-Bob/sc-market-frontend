import React, { useCallback } from "react"
import { Divider, Grid, Typography } from "@mui/material"
import { Section } from "../../components/paper/Section"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useGetAllAssignedOrdersQuery,
  useGetAssignedOrdersByContractorQuery,
} from "../../store/orders"
import { useTranslation } from "react-i18next"

export function MetricSection(props: {
  title: string
  body: React.ReactNode
  bodyColor?: string
}) {
  const { title, body, bodyColor } = props
  return (
    <Grid item xs={12} lg={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography
            variant={"subtitle1"}
            color={"text.primary"}
            fontWeight={"bold"}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"} color={bodyColor || "text.secondary"}>
            {body}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Grid>
    </Grid>
  )
}

export function OrderMetrics(props: {}) {
  // org
  const [contractor] = useCurrentOrg()
  const { data: orders } = useGetAssignedOrdersByContractorQuery(
    contractor?.spectrum_id!,
    { skip: !contractor?.spectrum_id },
  )
  const { data: allOrders } = useGetAllAssignedOrdersQuery(undefined, {
    skip: !!contractor,
  })

  const { t } = useTranslation()

  const filteredOrders = useCallback(
    (state?: string) => {
      return (orders || allOrders || []).filter((o) => {
        if (state === "active") {
          return !["fulfilled", "cancelled"].includes(o.status)
        }
        if (state === "past") {
          return ["fulfilled", "cancelled"].includes(o.status)
        }

        return true
      })
    },
    [orders, allOrders],
  )

  return (
    <React.Fragment>
      <Section xs={12}>
        <Grid item xs={12}>
          <Typography
            variant={"subtitle1"}
            color={"text.primary"}
            fontWeight={"bold"}
          >
            {t("orderMetrics.activeOrders")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"} color={"success.main"}>
            {filteredOrders("active").length.toLocaleString("en-US")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Section>
      <Section xs={12}>
        <Grid item xs={12}>
          <Typography
            variant={"subtitle1"}
            color={"text.primary"}
            fontWeight={"bold"}
          >
            {t("orderMetrics.allOrders")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"}>
            {filteredOrders().length.toLocaleString(undefined)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Section>
      <Section xs={12}>
        <Grid item xs={12}>
          <Typography
            variant={"subtitle1"}
            color={"text.primary"}
            fontWeight={"bold"}
          >
            {t("orderMetrics.activeOrderValue")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"} color={"text.secondary"}>
            {filteredOrders("active")
              .map((o) => +o.cost)
              .reduce((a, b) => a + b, 0)
              .toLocaleString(undefined)}{" "}
            aUEC
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Section>
      <Section xs={12}>
        <Grid item xs={12}>
          <Typography
            variant={"subtitle1"}
            color={"text.primary"}
            fontWeight={"bold"}
          >
            {t("orderMetrics.completedOrderValue")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h6"} color={"text.secondary"}>
            {(orders || allOrders || [])
              .filter((o) => o.status === "fulfilled")
              .map((o) => +o.cost)
              .reduce((a, b) => a + b, 0)
              .toLocaleString(undefined)}{" "}
            aUEC
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
      </Section>

      {/*<Section xs={12}>*/}
      {/*    <Grid item xs={12}>*/}
      {/*        <Typography variant={'subtitle1'} color={'text.primary'} fontWeight={'bold'}>*/}
      {/*            30 Day Change*/}
      {/*        </Typography>*/}
      {/*    </Grid>*/}

      {/*    <Grid item xs={12}>*/}
      {/*        <Typography variant={'h6'} color={'error.main'}>*/}
      {/*            -13.32%*/}
      {/*        </Typography>*/}
      {/*    </Grid>*/}
      {/*    <Grid item xs={12}>*/}
      {/*        <Divider light/>*/}
      {/*    </Grid>*/}
      {/*</Section>*/}
    </React.Fragment>
  )
}
