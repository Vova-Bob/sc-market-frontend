import React from "react"

export const MainRefContext =
  React.createContext<React.RefObject<HTMLDivElement | null> | null>(null)

export const useMainRef = () => {
  let val = React.useContext(MainRefContext)
  if (val == null) {
    throw new Error("Cannot use useMainRef outside of DrawerWidthContext")
  }
  return val
}
