import { Section } from "../../components/paper/Section"
import React from "react"
import { Button, Grid, TextField, Typography } from "@mui/material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"

export function ContractApp(props: {}) {
  const [currentOrg] = useCurrentOrg()
  const profile = useGetUserProfileQuery()

  const orgName = currentOrg?.name

  return (
    <Section xs={12} lg={4} title={"Apply"}>
      <Grid item xs={12}>
        <Typography variant={"subtitle1"}>
          Applying as{" "}
          <Typography color={"secondary"} display={"inline"}>
            {orgName || profile.data?.username}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="order-type"
          multiline
          maxRows={5}
          minRows={5}
          color={"primary"}
          label={"Note"}
        ></TextField>
      </Grid>
      <Grid item xs={12} container justifyContent={"center"}>
        <Button color={"primary"} variant={"outlined"}>
          Submit
        </Button>
      </Grid>
    </Section>
  )
}
