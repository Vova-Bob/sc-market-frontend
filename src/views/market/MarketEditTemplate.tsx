import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { Section } from "../../components/paper/Section"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import React, { useCallback, useEffect, useState } from "react"
import { useGetUserProfileQuery, useUpdateProfile } from "../../store/profile"
import { Grid, Typography } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import { useUpdateContractorMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"

export function MarketEditTemplate(props: { org?: boolean }) {
  const [contractor] = useCurrentOrg()
  const { data: profile } = useGetUserProfileQuery()

  const [template, setTemplate] = useState("")

  useEffect(() => {
    setTemplate(
      (props.org
        ? contractor?.market_order_template
        : profile?.market_order_template) || "",
    )
  }, [contractor, props.org])

  const [updateProfile, { isLoading: profileUpdateLoading }] =
    useUpdateProfile()
  const [updateOrg, { isLoading: orgUpdateLoading }] =
    useUpdateContractorMutation()

  const issueAlert = useAlertHook()

  const callback = useCallback(() => {
    let response
    if (props.org) {
      response = updateOrg({
        contractor: contractor!.spectrum_id,
        body: {
          market_order_template: template,
        },
      })
    } else {
      response = updateProfile({
        market_order_template: template,
      })
    }

    response
      .unwrap()
      .then((res) => {
        issueAlert({
          severity: "success",
          message: "Submitted!",
        })
      })
      .catch((err) => issueAlert(err))
  }, [template, contractor])

  return (
    <Section xs={12} title={"Edit Market Message Template"}>
      <Grid item xs={12}>
        <Typography>
          Configure the comment template that will be added to new market orders
          that users can fill out to provide you additional details.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MarkdownEditor value={template} onChange={setTemplate} />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          loading={orgUpdateLoading || profileUpdateLoading}
          onClick={callback}
          variant={"contained"}
          disabled={props.org && !contractor}
        >
          Submit
        </LoadingButton>
      </Grid>
    </Section>
  )
}
