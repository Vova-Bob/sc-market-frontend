import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material"
import { Stack } from "@mui/system"
import { UserDetails } from "../../components/list/UserDetails"
import moment from "moment"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { paymentTypeMessages } from "../orders/Services"
import React from "react"
import { PublicContract } from "../../store/public_contracts"
import { useTranslation } from "react-i18next"

export function ContractDetailsArea(props: { contract: PublicContract }) {
  const { contract } = props
  const { t } = useTranslation()
  const paymentType = paymentTypeMessages.get(contract.payment_type)

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table aria-label="details table">
          <TableBody>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                Customer
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <UserDetails user={contract.customer} />
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Date
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  {moment(contract.timestamp).format("MMMM Do YYYY, h:mm:ss a")}
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Title
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {contract.title}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Kind
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {contract.kind}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell colSpan={2}>
                <Stack direction="column" spacing={1}>
                  Details
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    <MarkdownRender text={contract.description} />
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Offer
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {(+contract.cost).toLocaleString(undefined)}{" "}
                    <Typography
                      color={"text.primary"}
                      variant={"subtitle2"}
                      display={"inline"}
                    >
                      aUEC {paymentType ? t(paymentType) : ""}
                    </Typography>
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
