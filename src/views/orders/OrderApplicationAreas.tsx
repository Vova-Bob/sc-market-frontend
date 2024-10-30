import { Order, OrderApplicant } from "../../datatypes/Order"
import { Section } from "../../components/paper/Section"
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useState } from "react"
import {
  useAcceptOrderApplicantMutation,
  useApplyToOrderMutation,
} from "../../store/orders"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  PublishRounded,
} from "@mui/icons-material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function OrderApplicantsArea(props: { order: Order }) {
  const { order } = props

  return (
    <Section xs={12} title={"Applicants"}>
      <List sx={{ width: "100%" }}>
        {order.applicants.map((applicant, index) => (
          <ApplicantListItem order={order} key={index} applicant={applicant} />
        ))}
      </List>
    </Section>
  )
}

export function ApplicantListItem(props: {
  order: Order
  applicant: OrderApplicant
}) {
  const { applicant } = props

  const { order } = props

  const [open, setOpen] = useState(false)

  const [acceptApplicant] = useAcceptOrderApplicantMutation()

  const issueAlert = useAlertHook()

  const acceptApp = useCallback(async () => {
    const res: {
      data?: any
      error?: any
    } = await acceptApplicant({
      order_id: order.order_id,
      contractor_id: applicant.org_applicant?.spectrum_id,
      user_id: applicant.user_applicant?.username,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Accepted!",
        severity: "success",
      })
    } else {
      issueAlert({
        message: `Failed to accept! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
  }, [
    acceptApplicant,
    order.order_id,
    applicant.org_applicant?.spectrum_id,
    applicant.user_applicant?.username,
    issueAlert,
  ])

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="expand"
            onClick={() => setOpen((o) => !o)}
            color={"inherit"}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            variant={"rounded"}
            src={
              applicant.org_applicant?.avatar ||
              applicant.user_applicant?.username
            }
          />
        </ListItemAvatar>
        <ListItemText>
          {applicant.org_applicant?.spectrum_id ||
            applicant.user_applicant?.username}
        </ListItemText>
      </ListItem>
      <Collapse component={ListItem} in={open}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography sx={{ width: "100%" }}>{applicant.message}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button color={"primary"} variant={"outlined"} onClick={acceptApp}>
              Accept
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

export function OrderApplyArea(props: { order: Order }) {
  const { order } = props
  const [currentOrg] = useCurrentOrg()

  const [
    applyToOrder, // This is the mutation trigger
    // {isLoading}, // This is the destructured mutation result
  ] = useApplyToOrderMutation()

  const [appMessage, setAppMessage] = useState("")
  const issueAlert = useAlertHook()

  const processApp = async () => {
    const res: {
      data?: any
      error?: any
    } = await applyToOrder({
      order_id: order.order_id,
      contractor_id: currentOrg?.spectrum_id,
      message: appMessage,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Applied!",
        severity: "success",
      })
    } else {
      issueAlert({
        message: `Failed to apply! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
  }

  return (
    <Section xs={12} title={"Apply"}>
      <Grid item xs={12}>
        <TextField
          value={appMessage}
          onChange={(e) => setAppMessage(e.target.value)}
          maxRows={5}
          minRows={5}
          label={"Message"}
          multiline
          sx={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={12}>
        <Box
          display={"flex"}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
          sx={{ width: "100%" }}
        >
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={processApp}
            startIcon={<PublishRounded />}
          >
            Apply
          </Button>
        </Box>
      </Grid>
    </Section>
  )
}
