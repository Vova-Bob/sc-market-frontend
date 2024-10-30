import {
  KeyboardArrowDownRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material"
import { PaymentType, Service } from "../../datatypes/Order"
import React, { MouseEventHandler, useEffect, useMemo, useState } from "react"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import { Section } from "../../components/paper/Section"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { Link } from "react-router-dom"
import { MarkdownRender } from "../../components/markdown/Markdown"
import {
  useGetServicesContractorQuery,
  useGetServicesQuery,
} from "../../store/services"

export interface ServiceRowProps {
  row: Service
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}

export const mobileHeadCells: readonly HeadCell<Service>[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
    // maxWidth: '75%'
  },
  // {
  //     id: 'cost',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Cost',
  //     // maxWidth: '15%'
  // },
  {
    id: "service_id",
    numeric: false,
    disablePadding: false,
    label: "",
    noSort: true,
  },
]

export const BorderlessCell = styled(TableCell)({
  borderBottom: "none",
})

export function ServiceDetailsRow(props: { open: boolean; service: Service }) {
  const theme = useTheme<ExtendedTheme>()
  const { open, service } = props

  return (
    <TableRow
      sx={{
        textDecoration: "none",
        color: "inherit",
        borderTop: "none",
        "& > *": {
          borderTop: "none",
        },
      }}
    >
      <TableCell colSpan={6} sx={{ padding: 0 }}>
        <Collapse in={open}>
          <Box
            sx={{
              width: "100%",
              padding: 2,
              paddingTop: 0,
            }}
          >
            <CardActionArea
              component={Link}
              to={`/order/service/${service.service_id}/edit`}
            >
              <Card
                variant={"outlined"}
                sx={{
                  width: "100%",
                  borderColor: theme.palette.outline.main,
                  borderRadius: 4,
                  paddingBottom: 2,
                }}
              >
                <CardHeader
                  title={
                    <Typography
                      sx={{ marginRight: 1 }}
                      variant={"subtitle1"}
                      color={"text.secondary"}
                    >
                      {service.title || <i>Title not defined</i>} (
                      {service.kind || <i>Type not defined</i>})
                    </Typography>
                  }
                />
                <CardContent sx={{ padding: 2 }}>
                  <Typography
                    sx={{
                      marginRight: 1,
                      // maxHeight: 350,
                      maxWidth: "100%",
                      lineClamp: "10",
                      textOverflow: "ellipsis",
                      // whiteSpace: "pre-line",
                      overflow: "hidden",
                      "-webkit-box-orient": "vertical",
                      display: "-webkit-box",
                      "-webkit-line-clamp": "10",
                    }}
                    variant={"body2"}
                  >
                    <MarkdownRender
                      text={service.description || "_Description not defined_"}
                    />
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}

export const paymentTypeMessages = new Map<PaymentType, string>()
paymentTypeMessages.set("one-time", "")
paymentTypeMessages.set("hourly", "per hour")
paymentTypeMessages.set("daily", "per day")
paymentTypeMessages.set("unit", "per unit")
paymentTypeMessages.set("box", "per box")
paymentTypeMessages.set("scu", "per SCU")
paymentTypeMessages.set("cscu", "per cSCU")
paymentTypeMessages.set("mscu", "per mSCU")

export function MobileServiceRow(props: ServiceRowProps) {
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false) // row changed, so close
  }, [row])

  return (
    <>
      <TableRow
        hover
        // onClick={onClick}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={index}
        selected={isItemSelected}
        // component={Link} to={`/contract/${row.order_id}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          borderBottom: "none",
          border: "none",
        }}
      >
        <BorderlessCell align={"left"}>
          <Box
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
          >
            <span
              style={{
                maxWidth: 200,
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {row.service_name}
            </span>
          </Box>
          <Typography variant={"subtitle2"} color={"primary"}>
            {row.cost.toLocaleString("en-US")} aUEC{" "}
            {paymentTypeMessages.get(row.payment_type)}
          </Typography>
        </BorderlessCell>

        <BorderlessCell
          padding="checkbox"
          onClick={(event) => {
            event.stopPropagation()
          }}
          align={"right"}
        >
          <IconButton
            onClick={(event) => {
              setOpen((o) => !o)
              event.stopPropagation()
            }}
          >
            {open ? (
              <KeyboardArrowDownRounded />
            ) : (
              <KeyboardArrowRightRounded />
            )}
          </IconButton>
        </BorderlessCell>
      </TableRow>
      <ServiceDetailsRow open={open} service={row} />
    </>
  )
}

export function MyServices(props: { status: string }) {
  const { status } = props
  const { data: profile } = useGetUserProfileQuery()
  const [currentOrg] = useCurrentOrg()

  const { data: listings } = useGetServicesQuery(profile?.username!, {
    skip: !profile || !!currentOrg,
  })

  const { data: orglistings } = useGetServicesContractorQuery(
    currentOrg?.spectrum_id!,
    { skip: !currentOrg },
  )

  // const [status, setStatus] = useState('active')

  const filteredServices = useMemo(
    () =>
      ((currentOrg ? orglistings : listings) || []).filter((service) => {
        return !status || status === service.status
      }),
    [currentOrg, listings, orglistings, status],
  )

  return (
    <Section
      xs={12}
      md={12}
      lg={12}
      xl={12}
      disablePadding
      // subtitle={<FormGroup>
      //     <FormControlLabel control={<Switch onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      //         setStatus(event.target.checked ? 'active' : 'inactive');
      //     }} checked={status === 'active'}/>} label="Active Services"/>
      // </FormGroup>}
      title={`${status === "active" ? "Active" : "Inactive"} Services`}
    >
      <PaginatedTable
        rows={filteredServices}
        initialSort={"service_name"}
        generateRow={MobileServiceRow}
        keyAttr={"service_id"}
        headCells={mobileHeadCells}
        disableSelect
      />
    </Section>
  )
}
