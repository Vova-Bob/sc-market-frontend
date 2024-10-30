import React from "react"
import { User } from "../../datatypes/User"
import { Chat } from "../../datatypes/Chat"

export const CurrentChatContext = React.createContext<
  | [
      Chat | null | undefined,
      React.Dispatch<React.SetStateAction<Chat | null | undefined>>,
    ]
  | null
>(null)

export const useCurrentChat = () => {
  let val = React.useContext(CurrentChatContext)
  if (val == null) {
    throw new Error("Cannot use useCurrentChat outside of CurrentChatContext")
  }
  return val
}
