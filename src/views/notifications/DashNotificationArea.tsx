import { Section } from "../../components/paper/Section"
import { Grid, List } from "@mui/material"
import React from "react"
import { NotificationEntry } from "../../components/navbar/NotificationsButton"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import { useGetNotificationsQuery } from "../../store/notification"

export function DashNotificationArea() {
  const theme = useTheme<ExtendedTheme>()
  const { data: notifications } = useGetNotificationsQuery()

  return (
    <Section title={"Notifications"} disablePadding xs={12}>
      {/*<Box sx={{width: '100%', padding: 2}}>*/}
      <Grid item xs={12}>
        <List
          sx={{
            "&>:first-child": {
              borderTop: `1px solid ${theme.palette.outline.main}`,
            },
            "&>:last-child": {
              borderBottom: "none",
            },
            "& > *": {
              borderBottom: `1px solid ${theme.palette.outline.main}`,
            },
            padding: 0,
            maxHeight: 400,
            overflowY: "scroll",
            width: "100%",
          }}
        >
          {(notifications || []).map(
            (notification, idx) => (
              // <Fade in={true} style={{transitionDelay: `${50 + 50 * idx}ms`, transitionDuration: '500ms'}} key={idx}>
              <NotificationEntry notif={notification} key={idx} />
            ),
            // </Fade>
          )}
        </List>
      </Grid>

      {/*</Box>*/}
    </Section>
  )
}
