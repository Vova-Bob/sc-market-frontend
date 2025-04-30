import { Link } from "react-router-dom"
import { Button, Grid } from "@mui/material"
import { CreateRounded } from "@mui/icons-material"
import React from "react"

export function ServiceActions() {
  return (
    <Grid item>
      <Link
        to={"/order/service/create"}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <Button
          color={"secondary"}
          startIcon={<CreateRounded />}
          variant={"contained"}
          size={"large"}
        >
          Create Service
        </Button>
      </Link>
    </Grid>
  )
}
