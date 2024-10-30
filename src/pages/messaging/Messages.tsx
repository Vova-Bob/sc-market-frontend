import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import { sidebarDrawerWidth, useDrawerOpen } from "../../hooks/layout/Drawer"
import { MessagesBody } from "../../views/messaging/MessagesBody"
import { MessagingSidebar } from "../../views/messaging/MessagingSidebar"
import { useCurrentChatID } from "../../hooks/messaging/CurrentChatID"
import { Message } from "../../datatypes/Chat"
import { MessageGroupCreateContext } from "../../hooks/messaging/MessageGroupCreate"
import { MessagingSidebarContext } from "../../hooks/messaging/MessagingSidebar"
import { CreateMessageGroupBody } from "../../views/messaging/CreateMessageGroup"
import { useCurrentChat } from "../../hooks/messaging/CurrentChat"
import { useGetChatByIDQuery } from "../../store/chats"

export function Messages() {
  const [drawerOpen] = useDrawerOpen()
  const [messageSidebarOpen, setMessageSidebar] = useState(true)
  const [creatingMessageGroup, setCreatingMessageGroup] = useState(true)

  const [currentChatID] = useCurrentChatID()
  const [currentChat, setCurrentChat] = useCurrentChat()

  const { data: chatObj } = useGetChatByIDQuery(currentChatID!, {
    skip: !currentChatID,
  })

  useEffect(() => {
    if (chatObj) {
      const newObj = { ...chatObj }
      newObj.messages = [...newObj.messages].sort(
        (a: Message, b: Message) => a.timestamp - b.timestamp,
      )
      setCurrentChat(chatObj)
    }

    return () => {
      setCurrentChat(null)
    }
  }, [chatObj, setCurrentChat])

  return (
    <React.Fragment>
      <MessagingSidebarContext.Provider
        value={[messageSidebarOpen, setMessageSidebar]}
      >
        <MessageGroupCreateContext.Provider
          value={[creatingMessageGroup, setCreatingMessageGroup]}
        >
          <MessagingSidebar />
          <main
            style={{
              flexGrow: 1,
              overflow: "auto",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                // ...theme.mixins.toolbar,
                position: "relative",
                width: drawerOpen ? sidebarDrawerWidth : 0,
                height: 64,
                minHeight: 64,
              }}
            />
            {creatingMessageGroup ? (
              <CreateMessageGroupBody />
            ) : (
              currentChat && <MessagesBody />
            )}
          </main>
        </MessageGroupCreateContext.Provider>
      </MessagingSidebarContext.Provider>
    </React.Fragment>
  )
}
