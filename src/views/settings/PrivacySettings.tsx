import { FlatSection } from "../../components/paper/Section"
import React, { useCallback } from "react"
import {
  useGetUserProfileQuery,
  useProfileUpdateSettingsMutation,
} from "../../store/profile"
import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material"
import { AccountSettingsBody } from "../../hooks/login/UserProfile"
import { BACKEND_URL } from "../../util/constants"

export function PrivacySettings() {
  const { data: profile, refetch } = useGetUserProfileQuery()
  const [updateProfile] = useProfileUpdateSettingsMutation()

  const handleUpdate = useCallback(
    (body: AccountSettingsBody) => {
      updateProfile(body)
      refetch()
    },
    [updateProfile, refetch],
  )

  return (
    <FlatSection title={"Privacy"}>
      <Grid item>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={profile?.settings?.discord_public}
              onChange={(event) =>
                handleUpdate({ discord_public: event.target.checked })
              }
            />
          }
          label="Publicly Display Discord Profile"
          labelPlacement="start"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={profile?.settings?.discord_order_share}
              onChange={(event) =>
                handleUpdate({ discord_order_share: event.target.checked })
              }
            />
          }
          label="Share Discord Profile with Sellers"
          labelPlacement="start"
        />
      </Grid>
      <Grid item>
        <Typography variant={"subtitle1"} color={"text.secondary"}>
          Request my Data
        </Typography>
        <Typography variant={"body2"}>
          Request your data associated with the site. This function is a work in
          progress and does not represent all of your data. We are working to
          make this as complete as possible, but for now this contains most of
          the information associated with your user account.
        </Typography>
      </Grid>
      <Grid item>
        <Button href={`${BACKEND_URL}/api/profile/my_data`} target={"_blank"}>
          Request Data
        </Button>
      </Grid>
    </FlatSection>
  )
}
