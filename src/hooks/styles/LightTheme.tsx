import React from "react"

export type ThemeChoice = "light" | "dark"

export const LightThemeContext = React.createContext<
  [ThemeChoice, React.Dispatch<React.SetStateAction<ThemeChoice>>] | null
>(null)

export const useLightTheme = () => {
  let val = React.useContext(LightThemeContext)
  if (val == null) {
    throw new Error("Cannot use useLightTheme outside of DrawerWidthContext")
  }
  return val
}
