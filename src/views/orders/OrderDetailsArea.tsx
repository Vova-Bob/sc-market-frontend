import {
  useCreateOrderThreadMutation,
  useSetOrderStatusMutation,
} from "../../store/orders"
import {
  ButtonGroup,
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
import { MarkdownRender } from "../../components/markdown/Markdown"
import { useCurrentChat } from "../../hooks/messaging/CurrentChat"
import { useGetChatByOrderIDQuery } from "../../store/chats"
import {
  useGetNotificationsQuery,
  useNotificationDeleteMutation,
} from "../../store/notification"
import { Order } from "../../datatypes/Order"
import { MessagesBody } from "../messaging/MessagesBody"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useGetUserByUsernameQuery,
  useGetUserProfileQuery,
} from "../../store/profile"
import LoadingButton from "@mui/lab/LoadingButton"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { statusColors, statusNames } from "./OrderList"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import {
  CancelRounded,
  DoneRounded,
  PlayArrowRounded,
} from "@mui/icons-material"
import { has_permission } from "../contractor/OrgRoles"
import { PAYMENT_TYPE_MAP } from "../../util/constants"
import { useTranslation } from "react-i18next"

export function OrderMessagesArea(props: { order: Order }) {
  const { order } = props
  const { t } = useTranslation()

  const [currentChat, setCurrentChat] = useCurrentChat()
  const { data: chatObj } = useGetChatByOrderIDQuery(order.order_id!, {
    skip: !order,
  })

  const { data: notifications } = useGetNotificationsQuery()
  const [deleteNotification] = useNotificationDeleteMutation()

  useEffect(() => {
    for (const n of notifications || []) {
      if (
        n.action === "order_message" &&
        (n.entity as Order).order_id === order.order_id
      ) {
        deleteNotification([n.notification_id])
      }
    }
  }, [notifications, deleteNotification, order])

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

export function OrderDetailsArea(props: { order: Order }) {
  const { order } = props
  const { t } = useTranslation()
  const { data: profile } = useGetUserProfileQuery()

  const statusColor = useMemo(
    () => statusColors.get(order.status),
    [order.status],
  )
  const status = useMemo(
    () => statusNames.get(order.status) || statusNames.get("not-started")!,
    [order.status],
  )
  const issueAlert = useAlertHook()

  const [setOrderStatus] = useSetOrderStatusMutation()
  const updateOrderStatus = useCallback(
    async (status: string) => {
      setOrderStatus({
        order_id: order.order_id,
        status: status,
      })
        .unwrap()
        .then(() => {
          issueAlert({
            message: t("orderDetailsArea.updated_status"),
            severity: "success",
          })
        })
        .catch((error) => {
          issueAlert(error)
        })
    },
    [order.order_id, issueAlert, setOrderStatus, t],
  )

  const [currentOrg] = useCurrentOrg()

  const { data: contractor } = useGetContractorBySpectrumIDQuery(
    order.contractor!,
    { skip: !order.contractor },
  )
  const { data: assigned } = useGetUserByUsernameQuery(order.assigned_to!, {
    skip: !order.assigned_to,
  })
  const { data: customer } = useGetUserByUsernameQuery(order.customer!, {
    skip: !order.customer,
  })

  const amCustomer = useMemo(
    () => order.customer === profile?.username,
    [order, profile],
  )
  const amAssigned = useMemo(
    () => order.assigned_to === profile?.username,
    [order, profile],
  )
  const amContractor = useMemo(
    () => currentOrg?.spectrum_id === order?.contractor,
    [currentOrg?.spectrum_id, order?.contractor],
  )
  const amRelated = useMemo(
    () => amCustomer || amAssigned || amContractor,
    [amCustomer, amAssigned, amContractor],
  )
  const amContractorManager = useMemo(
    () => amContractor && has_permission(currentOrg, profile, "manage_orders"),
    [currentOrg, profile, amContractor],
  )

  const privateContractCustomer = useMemo(
    () =>
      amCustomer && // I am the customer
      !(amContractorManager || amAssigned) && // I am not assigned or an org admin
      (order.contractor || order.assigned_to), // This is either assigned to someone or has a contractor
    [
      order.contractor,
      order.assigned_to,
      amAssigned,
      amContractorManager,
      amCustomer,
    ],
  )

  const publicContractCustomer = useMemo(
    () => amCustomer && !order.assigned_to && !order.contractor,
    [amCustomer, order],
  )

  const isComplete = useMemo(
    () => ["cancelled", "fulfilled"].includes(order.status),
    [order.status],
  )

  const server_id = useMemo(
    () => order.discord_server_id || contractor?.official_server_id,
    [contractor?.official_server_id, order.discord_server_id],
  )

  const [createThread, { isLoading: createThreadLoading }] =
    useCreateOrderThreadMutation()

  return (
    <Grid item xs={12} lg={8} md={6}>
      <TableContainer component={Paper}>
        <Table aria-label={t("orderDetailsArea.details_table")}>
          <TableBody>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.customer")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  {customer && <UserDetails user={customer} />}
                </Stack>
              </TableCell>
            </TableRow>
            {contractor && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {t("orderDetailsArea.seller")}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"}>
                    {order.contractor && <OrgDetails org={contractor} />}
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {assigned && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {t("orderDetailsArea.assigned")}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"}>
                    {order.assigned_to && <UserDetails user={assigned} />}
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.date")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  {moment(order.timestamp).format("MMMM Do YYYY, h:mm:ss a")}
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.status")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Chip label={t(status)} color={statusColor} />
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.title")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {order.title}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.kind")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {order.kind}
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
                  {t("orderDetailsArea.details")}
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    <MarkdownRender text={order.description} />
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.order")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"}>
                  <Typography color={"text.secondary"} variant={"subtitle2"}>
                    {(+order.cost).toLocaleString(undefined)}{" "}
                    <Typography
                      color={"text.primary"}
                      variant={"subtitle2"}
                      display={"inline"}
                    >
                      aUEC {t(PAYMENT_TYPE_MAP.get(order.payment_type) || "")}
                    </Typography>
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
            {server_id && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {t("orderDetailsArea.discord_thread")}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent={"right"}>
                    <Typography color={"text.secondary"} variant={"subtitle2"}>
                      {order.discord_thread_id ? (
                        <MaterialLink
                          href={`https://discord.com/channels/${server_id}/${order.discord_thread_id}`}
                          variant={"subtitle1"}
                          underline={"hover"}
                          color={"text.secondary"}
                        >
                          {t("orderDetailsArea.thread_link")}
                        </MaterialLink>
                      ) : (
                        <LoadingButton
                          loading={createThreadLoading}
                          onClick={() => {
                            createThread(order.order_id)
                              .unwrap()
                              .then((result) => {
                                issueAlert({
                                  message: t("orderDetailsArea.created_thread"),
                                  severity: "success",
                                })
                              })
                              .catch((err) => {
                                issueAlert(err)
                              })
                          }}
                        >
                          {t("orderDetailsArea.create_thread")}
                        </LoadingButton>
                      )}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {t("orderDetailsArea.update_status")}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent={"right"} spacing={1}>
                  {privateContractCustomer && !isComplete && (
                    <LoadingButton
                      variant={"contained"}
                      color={"error"}
                      startIcon={<CancelRounded />}
                      onClick={() => updateOrderStatus("cancelled")}
                    >
                      {t("orderDetailsArea.cancel")}
                    </LoadingButton>
                  )}
                  {publicContractCustomer && !isComplete && (
                    <LoadingButton
                      variant={"contained"}
                      color={"error"}
                      startIcon={<CancelRounded />}
                      onClick={() => updateOrderStatus("cancelled")}
                    >
                      {t("orderDetailsArea.cancel")}
                    </LoadingButton>
                  )}
                  {(profile?.role === "admin" ||
                    amContractorManager ||
                    amAssigned) && (
                    <ButtonGroup
                      variant="contained"
                      aria-label={t("ui.aria.loadingButtonGroup")}
                    >
                      {(profile?.role === "admin" ||
                        order.status === "not-started" ||
                        order.status === "in-progress") && (
                        <LoadingButton
                          variant={"contained"}
                          color={"success"}
                          startIcon={<DoneRounded />}
                          onClick={() => updateOrderStatus("fulfilled")}
                        >
                          {t("orderDetailsArea.complete_order")}
                        </LoadingButton>
                      )}
                      {(profile?.role === "admin" ||
                        order.status === "not-started") && (
                        <LoadingButton
                          variant={"contained"}
                          color={"warning"}
                          startIcon={<PlayArrowRounded />}
                          onClick={() => updateOrderStatus("in-progress")}
                        >
                          {t("orderDetailsArea.begin_work")}
                        </LoadingButton>
                      )}
                      {profile?.role === "admin" && (
                        <LoadingButton
                          variant={"contained"}
                          color={"info"}
                          startIcon={<PlayArrowRounded />}
                          onClick={() => updateOrderStatus("not-started")}
                        >
                          {t("orderDetailsArea.not_started")}
                        </LoadingButton>
                      )}

                      {(profile?.role === "admin" || !isComplete) && (
                        <LoadingButton
                          variant={"contained"}
                          color={"error"}
                          startIcon={<CancelRounded />}
                          onClick={() => updateOrderStatus("cancelled")}
                        >
                          {t("orderDetailsArea.cancel")}
                        </LoadingButton>
                      )}
                    </ButtonGroup>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
