import React, { useEffect, useMemo, useState } from "react"
import {
  Avatar,
  Box,
  createTheme,
  MenuItem,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { useCookies } from "react-cookie"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { useTheme } from "@mui/material/styles"
import { Stack } from "@mui/system"

const localTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

export function SidebarActorSelect() {
  const { data: profile } = useGetUserProfileQuery()

  const [cookies, setCookie, deleteCookie] = useCookies(["current_contractor"])
  const [contractorSpectrumID, setContractorSpectrumID] = useState(
    cookies.current_contractor || "_",
  )

  const contractor = useGetContractorBySpectrumIDQuery(contractorSpectrumID!, {
    skip: !contractorSpectrumID || contractorSpectrumID === "_",
  }) // Contractor is whatever the current selection is

  const [, setCurrentOrg] = useCurrentOrg()

  useEffect(() => {
    if (profile) {
      if (
        contractorSpectrumID &&
        contractorSpectrumID !== "_" &&
        contractor.data
      ) {
        setCurrentOrg(contractor.data)
        setCookie("current_contractor", contractorSpectrumID, {
          path: "/",
          sameSite: "strict",
        })
      } else {
        setCurrentOrg(null)
        deleteCookie("current_contractor")
      }
    }

    if (contractor.error) {
      deleteCookie("current_contractor")
    }
  }, [
    contractor,
    deleteCookie,
    profile,
    setCurrentOrg,
    setCookie,
    contractorSpectrumID,
  ]) // only when contractor changes

  const theme = useTheme()

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.background.sidebar,
        boxShadow: "none",
      }}
    >
      <ThemeProvider theme={localTheme}>
        <TextField
          select
          fullWidth
          value={contractorSpectrumID}
          onChange={(event: React.ChangeEvent<{ value: string }>) => {
            setContractorSpectrumID(event.target.value)
          }}
          SelectProps={{
            IconComponent: KeyboardArrowDownRoundedIcon,
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.background.sidebar,
                },
                variant: "outlined",
                padding: 2,
              },
            },
          }}
          sx={{ borderRadius: 32 }}
        >
          {profile ? (
            [
              <MenuItem value={"_"} key={"user"}>
                <Stack
                  direction={"row"}
                  spacing={1}
                  alignItems={"center"}
                  justifyContent={"left"}
                >
                  <Avatar
                    variant={"rounded"}
                    src={profile?.avatar}
                    alt={`Avatar of ${profile.username}`}
                    sx={{ height: 48, width: 48 }}
                  />
                  <Box>{profile.display_name}</Box>
                </Stack>
              </MenuItem>,
              ...profile.contractors.map((choice, idx) => (
                <MenuItem value={choice.spectrum_id} key={choice.spectrum_id}>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"left"}
                    maxWidth={"100%"}
                    sx={{ whiteSpace: "normal" }}
                  >
                    <Avatar
                      variant={"rounded"}
                      src={choice?.avatar}
                      alt={`Avatar of ${choice.avatar}`}
                      sx={{ height: 48, width: 48 }}
                    />
                    <Typography style={{ whiteSpace: "normal" }}>
                      {choice.name}
                    </Typography>
                  </Stack>
                </MenuItem>
              )),
            ]
          ) : (
            <MenuItem value={contractorSpectrumID}>
              Login to Select Role
            </MenuItem>
          )}
        </TextField>
      </ThemeProvider>
    </Paper>
  )
}
