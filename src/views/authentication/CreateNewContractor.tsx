import { Section } from "../../components/paper/Section"
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterContractorMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { isAlphaNumeric } from "./AuthenticateRSI"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import { useTranslation } from "react-i18next"

export const fallback_image =
  "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
export const fallback_banner =
  "https://media.discordapp.net/attachments/690989503397101678/1157162282468524092/default_profile_banner.jpg?ex=65179adb&is=6516495b&hm=ce331ef90d2acf941e008199b7df2fd8127df642fdade0deb70d3fb79b136eae&=&width=2430&height=1366"

export function CreateNewContractor() {
  const [contractorName, setContractorName] = useState("")
  const [contractorIdentifier, setContractorIdentifier] = useState("")
  const [avatar, setAvatar] = useState(fallback_image)
  const [banner, setBanner] = useState(fallback_banner)
  const [description, setDescription] = useState("")
  const [error, setError] = useState(false)
  const { t } = useTranslation()

  const [
    registerNewContractor, // This is the mutation trigger
    // {isLoading}, // This is the destructured mutation result
  ] = useRegisterContractorMutation()

  const navigate = useNavigate()

  const issueAlert = useAlertHook()

  const submit = useCallback(
    async (event: any) => {
      if (!contractorName) {
        setError(true)
        return
      }
      // event.preventDefault();
      const res: { data?: any; error?: any } = await registerNewContractor({
        description,
        name: contractorName,
        identifier: contractorIdentifier,
        logo: avatar,
        banner,
      })

      if (res?.data && !res?.error) {
        navigate(`/contractor/~${contractorIdentifier}`)
      } else {
        issueAlert({
          message: t("contractorCreate.failed_auth", {
            reason:
              res.error?.error || res.error?.data?.error || res.error || "",
          }),
          severity: "error",
        })
      }
      return false
    },
    [
      contractorName,
      registerNewContractor,
      description,
      contractorIdentifier,
      avatar,
      banner,
      navigate,
      issueAlert,
      t,
    ],
  )

  return (
    <Section xs={12} lg={12}>
      <Grid item xs={12}>
        <TextField
          label={t("contractorCreate.name")}
          fullWidth
          value={contractorName}
          onChange={(event) => {
            let ident = ""
            for (let i = 0; i < event.target.value.length; i++) {
              const c = event.target.value.charAt(i)
              if ((isAlphaNumeric(c) || c === " ") && i < 50) {
                ident += c.toUpperCase()
              }
            }
            setContractorName(event.target.value)
          }}
          error={error ? !contractorName : false}
          helperText={
            error && !contractorName
              ? t("contractorCreate.error_name")
              : undefined
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t("contractorCreate.identifier")}
          fullWidth
          value={contractorIdentifier}
          onChange={(event) => {
            let ident = ""
            for (let i = 0; i < event.target.value.length; i++) {
              const c = event.target.value.charAt(i)
              if (isAlphaNumeric(c) && i < 30) {
                ident += c.toUpperCase()
              }
            }
            setContractorIdentifier(ident)
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">~</InputAdornment>,
          }}
          error={error ? !contractorName : false}
          helperText={
            error && !contractorName
              ? t("contractorCreate.error_identifier")
              : undefined
          }
        />
      </Grid>

      <Grid item xs={12}>
        <MarkdownEditor
          value={description}
          onChange={(value: string) => {
            setDescription(value)
          }}
          TextFieldProps={{
            label: t("contractorCreate.description"),
          }}
        />
      </Grid>

      <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={avatar}
          variant={"rounded"}
          sx={{ marginRight: 2, height: 96, width: 96 }}
        />
        <TextField
          label={t("contractorCreate.logo")}
          fullWidth
          value={avatar}
          onChange={(event) => setAvatar(event.target.value)}
          error={error ? !avatar : false}
          helperText={
            error && !contractorName
              ? t("contractorCreate.error_logo")
              : undefined
          }
        />
      </Grid>

      <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={banner}
          variant={"rounded"}
          sx={{ marginRight: 2, height: 96, width: 96 }}
        />
        <TextField
          label={t("contractorCreate.banner")}
          fullWidth
          value={banner}
          onChange={(event) => setBanner(event.target.value)}
          error={error ? !banner : false}
          helperText={
            error && !contractorName
              ? t("contractorCreate.error_banner")
              : undefined
          }
        />
      </Grid>

      <Grid item xs={12}>
        <Divider light />
      </Grid>
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"right"}>
          <Button variant={"outlined"} onClick={submit}>
            {t("contractorCreate.submit")}
          </Button>
        </Box>
      </Grid>
    </Section>
  )
}
