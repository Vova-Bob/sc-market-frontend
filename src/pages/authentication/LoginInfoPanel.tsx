import React from "react"
import Screencap from "../../assets/screencap.png"
import Screencap2 from "../../assets/screencap2.png"
import { Grid } from "@mui/material"
import { useTranslation } from "react-i18next"

export function LoginInfoPanel() {
  const { t } = useTranslation()
  return (
    <>
      <Grid item xs={12}>
        {/*This is the login info panel.*/}

        <img
          src={Screencap}
          style={{ width: "100%", height: "auto", borderRadius: 3 }}
          alt={t("loginInfoPanel.dashboardScreenshot")}
          loading="lazy"
        />
      </Grid>
      <Grid item xs={12}>
        {/*This is the login info panel.*/}

        <img
          src={Screencap2}
          style={{ width: "100%", height: "auto", borderRadius: 3 }}
          alt={t("loginInfoPanel.dashboardScreenshot")}
          loading="lazy"
        />
      </Grid>
    </>
  )
}
