import React from "react"
import Screencap from "../../assets/screencap.png"
import Screencap2 from "../../assets/screencap2.png"
import { Grid } from "@mui/material"

export function LoginInfoPanel() {
  return (
    <>
      <Grid item xs={12}>
        {/*This is the login info panel.*/}

        <img
          src={Screencap}
          style={{ width: "100%", height: "auto", borderRadius: 3 }}
          alt={"Contractor Dashboard Screenshot"}
          loading="lazy"
        />
      </Grid>
      <Grid item xs={12}>
        {/*This is the login info panel.*/}

        <img
          src={Screencap2}
          style={{ width: "100%", height: "auto", borderRadius: 3 }}
          alt={"Contractor Dashboard Screenshot"}
          loading="lazy"
        />
      </Grid>
    </>
  )
}
