import React from "react"

export const SidebarContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | null
>(null)

export const useSidebar = () => {
  const val = React.useContext(SidebarContext)
  if (val == null) {
    throw new Error("Cannot use useSidebar outside of SidebarContext")
  }
  return val
}
