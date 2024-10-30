import { Grid, TextField } from "@mui/material"
import React, { useCallback, useState } from "react"
import { useAdminExpressVerifyContractorMutation } from "../../store/contractor"
import { FlatSection } from "../../components/paper/Section"
import LoadingButton from "@mui/lab/LoadingButton"
import { useAlertHook } from "../../hooks/alert/AlertHook"

export function AdminExpressVerify() {
  const [state, setState] = useState({
    owner_discord_id: "",
    owner_username: "",
    spectrum_id: "",
  })
  const [expressVerify, { isLoading }] =
    useAdminExpressVerifyContractorMutation()
  const issueAlert = useAlertHook()

  const callback = useCallback(async () => {
    const res: { data?: any; error?: any } = await expressVerify(state)

    if (res?.data && !res?.error) {
      setState({ owner_discord_id: "", owner_username: "", spectrum_id: "" })

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
  }, [state])

  return (
    <FlatSection title={"Express Verify User"}>
      <Grid item>
        <TextField
          label={"Owner Discord ID"}
          value={state.owner_discord_id}
          onChange={(event) =>
            setState({ ...state, owner_discord_id: event.target.value })
          }
        />
      </Grid>
      <Grid item>
        <TextField
          label={"Owner Username*"}
          value={state.owner_username}
          onChange={(event) =>
            setState({ ...state, owner_username: event.target.value })
          }
        />
      </Grid>
      <Grid item>
        <TextField
          label={"Org Spectrum ID*"}
          value={state.spectrum_id}
          onChange={(event) =>
            setState({ ...state, spectrum_id: event.target.value })
          }
        />
      </Grid>
      <Grid item>
        <LoadingButton loading={isLoading} onClick={callback}>
          Submit
        </LoadingButton>
      </Grid>
    </FlatSection>
  )
}
