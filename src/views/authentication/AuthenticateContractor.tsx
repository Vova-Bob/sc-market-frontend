import { Section } from "../../components/paper/Section"
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useState } from "react"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { useGetAuthenticatorIdentifier } from "../../store/profile"
import { useNavigate } from "react-router-dom"
import { useContractorLinkMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"

export function AuthenticateContractor(props: {}) {
  const identifier = useGetAuthenticatorIdentifier()
  const [orgName, setOrgName] = useState("")
  const [error, setError] = useState(false)

  const [
    activateContractorLink, // This is the mutation trigger
    // {isLoading}, // This is the destructured mutation result
  ] = useContractorLinkMutation()

  const navigate = useNavigate()

  const issueAlert = useAlertHook()

  const submit = useCallback(
    async (event: any) => {
      if (!orgName) {
        setError(true)
        return
      }
      // event.preventDefault();
      const res: { data?: any; error?: any } = await activateContractorLink({
        contractor: orgName,
      })

      if (res?.data && !res?.error) {
        navigate("/")
        window.location.reload()
      } else {
        issueAlert({
          message: `Failed to authenticate! ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }
      return false
    },
    [activateContractorLink, history, orgName, issueAlert],
  )

  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <TextField
          label={"Org Spectrum ID"}
          fullWidth
          value={orgName}
          onChange={(event) => setOrgName(event.target.value.toUpperCase())}
          error={error ? !orgName : false}
          helperText={
            error && !orgName ? "Please set your org name" : undefined
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography display={"inline"}>
          In order to verify you own the above organization, please click the
          button below to open your org page and add the following code to your
          org introduction, history, manifesto, or charter sections. You can
          remove this code once verification is complete.
          <Button
            style={{ display: "inline" }}
            color={"secondary"}
            size={"small"}
            onClick={() =>
              navigator.clipboard.writeText(
                identifier.data?.identifier || "PLACEHOLDER",
              )
            }
          >
            {identifier.data?.identifier || "PLACEHOLDER"}
          </Button>
          Click submit once the code is visible on the org page.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Button
            variant={"outlined"}
            color={"secondary"}
            endIcon={<OpenInNewIcon />}
            onClick={async () => {
              await navigator.clipboard.writeText(
                identifier.data?.identifier || "PLACEHOLDER",
              )
              window.open(
                `https://robertsspaceindustries.com/orgs/${orgName}/admin/content`,
                "_blank",
              )
            }}
          >
            Copy Code and Open Org Page
          </Button>
          <Button variant={"outlined"} onClick={submit}>
            Submit
          </Button>
        </Box>
      </Grid>
    </Section>
  )
}
