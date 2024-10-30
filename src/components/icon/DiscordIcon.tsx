import { SvgIcon } from "@mui/material"
import DiscordSVG from "../../assets/discord.svg?react"
import { SxProps } from "@mui/system"
import React from "react"

export function Discord(props: { sx?: SxProps }) {
  return <SvgIcon component={DiscordSVG} sx={props.sx} />
}
