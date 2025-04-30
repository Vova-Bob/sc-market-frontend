import { Grid, Typography, TypographyProps } from "@mui/material"
import React from "react"

export function HeaderTitle(
  props: {
    lg?: number
    xl?: number
    xs?: number
    md?: number
    center?: boolean
  } & TypographyProps,
) {
  const { xs, lg, xl, md, center, ...rest } = props
  return (
    <Grid
      item
      xs={props.xs || 12}
      lg={props.lg}
      xl={props.xl}
      md={props.md}
      justifyContent={props.center ? "center" : "left"}
    >
      <Typography
        variant={"h4"}
        sx={{ fontWeight: "bold" }}
        color={"text.secondary"}
        {...rest}
      />
    </Grid>
  )
}
