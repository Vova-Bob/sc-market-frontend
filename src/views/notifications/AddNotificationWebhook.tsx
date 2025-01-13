import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { Section } from "../../components/paper/Section"
import React, { useCallback, useState } from "react"
import { useProfileCreateWebhook } from "../../store/profile"
import { useCreateContractorWebhookMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { URL_REGEX } from "../../util/parsing"

function NotificationActionCheck(props: {
  label: string
  action_name: string
  actions: string[]
  setActions: (a: string[]) => void
}) {
  const { action_name, setActions, label, actions } = props

  return (
    <Grid item>
      <FormControlLabel
        control={
          <Checkbox
            // checked={state.checkedB}
            onChange={(event: React.ChangeEvent<{ checked: boolean }>) => {
              if (event.target.checked) {
                if (actions.indexOf(action_name) === -1) {
                  setActions([...actions, action_name])
                }
              } else {
                setActions(actions.filter((item) => item !== action_name))
              }
            }}
            color={"secondary"}
            name={label}
          />
        }
        label={label}
      />
    </Grid>
  )
}

export function AddNotificationWebhook(props: { org?: boolean }) {
  const [currentOrg] = useCurrentOrg()
  const [name, setName] = useState("")
  const [url, setURL] = useState("")
  const [actions, setActions] = useState<string[]>([])

  const [
    createUserWebhook, // This is the mutation trigger
  ] = useProfileCreateWebhook()
  const [
    createContractorWebhook, // This is the mutation trigger
  ] = useCreateContractorWebhookMutation()

  const issueAlert = useAlertHook()

  const submitCreateForm = useCallback(
    async (event: any) => {
      // event.preventDefault();
      let response
      if (props.org) {
        response = createContractorWebhook({
          contractor: currentOrg!.spectrum_id,
          body: {
            name: name,
            webhook_url: url,
            actions,
          },
        })
      } else {
        response = createUserWebhook({
          name: name,
          webhook_url: url,
          actions,
        })
      }

      response
        .unwrap()
        .then((res) => {
          issueAlert({
            message: "Submitted!",
            severity: "success",
          })
        })
        .catch((err) => {
          issueAlert(err)
        })

      return false
    },
    [
      createContractorWebhook,
      createUserWebhook,
      currentOrg,
      name,
      props.org,
      issueAlert,
      actions,
      url,
    ],
  )

  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <Typography
          variant={"h6"}
          align={"left"}
          color={"text.secondary"}
          sx={{ fontWeight: "bold" }}
        >
          Add Discord Notification Webhook
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="name"
          color={"secondary"}
          label={"Webhook Name"}
          value={name}
          onChange={(event: any) => {
            setName(event.target.value)
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="url"
          color={"secondary"}
          label={"Webhook URL"}
          value={url}
          onChange={(event: any) => {
            setURL(event.target.value)
          }}
          error={!!url && !url.match(URL_REGEX)}
          helperText={
            !!url && !url.match(URL_REGEX) ? "Invalid URL" : undefined
          }
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={1} direction={"column"}>
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Order Created"}
            action_name={"order_create"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Order Assigned to Me"}
            action_name={"order_assigned"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Public Contract Created"}
            action_name={"public_order_create"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Order Status Change"}
            action_name={"order_status_change"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Order Review Recieved"}
            action_name={"order_review"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Order Comment Recieved"}
            action_name={"order_comment"}
          />
          <NotificationActionCheck
            actions={actions}
            setActions={setActions}
            label={"Market Bid Received"}
            action_name={"market_item_bid"}
          />
          {/*<NotificationActionCheck actions={actions} setActions={setActions} label={"Market Offer Received"}*/}
          {/*                         action_name={"market_item_offer"}/>*/}
        </Grid>
      </Grid>

      <Grid item container justifyContent={"center"}>
        <Button
          variant={"outlined"}
          color={"primary"}
          onClick={submitCreateForm}
        >
          Submit
        </Button>
      </Grid>
    </Section>
  )
}
