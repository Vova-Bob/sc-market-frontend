import { Avatar, Link as MaterialLink, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { Link } from "react-router-dom"
import { UnderlineLink } from "../typography/UnderlineLink"
import React from "react"
import { MinimalUser } from "../../datatypes/User"

export function UserAvatar(props: { user: MinimalUser }) {
  const { user } = props
  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent={"right"}
      alignItems={"center"}
    >
      <Avatar src={user.avatar} />
      <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <MaterialLink
          component={Link}
          to={`/user/${user.username}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <UnderlineLink
            color={"text.secondary"}
            variant={"subtitle1"}
            fontWeight={"bold"}
          >
            {user.username}
          </UnderlineLink>
        </MaterialLink>
        <Typography variant={"subtitle2"}>{user.display_name}</Typography>
      </Stack>
    </Stack>
  )
}
