import { Section } from "../../components/paper/Section"
import React, { useCallback, useEffect, useState } from "react"
import { MinimalUser } from "../../datatypes/User"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import throttle from "lodash/throttle"
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { contractorsApi } from "../../store/contractor"
import { store } from "../../store/store"
import { PersonRemoveRounded, PersonRounded } from "@mui/icons-material"
import {
  useAssignOrderMutation,
  useUnassignOrderMutation,
} from "../../store/orders"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { Order } from "../../datatypes/Order"

export function MemberAssignArea(props: { order: Order }) {
  const [target, setTarget] = useState("")
  const [targetObject, setTargetObject] = useState<{
    username: string
    display_name: string
  } | null>(null)
  const [currentOrg] = useCurrentOrg()
  const { order } = props
  const [options, setOptions] = useState<MinimalUser[]>([])

  const issueAlert = useAlertHook()

  const fetchOptions = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        return
      }

      const { status, data, error } = await store.dispatch(
        contractorsApi.endpoints.searchContractorMembers.initiate({
          spectrum_id: currentOrg?.spectrum_id!,
          query: query,
        }),
      )

      setOptions(data || [])
    },
    [currentOrg?.spectrum_id],
  )

  const retrieve = React.useMemo(
    () =>
      throttle((query: string) => {
        fetchOptions(query)
      }, 400),
    [fetchOptions],
  )

  useEffect(() => {
    retrieve(target)
  }, [target, retrieve])

  const [assignUser] = useAssignOrderMutation()

  const [unassignUser] = useUnassignOrderMutation()

  const updateAssignment = useCallback(async () => {
    if (!targetObject) {
      return
    }

    const res: { data?: any; error?: any } = await assignUser({
      order_id: order.order_id,
      user_id: targetObject.username!,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Assigned!",
        severity: "success",
      })
    } else {
      issueAlert({
        message: `Failed to assign! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
  }, [assignUser, order.order_id, issueAlert, targetObject])

  const removeAssignment = useCallback(async () => {
    const res: { data?: any; error?: any } = await unassignUser({
      order_id: order.order_id,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Unassigned!",
        severity: "success",
      })
    } else {
      issueAlert({
        message: `Failed to unassign! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }
  }, [unassignUser, order.order_id, issueAlert])

  return (
    <Section
      xs={12}
      md={6}
      lg={4}
      title={order.assigned_to ? "Reassign" : "Assign"}
    >
      <Grid item xs={12}>
        <Autocomplete
          filterOptions={(x) => x}
          fullWidth
          options={
            target
              ? options
              : (
                  currentOrg?.members.map((u) => ({
                    ...u,
                    display_name: u.username,
                  })) || []
                ).slice(0, 8)
          }
          getOptionLabel={(option) =>
            `${option.username} (${option.display_name})`
          }
          disablePortal
          color={targetObject ? "success" : "primary"}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Handle"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            />
          )}
          value={targetObject}
          onChange={(
            event: any,
            newValue: { display_name: string; username: string } | null,
          ) => {
            setTargetObject(newValue)
          }}
          inputValue={target}
          onInputChange={(event, newInputValue) => {
            setTarget(newInputValue)
          }}
        />
      </Grid>
      <Grid item>
        <Box
          display={"flex"}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
          sx={{ width: "100%" }}
        >
          <Button
            variant={"contained"}
            color={"error"}
            onClick={removeAssignment}
            startIcon={<PersonRemoveRounded />}
          >
            Unassign
          </Button>
        </Box>
      </Grid>
      <Grid item>
        <Box
          display={"flex"}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
          sx={{ width: "100%" }}
        >
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={updateAssignment}
            startIcon={<PersonRounded />}
          >
            Assign
          </Button>
        </Box>
      </Grid>
    </Section>
  )
}
