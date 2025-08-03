import { useNavigate, useParams, Link } from "react-router-dom"
import React, { useCallback, useEffect } from "react"
import { Page } from "../../components/metadata/Page"
import {
  useAcceptContractorInviteCodeMutation,
  useGetContractorBySpectrumIDQuery,
  useGetContractorInviteCodeQuery,
} from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { Section } from "../../components/paper/Section"
import LoadingButton from "@mui/lab/LoadingButton"
import { Grid } from "@mui/material"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { OrgDetails } from "../../components/list/UserDetails"
import { useTranslation } from "react-i18next"

export function AcceptOrgInvite() {
  const { t } = useTranslation()
  const { invite_id } = useParams<{ invite_id: string }>()

  const issueAlert = useAlertHook()

  const { data: inviteDetails, isError } = useGetContractorInviteCodeQuery(
    invite_id || "",
  )
  useEffect(() => {
    if (isError) {
      navigate("/404")
    }
  }, [isError])

  const [acceptInvite, { isLoading }] = useAcceptContractorInviteCodeMutation()
  const navigate = useNavigate()

  const acceptCallback = useCallback(async () => {
    acceptInvite(invite_id || "")
      .unwrap()
      .then(() => {
        issueAlert({
          message: t("org.invite.accepted"),
          severity: "success",
        })
        navigate("/")
      })
      .catch((error) => {
        issueAlert(error)
      })
  }, [acceptInvite, invite_id, issueAlert, navigate, t])

  const { data: contractor } = useGetContractorBySpectrumIDQuery(
    inviteDetails?.spectrum_id || "",
    { skip: !inviteDetails?.spectrum_id },
  )

  return (
    <Page title={t("org.invite.acceptInviteTitle")}>
      <ContainerGrid maxWidth={"md"} sidebarOpen={true}>
        <Section title={t("org.invite.acceptContractorInvite")}>
          <Grid item xs={12}>
            {t("org.invite.invitedMessage")}{" "}
            {contractor && <OrgDetails org={contractor} />}
          </Grid>

          <Grid item>
            <LoadingButton
              onClick={acceptCallback}
              loading={isLoading}
              variant={"contained"}
            >
              {t("org.invite.accept")}
            </LoadingButton>
          </Grid>
        </Section>
      </ContainerGrid>
    </Page>
  )
}
