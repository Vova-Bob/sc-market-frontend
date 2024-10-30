import { Section } from "../../components/paper/Section"
import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import Checkbox from "@mui/material/Checkbox"
import { Google } from "@mui/icons-material"
import { Discord } from "../../components/icon/DiscordIcon"

export function Authenticate(props: {}) {
  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <Typography
          variant={"h6"}
          align={"left"}
          color={"text.secondary"}
          sx={{ fontWeight: "bold" }}
        >
          Sign Up
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <TextField label={"Email"} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label={"Username"} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label={"Password"} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label={"Repeat Password"} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12} alignItems={"center"} container>
        <Typography display={"inline"}>Login with</Typography>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <IconButton color={"primary"}>
            <Google />
          </IconButton>
          <IconButton color={"primary"}>
            <Discord />
          </IconButton>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={8}>
        <Typography>
          <Checkbox /> By clicking here you agree to our terms of service
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Button variant={"outlined"}>Submit</Button>
      </Grid>
    </Section>
  )
}
