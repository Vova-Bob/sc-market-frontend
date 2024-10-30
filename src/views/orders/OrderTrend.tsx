import { Section } from "../../components/paper/Section"
import { OrderStub } from "../../datatypes/Order"
import React, { useMemo } from "react"
import { Grid, List, ListItem } from "@mui/material"
import Chart from "react-apexcharts"
import {
  useGetAllAssignedOrdersQuery,
  useGetAssignedOrdersByContractorQuery,
  useGetOrdersByContractorQuery,
} from "../../store/orders"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { Link } from "react-router-dom"

function round(n: number, increment: number, offset: number) {
  return Math.ceil((n - offset) / increment) * increment + offset
}

function getTotalInInterval(
  orders: OrderStub[],
  interval: number,
  first: Date,
) {
  const count = Math.ceil((new Date().getTime() - first.getTime()) / interval)

  const items = new Map<number, number>()
  for (let i = 0; i < count; i++) {
    items.set(first.getTime() + i * interval, 0)
  }

  orders.forEach((o) => {
    const key = round(+new Date(o.timestamp), interval, first.getTime())
    const current = items.get(key) || 0
    items.set(key, current + 1)
  })

  return Array.from(items.entries())
    .sort((a, b) => +a[0]! - +b[0]!)
    .map((entry) => ({ x: new Date(entry[0]).toISOString(), y: entry[1] }))
}

export function OrderTrend(props: { orders: OrderStub[] }) {
  const { orders } = props
  const first = useMemo(
    () =>
      orders.reduce(
        (c, o) => (c < new Date(o.timestamp) ? c : new Date(o.timestamp)),
        new Date(),
      ),
    [orders],
  )

  const dataDailyTotal = useMemo(
    () => getTotalInInterval(orders, 86400 * 1000, first),
    [first, orders],
  )

  const dataDailyStatus = useMemo(
    () =>
      ["in-progress", "fulfilled", "cancelled", "not-started"]
        .map((status) => Array.from(orders.filter((o) => o.status === status)))
        .map((os) => getTotalInInterval(os, 86400 * 1000, first)),
    [first, orders],
  )

  const dataWeeklyTotal = useMemo(
    () => getTotalInInterval(orders, 604800 * 1000, first),
    [first, orders],
  )

  const dataWeeklyStatus = useMemo(
    () =>
      ["in-progress", "fulfilled", "cancelled", "not-started"]
        .map((status) => Array.from(orders.filter((o) => o.status === status)))
        .map((os) => getTotalInInterval(os, 604800 * 1000, first)),
    [first, orders],
  )

  const dataMonthlyTotal = useMemo(
    () => getTotalInInterval(orders, 2.628e6 * 1000, first),
    [first, orders],
  )

  const dataMonthlyStatus = useMemo(
    () =>
      ["in-progress", "fulfilled", "cancelled", "not-started"]
        .map((status) => Array.from(orders.filter((o) => o.status === status)))
        .map((os) => getTotalInInterval(os, 2.628e6 * 1000, first)),
    [first, orders],
  )

  return (
    <>
      <Section xs={12} title={"Order Count Daily"}>
        <Grid item xs={12}>
          {/* @ts-ignore */}
          <Chart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                labels: {
                  format: "yy/MM/dd",
                },
              },
              yaxis: {
                forceNiceScale: true,
                min: 0,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "yy/MM/dd",
                },
              },
            }}
            series={[
              {
                name: "Orders Daily",
                data: dataDailyTotal,
              },
              ...dataDailyStatus.map((data, i) => ({
                name: ["in-progress", "fulfilled", "cancelled", "not-started"][
                  i
                ],
                data,
              })),
            ]}
          />
        </Grid>
      </Section>
      <Section xs={12} title={"Order Count Weekly"}>
        <Grid item xs={12}>
          {/* @ts-ignore */}
          <Chart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                labels: {
                  format: "yy/MM/dd",
                },
              },
              yaxis: {
                forceNiceScale: true,
                min: 0,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "yy/MM/dd",
                },
              },
            }}
            series={[
              {
                name: "Orders Weekly",
                data: dataWeeklyTotal,
              },
              ...dataWeeklyStatus.map((data, i) => ({
                name: ["in-progress", "fulfilled", "cancelled", "not-started"][
                  i
                ],
                data,
              })),
            ]}
          />
        </Grid>
      </Section>

      <Section xs={12} title={"Order Count Monthly"}>
        <Grid item xs={12}>
          {/* @ts-ignore */}
          <Chart
            width={"100%"}
            height={400}
            type={"area"}
            options={{
              xaxis: {
                type: "datetime",
                labels: {
                  format: "MM/yy",
                },
              },
              yaxis: {
                forceNiceScale: true,
                min: 0,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.45,
                  opacityTo: 0.05,
                  stops: [20, 100, 100, 100],
                },
              },
              tooltip: {
                x: {
                  format: "MM/yy",
                },
              },
            }}
            series={[
              {
                name: "Orders Monthly",
                data: dataMonthlyTotal,
              },
              ...dataMonthlyStatus.map((data, i) => ({
                name: ["in-progress", "fulfilled", "cancelled", "not-started"][
                  i
                ],
                data,
              })),
            ]}
          />
        </Grid>
      </Section>
    </>
  )
}

export function OrgOrderTrend() {
  const [contractor] = useCurrentOrg()
  const { data: orders } = useGetOrdersByContractorQuery(
    contractor?.spectrum_id!,
    {
      skip: !contractor?.spectrum_id,
    },
  )

  return <OrderTrend orders={orders || []} />
}

export function UserOrderTrend() {
  const [contractor] = useCurrentOrg()

  const { data: orders } = useGetAssignedOrdersByContractorQuery(
    contractor?.spectrum_id!,
    { skip: !contractor?.spectrum_id },
  )
  const { data: allOrders } = useGetAllAssignedOrdersQuery(undefined, {
    skip: !!contractor,
  })

  return <OrderTrend orders={[...(orders || []), ...(allOrders || [])]} />
}

export function TopContractors(props: { orders: OrderStub[] }) {
  const { orders } = props
  const topTen = useMemo(() => {
    const orderCounts = orders.reduce((old, order) => {
      if (!order.contractor) {
        return old
      }
      const oldVal = old.get(order.contractor.name)
      if (oldVal !== undefined) {
        return old.set(order.contractor.name, [
          oldVal[0] + (order.status === "fulfilled" ? 1 : 0),
          oldVal[1] + 1,
        ])
      } else {
        return old.set(order.contractor.name, [
          order.status === "fulfilled" ? 1 : 0,
          1,
        ])
      }
    }, new Map<string, [number, number]>())

    return Array.from(orderCounts, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value[0] - a.value[0],
    )
    // .slice(0, 10)
  }, [orders])

  return (
    <Section title={"Top Contractors"} xs={12} lg={3}>
      <ol>
        {topTen.map((c) => (
          <li key={c.name}>
            <UnderlineLink
              color={"text.secondary"}
              to={`/contractor/${c.name}`}
              component={Link}
            >
              {c.name}
            </UnderlineLink>
            : {c.value[0]}/{c.value[1]}
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function TopUsers(props: { orders: OrderStub[] }) {
  const { orders } = props
  const topTen = useMemo(() => {
    const orderCounts = orders.reduce((old, order) => {
      if (!order.assigned_to || order.contractor) {
        return old
      }
      const oldVal = old.get(order.assigned_to.username)
      if (oldVal !== undefined) {
        return old.set(order.assigned_to.username, [
          oldVal[0] + (order.status === "fulfilled" ? 1 : 0),
          oldVal[1] + 1,
        ])
      } else {
        return old.set(order.assigned_to.username, [
          order.status === "fulfilled" ? 1 : 0,
          1,
        ])
      }
    }, new Map<string, [number, number]>())

    return Array.from(orderCounts, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value[0] - a.value[0],
    )
    // .slice(0, 10)
  }, [orders])

  return (
    <Section title={"Top Users"} xs={12} lg={3}>
      <List sx={{ maxHeight: 400, overflowY: "scroll" }}>
        {topTen.map((c, i) => (
          <ListItem key={c.name}>
            {i + 1}.&nbsp;
            <UnderlineLink
              color={"text.secondary"}
              to={`/user/${c.name}`}
              component={Link}
            >
              {c.name}
            </UnderlineLink>
            : {c.value[0]}/{c.value[1]}
          </ListItem>
        ))}
      </List>
    </Section>
  )
}

export function TopUsersThisWeek(props: { orders: OrderStub[] }) {
  const { orders } = props
  const topTen = useMemo(() => {
    const orderCounts = orders
      .filter((o) => +o.timestamp > Date.now() - 604800000)
      .reduce((old, order) => {
        if (!order.assigned_to || order.contractor) {
          return old
        }
        const oldVal = old.get(order.assigned_to.username)
        if (oldVal !== undefined) {
          return old.set(order.assigned_to.username, [
            oldVal[0] + (order.status === "fulfilled" ? 1 : 0),
            oldVal[1] + 1,
          ])
        } else {
          return old.set(order.assigned_to.username, [
            order.status === "fulfilled" ? 1 : 0,
            1,
          ])
        }
      }, new Map<string, [number, number]>())

    return Array.from(orderCounts, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value[0] - a.value[0],
    )
    // .slice(0, 10)
  }, [orders])

  return (
    <Section title={"Top Users (Weekly)"} xs={12} lg={3}>
      <List sx={{ maxHeight: 400, overflowY: "scroll" }}>
        {topTen.map((c, i) => (
          <ListItem key={c.name}>
            {i + 1}.&nbsp;
            <UnderlineLink
              color={"text.secondary"}
              to={`/user/${c.name}`}
              component={Link}
            >
              {c.name}
            </UnderlineLink>
            : {c.value[0]}/{c.value[1]}
          </ListItem>
        ))}
      </List>
    </Section>
  )
}

export function TopUsersThisMonth(props: { orders: OrderStub[] }) {
  const { orders } = props
  const topTen = useMemo(() => {
    const orderCounts = orders
      .filter((o) => +o.timestamp > Date.now() - 2.628e9)
      .reduce((old, order) => {
        if (!order.assigned_to || order.contractor) {
          return old
        }
        const oldVal = old.get(order.assigned_to.username)
        if (oldVal !== undefined) {
          return old.set(order.assigned_to.username, [
            oldVal[0] + (order.status === "fulfilled" ? 1 : 0),
            oldVal[1] + 1,
          ])
        } else {
          return old.set(order.assigned_to.username, [
            order.status === "fulfilled" ? 1 : 0,
            1,
          ])
        }
      }, new Map<string, [number, number]>())

    return Array.from(orderCounts, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value[0] - a.value[0],
    )
    // .slice(0, 10)
  }, [orders])

  return (
    <Section title={"Top Users (Monthly)"} xs={12} lg={3}>
      <List sx={{ maxHeight: 400, overflowY: "scroll" }}>
        {topTen.map((c, i) => (
          <ListItem key={i}>
            {i + 1}.&nbsp;
            <UnderlineLink
              color={"text.secondary"}
              to={`/user/${c.name}`}
              component={Link}
            >
              {c.name}
            </UnderlineLink>
            : {c.value[0]}/{c.value[1]}
          </ListItem>
        ))}
      </List>
    </Section>
  )
}
