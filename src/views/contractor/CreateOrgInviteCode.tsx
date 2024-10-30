import { Button, Divider, Grid, TextField, Typography } from "@mui/material"
import { Section } from "../../components/paper/Section"
import React, { useCallback, useState } from "react"
import { useCreateContractorInviteMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function CreateOrgInviteCode() {
  const [currentOrg] = useCurrentOrg()
  const [maxUses, setMaxUses] = useState(0)

  const [
    createContractorInvite, // This is the mutation trigger
  ] = useCreateContractorInviteMutation()

  const issueAlert = useAlertHook()

  const submitCreateForm = useCallback(
    async (event: any) => {
      // event.preventDefault();
      let res: { data?: any; error?: any }
      res = await createContractorInvite({
        contractor: currentOrg!.spectrum_id,
        body: {
          max_uses: maxUses,
        },
      })

      if (res?.data && !res?.error) {
        setMaxUses(0)

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
    },
    [createContractorInvite, currentOrg, maxUses, issueAlert],
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
          Create New Invite Code
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="max-uses"
          color={"secondary"}
          label={"Max Invite Uses"}
          helperText={
            "The maximum number of uses of this invite. Set to 0 to make unlimited."
          }
          value={maxUses}
          onChange={(event: any) => {
            setMaxUses(+event.target.value || 0)
          }}
        />
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
