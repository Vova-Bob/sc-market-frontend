import React from "react"
import { Message } from "../../datatypes/Chat"

export const CurrentChatMessagesContext = React.createContext<
  [Message[], React.Dispatch<React.SetStateAction<Message[]>>] | null
>(null)

export const useCurrentChatMessages = () => {
  const val = React.useContext(CurrentChatMessagesContext)
  if (val == null) {
    throw new Error(
      "Cannot use useCurrentChatMessages outside of CurrentChatMessagesContext",
    )
  }
  return val
}
