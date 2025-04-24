import {
  OfferSession,
  useCreateOfferThreadMutation,
  useUpdateOfferStatusMutation,
} from "../../store/offer"
import {
  Chip,
  Grid,
  Link as MaterialLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material"
import React, { useCallback, useEffect, useMemo } from "react"
import { OrgDetails, UserDetails } from "../../components/list/UserDetails"
import { Stack } from "@mui/system"
import moment from "moment/moment"
import {
  Announcement,
  Cancel,
  CheckCircle,
  HourglassTop,
} from "@mui/icons-material"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { useCurrentChat } from "../../hooks/messaging/CurrentChat"
import { useGetChatByOfferIDQuery } from "../../store/chats"
import {
  useGetNotificationsQuery,
  useNotificationDeleteMutation,
} from "../../store/notification"
import { Order } from "../../datatypes/Order"
import { MessagesBody } from "../messaging/MessagesBody"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import LoadingButton from "@mui/lab/LoadingButton"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { Link, useNavigate } from "react-router-dom"
import { paymentTypeMessages } from "../orders/Services"
import { useGetPublicContractQuery } from "../../store/public_contracts"

export function OfferMessagesArea(props: { offer: OfferSession }) {
  const { offer } = props
  const [currentChat, setCurrentChat] = useCurrentChat()
  const { data: chatObj } = useGetChatByOfferIDQuery(offer.id!, {
    skip: !offer,
  })

  const { data: notifications } = useGetNotificationsQuery()
  const [deleteNotification] = useNotificationDeleteMutation()

  useEffect(() => {
    for (const n of notifications || []) {
      if (
        n.action === "offer_message" &&
        (n.entity as Order).order_id === offer.id
      ) {
        deleteNotification([n.notification_id])
      }
    }
  }, [notifications, deleteNotification, offer])

  useEffect(() => {
    setCurrentChat(chatObj)

    return () => {
      setCurrentChat(null)
    }
  }, [chatObj, setCurrentChat])

  return (
    <Grid item xs={12} lg={4} md={6}>
      <Paper
        sx={{
          maxHeight: 600,
          display: "flex",
          alignItems: "space-between",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {currentChat && <MessagesBody key={currentChat.chat_id} />}
      </Paper>
    </Grid>
  )
}

export function OfferDetailsArea(props: { session: OfferSession }) {
  const { session } = props
  const [org] = useCurrentOrg()
  const { data: profile } = useGetUserProfileQuery()
  const { data: publicContract } = useGetPublicContractQuery(
    session?.contract_id!,
    { skip: !session?.contract_id },
  )

  const [statusColor, icon] = useMemo(() => {
    if (session.status === "Waiting for Seller") {
      return ["warning" as const, <Announcement key={"warning"} />] as const
    } else if (session.status === "Waiting for Customer") {
      return ["info" as const, <HourglassTop key={"info"} />] as const
    } else if (session.status === "Rejected") {
      return ["error" as const, <Cancel key={"error"} />] as const
    } else {
      return ["success" as const, <CheckCircle key={"success"} />] as const
    }
  }, [session.status])

  const showAccept = useMemo(() => {
    if (["Rejected", "Accepted"].includes(session.status)) {
      return false
    }

    if (session.contractor) {
      if (org?.spectrum_id === session.contractor.spectrum_id) {
        return session.status === "Waiting for Seller"
      }
    }

    if (session.assigned_to) {
      if (profile?.username === session.assigned_to.username) {
        return session.status === "Waiting for Seller"
      }
    }

    if (profile?.username === session.customer.username) {
      return session.status === "Waiting for Customer"
    }

    return false
  }, [profile, org, session])

  const showCancel =
    !showAccept && !["Rejected", "Accepted"].includes(session.status)

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOfferStatusMutation()
  const issueAlert = useAlertHook()
  const navigate = useNavigate()

  const updateStatusCallback = useCallback(
    (status: "accepted" | "rejected" | "cancelled") => {
      updateStatus({ session_id: session.id, status: status })
        .unwrap()
        .then((result) => {
          if (result.order_id) navigate(`/contract/${result.order_id}`)
        })
        .catch((err) => {
          issueAlert(err)
        })
    },
    [session.id, updateStatus, navigate, issueAlert],
  )

  const [createThread, { isLoading: createThreadLoading }] =
    useCreateOfferThreadMutation()

  return (
    <Grid item xs={12} lg={8} md={6}>
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
                  <UserDetails user={session.customer} />
                </Stack>
              </TableCell>
            </TableRow>
            {session.contract_id && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Associated Contract
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"}>
                    <MaterialLink
                      component={Link}
                      underline="hover"
                      to={`/contracts/public/${publicContract?.id}`}
                      color={"text.secondary"}
                    >
                      {publicContract?.title}
                    </MaterialLink>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Seller
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  {session.assigned_to && (
                    <UserDetails user={session.assigned_to} />
                  )}
                  {session.contractor && (
                    <OrgDetails org={session.contractor} />
                  )}
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
                  {moment(session.offers[0].timestamp).format(
                    "MMMM Do YYYY, h:mm:ss a",
                  )}
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Status
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Chip
                    label={session.status}
                    color={statusColor}
                    icon={icon}
                  />
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
                    {session.offers[0].title}
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
                    {session.offers[0].kind}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/*<TableCell component="th" scope="row">*/}
              {/*  Description*/}
              {/*</TableCell>*/}
              <TableCell colSpan={2}>
                <Stack direction="column" spacing={1}>
                  Details
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    <MarkdownRender text={session.offers[0].description} />
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
                    {(+session.offers[0].cost).toLocaleString(undefined)}{" "}
                    <Typography
                      color={"text.primary"}
                      variant={"subtitle2"}
                      display={"inline"}
                    >
                      aUEC{" "}
                      {paymentTypeMessages.get(session.offers[0].payment_type)}
                    </Typography>
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            {session.discord_server_id && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Discord Thread
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"}>
                    <Typography color={"text.secondary"} variant={"subtitle2"}>
                      {session.discord_thread_id ? (
                        <MaterialLink
                          href={`https://discord.com/channels/${session.discord_server_id}/${session.discord_thread_id}`}
                          variant={"subtitle1"}
                          underline={"hover"}
                          color={"text.secondary"}
                        >
                          Thread Link
                        </MaterialLink>
                      ) : (
                        <LoadingButton
                          loading={createThreadLoading}
                          onClick={() => {
                            createThread(session.id)
                              .unwrap()
                              .then((result) => {
                                issueAlert({
                                  message: "Created thread",
                                  severity: "success",
                                })
                              })
                              .catch((err) => {
                                issueAlert(err)
                              })
                          }}
                        >
                          Create Thread
                        </LoadingButton>
                      )}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {showAccept && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Accept or Decline
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"} spacing={1}>
                    <LoadingButton
                      color={"success"}
                      variant={"contained"}
                      loading={isUpdatingStatus}
                      onClick={() => updateStatusCallback("accepted")}
                    >
                      Accept
                    </LoadingButton>
                    <Link to={`/offer/${session.id}/counteroffer`}>
                      <LoadingButton color={"warning"} variant={"contained"}>
                        Counter Offer
                      </LoadingButton>
                    </Link>
                    <LoadingButton
                      color={"error"}
                      variant={"contained"}
                      loading={isUpdatingStatus}
                      onClick={() => updateStatusCallback("rejected")}
                    >
                      Reject
                    </LoadingButton>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {showCancel && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Cancel Order
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"} spacing={1}>
                    <LoadingButton
                      color={"error"}
                      variant={"contained"}
                      loading={isUpdatingStatus}
                      onClick={() => updateStatusCallback("cancelled")}
                    >
                      Cancel
                    </LoadingButton>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
