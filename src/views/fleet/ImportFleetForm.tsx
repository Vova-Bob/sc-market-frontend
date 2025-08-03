import React, { useState } from "react"
import { Section } from "../../components/paper/Section"
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material"
import { useImportShipFile } from "../../store/ships"
import { AlertInterface } from "../../datatypes/Alert"
import { Navigate } from "react-router-dom"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useTranslation } from "react-i18next"

export function ImportFleetForm() {
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const [
    uploadFleetFile, // This is the mutation trigger
    { isSuccess }, // This is the destructured mutation result
  ] = useImportShipFile()

  const onFileUpload = async () => {
    const content = await selectedFile?.text()
    const res: { data?: any; error?: any } = await uploadFleetFile(
      JSON.parse(content || "[]"),
    )

    if (res?.data && !res?.error) {
      issueAlert({
        message: t("ships.import.submitted"),
        severity: "success",
      })
    } else {
      issueAlert({
        message: t("ships.import.failed", {
          error: res.error?.error || res.error?.data?.error || res.error || "",
        }),
        severity: "error",
      })
    }
  }

  const issueAlert = useAlertHook()

  return (
    <>
      {isSuccess && <Navigate to={"/myfleet"} />}
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            {t("ships.import.title")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item container spacing={2} justifyContent={"right"}>
            <Grid
              item
              xs={12}
              lg={12}
              display={"flex"}
              justifyContent={"flex-end"}
            >
              <Typography
                variant={"h6"}
                align={"right"}
                sx={{ marginRight: 2 }}
              >
                {selectedFile?.name}
              </Typography>
              <Button variant="outlined" component="label" color={"secondary"}>
                {t("ships.import.upload")}
                <input
                  type="file"
                  hidden
                  accept={".json"}
                  onChange={(event) => {
                    const file = (event.target.files || [])[0]
                    setSelectedFile(file || null)
                  }}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={"primary"}
                onClick={onFileUpload}
              >
                {t("ships.import.submit")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Section>
    </>
  )
}
