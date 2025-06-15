import { Section } from "../../components/paper/Section"
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import {
  useActivateAccountLink,
  useGetAuthenticatorIdentifier,
  useGetUserProfileQuery,
} from "../../store/profile"
import { useNavigate } from "react-router-dom"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { UnderlineLink } from "../../components/typography/UnderlineLink"

export function isAlphaNumeric(str: string) {
  let code, i, len

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i)
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) &&
      code !== 95 &&
      code !== 45
    ) {
      // lower alpha (a-z)
      return false
    }
  }
  return true
}

export function isAlpha(str: string) {
  let code, i, len

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i)
    if (
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) &&
      code !== 95 &&
      code !== 45
    ) {
      // lower alpha (a-z)
      return false
    }
  }
  return true
}

export function AuthenticateRSI() {
  const { refetch: refetchProfile } = useGetUserProfileQuery()
  const identifier = useGetAuthenticatorIdentifier()
  const [username, setUsername] = useState("")
  const [error, setError] = useState(false)

  const [
    activateAccountLink, // This is the mutation trigger
    // {isLoading}, // This is the destructured mutation result
  ] = useActivateAccountLink()

  const navigate = useNavigate()

  const issueAlert = useAlertHook()
  const [tosAccepted, setTosAccepted] = useState(false)

  const submit = useCallback(
    async (event: any) => {
      if (!username || !tosAccepted) {
        setError(true)
        return
      }
      // event.preventDefault();
      activateAccountLink({
        username: username,
      })
        .unwrap()
        .then((result) => {
          issueAlert({
            message: `Authenticated!`,
            severity: "success",
          })
          setUsername("")
          navigate("/")
        })
        .catch((error) => {
          issueAlert(error)
        })

      return false
    },
    [activateAccountLink, navigate, issueAlert, username, tosAccepted],
  )

  const [isError, errorMessage] = useMemo(() => {
    if (!isAlphaNumeric(username) || username.length < 3) {
      return [true, "Invalid handle"]
    }

    if (!username) {
      return [error, "Please enter your username"]
    }

    return [false, ""]
  }, [username, error])

  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <TextField
          label={"RSI Handle"}
          fullWidth
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value.replace(
                "https://robertsspaceindustries.com/citizens/",
                "",
              ),
            )
          }
          error={isError}
          helperText={errorMessage}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography display={"inline"}>
          In order to verify you own the above RSI profile, please click the
          button below to open your profile page and add the following code to
          your user profile short bio, and enter your RSI handle (not monniker)
          above. You can remove this code once verification is complete. See
          &nbsp;
          <a
            href={
              "https://github.com/henry232323/sc-market/wiki/How-to-Verify-Your-Account"
            }
          >
            <UnderlineLink component={"a"} color={"primary"}>
              here
            </UnderlineLink>
          </a>{" "}
          for a screenshot guide.
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
          Click submit once the code is visible on your profile.
        </Typography>
      </Grid>
      <Grid item xs={12} display={"flex"} alignItems={"center"}>
        <Typography variant={"body2"}>
          I have read and accepted SC Market&apos;s{" "}
          <a href={"/terms-of-service.html"} target={"_blank"} rel="noreferrer">
            <UnderlineLink color={"primary"}>Terms of Service</UnderlineLink>
          </a>
        </Typography>
        <Checkbox
          value={tosAccepted}
          onChange={(event, checked) => setTosAccepted(checked)}
          color={error && !tosAccepted ? "error" : undefined}
        />
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
                "https://robertsspaceindustries.com/account/profile",
                "_blank",
              )
            }}
          >
            Copy Code and Open Profile
          </Button>
          <Button
            variant={"outlined"}
            onClick={submit}
            disabled={isError || !username.length || !tosAccepted}
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </Section>
  )
}
