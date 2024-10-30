import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { useGetUserProfileQuery } from "../../store/profile"
import {
  LogoutRounded,
  PeopleRounded,
  SettingsRounded,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { BACKEND_URL } from "../../util/constants"

export function ProfileNavAvatar() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const notifOpen = Boolean(anchorEl)
  const theme = useTheme<ExtendedTheme>()
  const { data: profile } = useGetUserProfileQuery()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      {/*{redirect && <Navigate to={redirect}/>}*/}
      <IconButton onClick={handleClick}>
        <Avatar src={profile?.avatar} />
      </IconButton>
      <Popover
        open={notifOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          variant: "outlined",
          sx: {
            borderRadius: 3,
            borderColor: theme.palette.outline.main,
          },
        }}
      >
        <Box>
          <List
            sx={{
              "&>:last-child": {
                borderBottom: "none",
              },
              "& > *": {
                borderBottom: `1px solid ${theme.palette.outline.main}`,
              },
              padding: 0,
              maxHeight: 400,
              overflow: "scroll",
            }}
          >
            <Link
              to={`/user/${profile?.username}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    transition: "0.3s",
                    fontSize: "0.9em",
                    color: theme.palette.primary.main,
                  }}
                >
                  <PeopleRounded />
                </ListItemIcon>
                <ListItemText sx={{ maxWidth: 300 }}>
                  <Typography noWrap color={"text.secondary"}>
                    Profile
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </Link>
            <Link
              to={"/settings"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    transition: "0.3s",
                    fontSize: "0.9em",
                    color: theme.palette.primary.main,
                  }}
                >
                  <SettingsRounded />
                </ListItemIcon>
                <ListItemText sx={{ maxWidth: 300 }}>
                  <Typography noWrap color={"text.secondary"}>
                    Settings
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </Link>
            <a
              href={`${BACKEND_URL}/logout`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    transition: "0.3s",
                    fontSize: "0.9em",
                    color: theme.palette.primary.main,
                  }}
                >
                  <LogoutRounded />
                </ListItemIcon>
                <ListItemText sx={{ maxWidth: 300 }}>
                  <Typography noWrap color={"text.secondary"}>
                    Logout
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </a>
          </List>
        </Box>
      </Popover>
    </React.Fragment>
  )
}
