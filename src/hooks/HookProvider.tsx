import React, { useEffect, useMemo, useState } from "react"
import {
  Alert,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material"
import { DrawerOpenContext } from "./layout/Drawer"
import { CurrentChatIDContext } from "./messaging/CurrentChatID"
import { lightTheme, mainTheme } from "./styles/Theme"
import { Chat, Message } from "../datatypes/Chat"
import { CurrentOrgProvider } from "./login/CurrentOrg"
import { CurrentChatMessagesContext } from "./messaging/CurrentChatMessages"
import { CurrentChatContext } from "./messaging/CurrentChat"
import { Provider } from "react-redux"
import { store } from "../store/store"
import { AlertInterface } from "../datatypes/Alert"
import { AlertHookContext } from "./alert/AlertHook"
import { ServiceSearchContext } from "./contract/ServiceSearch"
import { LightThemeContext, ThemeChoice } from "./styles/LightTheme"
import { useCookies } from "react-cookie"
import { CURRENT_CUSTOM_ORG } from "./contractor/CustomDomain"
import { CUSTOM_THEMES } from "./styles/custom_themes"
import { useLocation } from "react-router-dom"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"

// Add moment and locale import + i18n
import moment from "moment"
import i18n from "../util/i18n"

export function HookProvider(props: { children: React.ReactElement }) {
  const drawerWidthState = useState(false)
  const [alert, issueAlert] = useState<AlertInterface | null>(null)

  const [cookies, setCookie] = useCookies(["theme"])
  const prefersLight = useMediaQuery("(prefers-color-scheme: light)")
  const [useLightTheme, setUseLightTheme] = useState<ThemeChoice>(
    cookies.theme || (prefersLight ? "light" : "dark"),
  )
  const location = useLocation()

  const themeChoice = useMemo(() => {
    if (CURRENT_CUSTOM_ORG) {
      const theme = CUSTOM_THEMES.get(CURRENT_CUSTOM_ORG)
      if (theme) {
        return theme
      }
    }

    // if (["/", "", null].includes(location.pathname)) {
    //   return mainTheme
    // }

    return useLightTheme === "light" ? lightTheme : mainTheme
  }, [useLightTheme, location.pathname])

  useEffect(() => {
    setCookie("theme", useLightTheme, { path: "/", sameSite: "strict" })
  }, [useLightTheme, setCookie])

  // Add useEffect to support the moment.js language
  useEffect(() => {
    // Set moment.js locale according to current i18n language
    moment.locale(i18n.language)
    const handler = () => {
      moment.locale(i18n.language)
    }
    i18n.on("languageChanged", handler)
    return () => i18n.off("languageChanged", handler)
  }, [])

  return (
    <Provider store={store}>
      <LightThemeContext.Provider value={[useLightTheme, setUseLightTheme]}>
        <ThemeProvider theme={themeChoice}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <AlertHookContext.Provider value={[alert, issueAlert]}>
              <CurrentOrgProvider>
                <DrawerOpenContext.Provider value={drawerWidthState}>
                  <ServiceSearchContext.Provider
                    value={useState({ query: "" })}
                  >
                    <CurrentChatIDContext.Provider
                      value={useState<string | null | undefined>(undefined)}
                    >
                      <CurrentChatContext.Provider
                        value={useState<Chat | null | undefined>(undefined)}
                      >
                        <CurrentChatMessagesContext.Provider
                          value={useState<Message[]>([])}
                        >
                          <CssBaseline key="css-baseline" />
                          {props.children}
                          <Snackbar
                            open={!!alert}
                            autoHideDuration={6000}
                            onClose={() => issueAlert(null)}
                          >
                            <Alert
                              onClose={() => issueAlert(null)}
                              severity={alert?.severity}
                              sx={{ width: "100%" }}
                              variant={"filled"}
                            >
                              {alert?.message}
                            </Alert>
                          </Snackbar>
                        </CurrentChatMessagesContext.Provider>
                      </CurrentChatContext.Provider>
                    </CurrentChatIDContext.Provider>
                  </ServiceSearchContext.Provider>
                </DrawerOpenContext.Provider>
              </CurrentOrgProvider>
            </AlertHookContext.Provider>
          </LocalizationProvider>
        </ThemeProvider>
      </LightThemeContext.Provider>
    </Provider>
  )
}
