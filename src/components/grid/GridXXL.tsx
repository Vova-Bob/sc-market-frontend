import { Grid, GridProps } from "@mui/material"
import React from "react"

export const GridXXL = (props: { xxl: number | boolean } & GridProps) => {
  const xxlClass = `MuiGrid-grid-xxl-${props.xxl}`
  return <Grid className={xxlClass} {...props} />
}
