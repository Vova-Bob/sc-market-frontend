import {
  Breadcrumbs,
  Grid,
  Link as MaterialLink,
  Typography,
  TypographyProps,
} from "@mui/material"
import React from "react"
import { Link } from "react-router-dom"

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
      lg={props.lg || 12}
      xl={props.xl || 12}
      md={props.md || 12}
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
