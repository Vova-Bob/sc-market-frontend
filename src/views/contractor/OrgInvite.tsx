import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { Section } from "../../components/paper/Section"
import React, { useCallback, useState } from "react"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import throttle from "lodash/throttle"
import { useSearchUsersQuery } from "../../store/profile"
import { MinimalUser } from "../../datatypes/User"
import { useInviteContractorMembersMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"

export function OrgInvite(props: {}) {
  const [currentOrg] = useCurrentOrg()
  const [query, setQuery] = useState("")
  const [buffer, setBuffer] = useState("")
  const [message, setMessage] = useState("")

  const { data: users } = useSearchUsersQuery(query, { skip: !query })

  const retrieve = React.useMemo(
    () =>
      throttle((query: string) => {
        if (query.length > 2) {
          setQuery(query)
        }
      }, 400),
    [setQuery],
  )

  const [choices, setChoices] = useState<MinimalUser[]>([])

  const [
    sendInvites, // This is the mutation trigger
  ] = useInviteContractorMembersMutation()

  const issueAlert = useAlertHook()

  const submitInviteForm = useCallback(
    async (event: any) => {
      // event.preventDefault();
      const res: { data?: any; error?: any } = await sendInvites({
        contractor: currentOrg?.spectrum_id!,
        users: choices.map((u) => u.username),
        message: message,
      })

      if (res?.data && !res?.error) {
        setChoices([])
        setBuffer("")

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
    [choices, currentOrg?.spectrum_id, message, sendInvites, issueAlert],
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
          Invite Members
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          fullWidth
          multiple
          filterSelectedOptions
          options={users || []}
          getOptionLabel={(u) =>
            currentOrg!.members.find((m) => m.username === u.username)
              ? `${u.username} (already member)`
              : u.username
          }
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              variant="outlined"
              label="Username"
              fullWidth
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            />
          )}
          renderTags={(
            value: readonly MinimalUser[] | undefined,
            getTagProps,
          ) =>
            (value || []).map((option, index) => (
              <Chip
                color={"secondary"}
                label={option.username}
                sx={{ marginRight: 1 }}
                variant={"outlined"}
                avatar={<Avatar alt={option.username} src={option.avatar} />}
                {...getTagProps({ index })}
                key={option.username}
              />
            ))
          }
          value={choices}
          onChange={(event: any, newValue) => {
            setChoices(newValue || [])
          }}
          inputValue={buffer}
          onInputChange={(event, newInputValue) => {
            setBuffer(newInputValue)
            retrieve(newInputValue)
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          id="order-type"
          multiline
          maxRows={5}
          minRows={5}
          color={"secondary"}
          label={"Note"}
          value={message}
          onChange={(event: any) => {
            setMessage(event.target.value)
          }}
        ></TextField>
      </Grid>

      <Grid item container justifyContent={"center"}>
        <Button
          variant={"outlined"}
          color={"primary"}
          onClick={submitInviteForm}
        >
          Submit
        </Button>
      </Grid>
    </Section>
  )
}
