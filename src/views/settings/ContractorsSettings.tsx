import { Grid } from "@mui/material"
import React from "react"
import { SettingsManageContractors } from "../contractor/SettingsManageContractors"

export function ContractorsSettings() {
  return (
    <Grid container spacing={4}>
      <SettingsManageContractors />
    </Grid>
  )
}
