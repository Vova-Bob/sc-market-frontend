import React, { MouseEventHandler, useCallback, useEffect } from "react"
import { Box, IconButton, TableCell, TableRow, Typography } from "@mui/material"
import { Section } from "../../components/paper/Section"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import {
  useDeleteContractorInviteMutation,
  useGetContractorInvitesQuery,
} from "../../store/contractor"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  ContentCopyRounded,
  CopyAllRounded,
  DeleteRounded,
} from "@mui/icons-material"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { ContractorInviteCode } from "../../datatypes/Contractor"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { useLocation } from "react-router-dom"

export const headCells: readonly HeadCell<ContractorInviteCode>[] = [
  {
    id: "invite_id",
    numeric: false,
    disablePadding: false,
    label: "Invite Code",
    // maxWidth: '75%'
  },
  {
    id: "invite_id",
    numeric: false,
    disablePadding: true,
    label: "",
    noSort: true,
  },
  {
    id: "invite_id",
    numeric: false,
    disablePadding: false,
    label: "",
    noSort: true,
  },
]

export function InviteRow(props: {
  row: ContractorInviteCode
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
}): JSX.Element {
  const { row, index, isItemSelected } = props // TODO: Add `assigned_to` column
  const [currentOrg] = useCurrentOrg()
  const theme = useTheme<ExtendedTheme>()

  const [
    deleteContractorInvite, // This is the mutation trigger
  ] = useDeleteContractorInviteMutation()

  const issueAlert = useAlertHook()

  const submitDelete = useCallback(async () => {
    // event.preventDefault();
    let res: { data?: any; error?: any }
    res = await deleteContractorInvite({
      contractor: currentOrg!.spectrum_id,
      invite_id: row.invite_id,
    })

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
  }, [currentOrg, deleteContractorInvite, row.invite_id, issueAlert])

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
              {row.invite_id}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: "center",
            }}
          >
            <Typography color={"text.primary"} variant={"body2"}>
              Used {row.times_used}/{row.max_uses || "∞"} times
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
              navigator.clipboard.writeText(
                `${window.location.origin}/contractor_invite/${row.invite_id}` ||
                  "PLACEHOLDER",
              )
              issueAlert({ message: "Copied!", severity: "success" })
              event.stopPropagation()
            }}
          >
            <ContentCopyRounded style={{ color: theme.palette.primary.main }} />
          </IconButton>
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

export function ListInviteCodes() {
  const [currentOrg] = useCurrentOrg()
  const { data: contractorInvites } = useGetContractorInvitesQuery(
    currentOrg?.spectrum_id!,
  )

  return (
    <Section xs={12} md={12} lg={12} xl={12} disablePadding title={"Invites"}>
      <PaginatedTable
        rows={contractorInvites || []}
        initialSort={"invite_id"}
        generateRow={InviteRow}
        keyAttr={"invite_id"}
        headCells={headCells}
        disableSelect
      />
    </Section>
  )
}
