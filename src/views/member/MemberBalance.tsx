import { Section } from "../../components/paper/Section"
import { Button, Divider, Grid, Typography } from "@mui/material"
import React from "react"
import { Link } from "react-router-dom"
import { useGetUserProfileQuery } from "../../store/profile"

export function MemberBalance() {
  const profile = useGetUserProfileQuery()

  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <Typography
          variant={"h6"}
          align={"left"}
          color={"text.secondary"}
          sx={{ fontWeight: "bold" }}
        >
          My Balance
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant={"h4"}
          align={"left"}
          color={"primary"}
          sx={{ fontWeight: "bold", transition: "0.3s" }}
        >
          {profile.data?.balance &&
            profile.data?.balance.toLocaleString("en-US")}{" "}
          aUEC
        </Typography>
      </Grid>
      <Grid item xs={12} container justifyContent={"space-between"}>
        <Link
          to={`/send`}
          style={{
            textDecoration: "none",
            color: "inherit",
            marginBottom: 2,
            marginRight: 2,
          }}
        >
          <Button color={"primary"} variant={"outlined"}>
            Send aUEC
          </Button>
        </Link>
        <Button color={"secondary"} variant={"outlined"}>
          Withdraw
        </Button>
      </Grid>
    </Section>
  )
}
