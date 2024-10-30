import React, { MouseEventHandler, useCallback } from "react"
import { Box, IconButton, TableCell, TableRow, Typography } from "@mui/material"
import { Section } from "../../components/paper/Section"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import {
  useDeleteContractorWebhookMutation,
  useGetContractorWebhooksQuery,
} from "../../store/contractor"
import {
  useGetUserWebhooks,
  useProfileDeleteWebhook,
} from "../../store/profile"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { OrderWebhook } from "../../datatypes/Contractor"
import { DeleteRounded } from "@mui/icons-material"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"

export const headCells: readonly HeadCell<OrderWebhook>[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    // maxWidth: '75%'
  },
  {
    id: "webhook_id",
    numeric: false,
    disablePadding: false,
    label: "",
    noSort: true,
  },
]

export function WebhookRow(props: {
  row: OrderWebhook
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
  org?: boolean
}): JSX.Element {
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column
  const [currentOrg] = useCurrentOrg()

  const [
    deleteUserWebhook, // This is the mutation trigger
  ] = useProfileDeleteWebhook()
  const [
    deleteContractorWebhook, // This is the mutation trigger
  ] = useDeleteContractorWebhookMutation()

  const theme = useTheme<ExtendedTheme>()
  const issueAlert = useAlertHook()

  const submitDelete = useCallback(async () => {
    // event.preventDefault();
    let res: { data?: any; error?: any }
    if (props.org) {
      res = await deleteContractorWebhook({
        contractor: currentOrg!.spectrum_id,
        webhook_id: row.webhook_id,
      })
    } else {
      res = await deleteUserWebhook({
        webhook_id: row.webhook_id,
      })
    }

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Submitted!",
        severity: "success",
      })
    } else {
      issueAlert({
        message: `Failed to submit! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
    return false
  }, [
    currentOrg,
    deleteContractorWebhook,
    deleteUserWebhook,
    props.org,
    row.webhook_id,
    issueAlert,
  ])

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
        <TableCell align={"left"}>
          <Box
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
          >
            <Typography color={"text.secondary"} variant={"body1"}>
              {row.name}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              overflowWrap: "anywhere",
            }}
          >
            <Typography color={"text.primary"} variant={"body2"}>
              {row.webhook_url}
            </Typography>
          </Box>
        </TableCell>

        <TableCell
          padding="checkbox"
          onClick={(event) => {
            event.stopPropagation()
          }}
          align={"right"}
        >
          <IconButton
            onClick={(event) => {
              submitDelete()
              event.stopPropagation()
            }}
          >
            <DeleteRounded style={{ color: theme.palette.error.main }} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

export function MyWebhooks(props: { org?: boolean }) {
  const [currentOrg] = useCurrentOrg()
  const { data: contractorWebhooks } = useGetContractorWebhooksQuery(
    currentOrg?.spectrum_id!,
    { skip: !props.org },
  )
  const { data: webhooks } = useGetUserWebhooks(undefined, {
    skip: !!props.org,
  })

  return (
    <Section xs={12} md={12} lg={12} xl={12} disablePadding title={"Webhooks"}>
      <PaginatedTable
        rows={webhooks || contractorWebhooks || []}
        initialSort={"name"}
        generateRow={(iprops) => <WebhookRow {...iprops} org={props.org} />}
        keyAttr={"webhook_id"}
        headCells={headCells}
        disableSelect
      />
    </Section>
  )
}
