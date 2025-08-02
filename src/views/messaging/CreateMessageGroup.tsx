import { Autocomplete, Box, Button, IconButton, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { User } from "../../datatypes/User"
import {
  useGetUserProfileQuery,
  useSearchUsersQuery,
} from "../../store/profile"
import { useMessagingSidebar } from "../../hooks/messaging/MessagingSidebar"
import MenuIcon from "@mui/icons-material/MenuRounded"
import { ChevronLeftRounded, CloseRounded } from "@mui/icons-material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useMessageGroupCreate } from "../../hooks/messaging/MessageGroupCreate"
import throttle from "lodash/throttle"
import { useCreateChatMutation } from "../../store/chats"
import { useTranslation } from "react-i18next"

function MessageHeader() {
  const [messageSidebarOpen, setMessageSidebar] = useMessagingSidebar()

  const theme = useTheme<ExtendedTheme>()
  const [, setGroupCreate] = useMessageGroupCreate()

  const [target, setTarget] = useState("")
  const [targetObject, setTargetObject] = useState<User[]>([])
  const { t } = useTranslation()

  const { data: options, refetch } = useSearchUsersQuery(target, {
    skip: target.length < 3,
  })

  const retrieve = React.useCallback(
    () => throttle(refetch, 400, { trailing: true }),
    [refetch],
  )

  useEffect(() => {
    retrieve()
  }, [retrieve])

  const [
    _createChat, // This is the mutation trigger
    { isSuccess }, // This is the destructured mutation result
  ] = useCreateChatMutation()

  useEffect(() => {
    if (isSuccess) {
      setGroupCreate(false)
    }
  }, [isSuccess, setGroupCreate])

  const createChat = async () => {
    if (targetObject.length === 0) {
      return
    }

    await _createChat({ users: targetObject.map((u) => u.username) })
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        paddingTop: 2,
        paddingLeft: 3,
        boxSizing: "border-box",
        borderWidth: 0,
        borderBottom: `solid 1px ${theme.palette.outline.main}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "hide",
          width: "100%",
          maxWidth: "100%",
        }}
        alignItems={"center"}
      >
        <IconButton
          color="secondary"
          aria-label={t("CreateMessageGroupBody.toggleSidebar")}
          onClick={() => {
            setMessageSidebar((v) => !v)
          }}
          sx={{ marginRight: 3 }}
        >
          {!messageSidebarOpen ? <MenuIcon /> : <ChevronLeftRounded />}
        </IconButton>

        <Autocomplete
          autoComplete
          multiple
          filterOptions={(x) => x}
          fullWidth
          options={options || []}
          disableCloseOnSelect
          autoHighlight
          filterSelectedOptions
          getOptionLabel={(option) => option.display_name}
          disablePortal
          includeInputInList
          color={targetObject ? "success" : "primary"}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("CreateMessageGroupBody.usernames")}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            />
          )}
          value={targetObject}
          onChange={(event: any, newValue) => {
            setTargetObject(newValue)
          }}
          inputValue={target}
          onInputChange={(event, newInputValue) => {
            setTarget(newInputValue)
          }}
          sx={{ flexGrow: 1, marginRight: 3 }}
        />

        <Button
          variant={"contained"}
          color={"primary"}
          onClick={createChat}
          sx={{ marginRight: 3 }}
          disabled={targetObject.length === 0}
        >
          {t("CreateMessageGroupBody.create")}
        </Button>

        <IconButton
          color="secondary"
          aria-label={t("CreateMessageGroupBody.close")}
          onClick={() => {
            setGroupCreate((v) => !v)
          }}
        >
          <CloseRounded />
        </IconButton>
      </Box>
    </Box>
  )
}

function CreateChatBody() {
  const profile = useGetUserProfileQuery()
  const theme = useTheme<ExtendedTheme>()

  const [users, setUsers] = useState<User[]>([])

  return (
    <React.Fragment>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          padding: 4,
          borderColor: theme.palette.outline.main,
          boxSizing: "border-box",
          borderWidth: 0,
          borderStyle: "solid",
          overflow: "scroll",
        }}
      />
    </React.Fragment>
  )
}

export function CreateMessageGroupBody() {
  return (
    <React.Fragment>
      <MessageHeader />
      <CreateChatBody />
    </React.Fragment>
  )
}
