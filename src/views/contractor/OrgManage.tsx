import React, { useState } from "react"
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Fab,
  Grid,
  IconButton,
  Link,
  Paper,
  Rating,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material"
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded"
import CreateIcon from "@mui/icons-material/CreateRounded"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import {
  ContractorKindIconKey,
  contractorKindIcons,
  contractorKindIconsKeys,
} from "./ContractorList"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { Contractor } from "../../datatypes/Contractor"
import { EditRounded, SaveRounded, StarRounded } from "@mui/icons-material"
import { useUpdateContractorMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import {
  MarkdownEditor,
  MarkdownRender,
} from "../../components/markdown/Markdown"
import { external_resource_regex } from "../people/ViewProfile"
import { ListingSellerRating } from "../../components/rating/ListingRating"
import { useTranslation } from "react-i18next"

export function OrgDetailEdit() {
  const [contractor] = useCurrentOrg()

  return (
    <React.Fragment>
      {contractor ? (
        <OrgDetailEditForm contractor={contractor} />
      ) : (
        <OrgDetailEditSkeleton />
      )}
    </React.Fragment>
  )
}

export function OrgDetailEditSkeleton() {
  return (
    <Grid item xs={12} lg={8}>
      <Skeleton variant={"rectangular"} width={"100%"} height={400} />
    </Grid>
  )
}

export function OrgDetailEditForm(props: { contractor: Contractor }) {
  const theme = useTheme<ExtendedTheme>()
  const { contractor } = props
  const { t } = useTranslation()
  const issueAlert = useAlertHook()

  const [editingName, setEditingName] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [editingTags, setEditingTags] = useState(false)

  const [newName, setNewName] = useState(contractor?.name || "")
  const [newDesc, setNewDesc] = useState(contractor?.description || "")
  const [newTags, setNewTags] = useState(contractor?.fields || [])

  const [showAvatarButton, setShowAvatarButton] = useState(false)
  const [avatarEntryOpen, setAvatarEntryOpen] = useState(false)
  const [newAvatarURL, setNewAvatarURL] = useState("")

  const [bannerEntryOpen, setBannerEntryOpen] = useState(false)
  const [newBannerURL, setNewBannerURL] = useState("")

  const [
    updateContractor, // This is the mutation trigger
    { isSuccess }, // This is the destructured mutation result
  ] = useUpdateContractorMutation()

  async function submitUpdate(data: {
    description?: string
    tags?: string[]
    avatar_url?: string
    site_url?: string
    name?: string
    banner_url?: string
  }) {
    const res: { data?: any; error?: any } = await updateContractor({
      contractor: contractor.spectrum_id,
      body: data,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: t("orgDetailEdit.submitted"),
        severity: "success",
      })
    } else {
      issueAlert({
        message: t("orgDetailEdit.failed_submit", {
          reason: res.error?.error || res.error?.data?.error || res.error || "",
        }),
        severity: "error",
      })
    }
    return false
  }

  return (
    <React.Fragment>
      <Grid item xs={12} lg={12}>
        <Card
          sx={{
            borderRadius: 3,
            padding: 3,
          }}
        >
          <CardHeader
            sx={{
              width: "100%",
            }}
            avatar={
              <Box
                position={"relative"}
                onMouseEnter={() => setShowAvatarButton(true)}
                onMouseLeave={() => setShowAvatarButton(false)}
              >
                <IconButton
                  sx={{
                    opacity: showAvatarButton ? 1 : 0,
                    position: "absolute",
                    zIndex: 50,
                    transition: "0.3s",
                    color: "white",
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                  }}
                  onClick={() => setAvatarEntryOpen((v) => !v)}
                >
                  <EditRounded />
                </IconButton>
                <Avatar
                  src={contractor?.avatar}
                  aria-label={t("contractors.contractor")}
                  variant={"rounded"}
                  sx={{
                    maxHeight: theme.spacing(12),
                    maxWidth: theme.spacing(12),
                    opacity: showAvatarButton ? 0.5 : 1,
                    // maxWidth:'100%',
                    // maxHeight:'100%',
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Collapse in={avatarEntryOpen} orientation={"horizontal"}>
                  <Box
                    sx={{
                      backgroundColor: "#000000D0",
                      position: "absolute",
                      zIndex: 50,
                      left: 96,
                      top: 0,
                      minWidth: 400,
                      display: "flex",
                      borderRadius: 2,
                    }}
                  >
                    <TextField
                      variant={"filled"}
                      label={t("orgDetailEdit.image_url")}
                      fullWidth
                      focused
                      multiline
                      helperText={
                        avatarEntryOpen && t("orgDetailEdit.image_url_helper")
                      }
                      onChange={(
                        event: React.ChangeEvent<{ value: string }>,
                      ) => {
                        setNewAvatarURL(event.target.value)
                      }}
                      value={newAvatarURL}
                      error={
                        !!newAvatarURL &&
                        !newAvatarURL.match(external_resource_regex)
                      }
                    />

                    <Button
                      onClick={async () => {
                        if (avatarEntryOpen && newAvatarURL) {
                          await submitUpdate({ avatar_url: newAvatarURL })
                        }
                        setAvatarEntryOpen(false)
                      }}
                    >
                      {t("orgDetailEdit.save")}
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            }
            title={
              editingName ? (
                <Grid
                  container
                  spacing={1}
                  alignItems={"center"}
                  sx={{ marginBottom: 1 }}
                >
                  <Grid item xs={12} lg={10}>
                    <TextField
                      fullWidth
                      multiline
                      value={newName}
                      onChange={(event: any) => {
                        setNewName(event.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={1}>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={async () => {
                        if (editingName && newName) {
                          await submitUpdate({ name: newName })
                        }
                        setEditingName((v) => !v)
                      }}
                    >
                      {t("orgDetailEdit.save")}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Link onClick={() => setEditingName(true)}>
                  <Typography
                    color={"text.secondary"}
                    variant={"subtitle1"}
                    fontWeight={"bold"}
                    display={"inline"}
                  >
                    {newName}
                    <IconButton>
                      <CreateIcon />
                    </IconButton>
                  </Typography>
                </Link>
              )
            }
            subheader={
              <Box>
                <Grid container alignItems={"center"} spacing={1}>
                  <Grid item>
                    <PeopleAltRoundedIcon />
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{ marginLeft: 1 }}
                      color={"text.primary"}
                      fontWeight={"bold"}
                    >
                      {contractor?.size}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container alignItems={"center"} spacing={1}>
                  {/*<Grid item>*/}
                  {/*    <StarRateRoundedIcon style={{color: theme.palette.text.primary}}/>*/}
                  {/*</Grid>*/}
                  <Grid item>
                    <Typography
                      sx={{ marginLeft: 1 }}
                      color={"text.primary"}
                      fontWeight={"bold"}
                    >
                      <ListingSellerRating contractor={contractor} />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
            // action={
            //     <Button color={'secondary'} variant={'outlined'}>
            //         Contact
            //     </Button>
            // }
          />
          {editingTags ? (
            <CardContent sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions
                value={newTags}
                onChange={(event: any, newValue) => {
                  setNewTags(newValue || [])
                }}
                options={contractorKindIconsKeys}
                defaultValue={
                  [
                    ...(contractor?.fields as ContractorKindIconKey[]),
                  ] /* I don't know why it needs this dumb thing, but the types error without */
                }
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("orgDetailEdit.org_tags")}
                    placeholder={t("orgDetailEdit.mining")}
                    fullWidth
                    SelectProps={{
                      IconComponent: KeyboardArrowDownRoundedIcon,
                    }}
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      color={"primary"}
                      label={option}
                      sx={{ marginRight: 1, textTransform: "capitalize" }}
                      variant={"outlined"}
                      icon={contractorKindIcons[option]}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                // getOptionLabel={option => <span style={{textTransform: 'capitalize'}}>{option}</span>}
              />
              <Button
                sx={{ marginLeft: 2 }}
                variant={"contained"}
                onClick={async () => {
                  if (editingTags && newTags) {
                    await submitUpdate({ tags: newTags })
                  }
                  setEditingTags((v) => !v)
                }}
              >
                {t("orgDetailEdit.save")}
              </Button>
            </CardContent>
          ) : (
            <CardActions sx={{ overflow: "scroll" }}>
              {contractor.fields.length ? (
                contractor?.fields.map((option, index) => (
                  <Chip
                    color={"primary"}
                    label={option}
                    sx={{ marginRight: 1, textTransform: "capitalize" }}
                    variant={"outlined"}
                    icon={contractorKindIcons[option]}
                    key={index}
                  />
                ))
              ) : (
                <Typography>{t("orgDetailEdit.no_tags")}</Typography>
              )}
              <IconButton
                sx={{
                  // position: 'absolute',
                  zIndex: 50,
                  transition: "0.3s",
                  color: "white",
                  // top: 20,
                  // left: 20
                }}
                onClick={() => setEditingTags(true)}
              >
                <EditRounded />
              </IconButton>
            </CardActions>
          )}
          <CardContent>
            {editingDesc ? (
              <>
                <MarkdownEditor
                  value={newDesc}
                  onChange={(value: string) => {
                    setNewDesc(value)
                  }}
                />
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  sx={{ marginTop: 2, marginBottom: 2 }}
                >
                  <Button
                    variant={"contained"}
                    onClick={async () => {
                      if (editingDesc && newDesc) {
                        await submitUpdate({ description: newDesc })
                      }
                      setEditingDesc((v) => !v)
                    }}
                  >
                    {t("orgDetailEdit.save")}
                  </Button>
                </Box>
              </>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => {
                      setNewDesc(contractor.description)
                      setEditingDesc(true)
                    }}
                  >
                    <CreateIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={11}>
                  <MarkdownRender text={contractor.description} />
                </Grid>
              </Grid>
            )}

            <Paper
              sx={{
                height: 350,
                background: `url(${props.contractor.banner})`,
                backgroundSize: "cover",
                borderRadius: 3,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                }}
              >
                <Collapse in={bannerEntryOpen} orientation={"horizontal"}>
                  <Box
                    sx={{
                      backgroundColor: "#00000090",
                    }}
                  >
                    <TextField
                      variant={"filled"}
                      label={t("orgDetailEdit.image_url")}
                      fullWidth
                      focused
                      multiline
                      helperText={
                        bannerEntryOpen && t("orgDetailEdit.image_url_helper")
                      }
                      onChange={(
                        event: React.ChangeEvent<{ value: string }>,
                      ) => {
                        setNewBannerURL(event.target.value)
                      }}
                      value={newBannerURL}
                      error={
                        !!newBannerURL &&
                        !newBannerURL.match(external_resource_regex)
                      }
                    />
                  </Box>
                </Collapse>

                <Fab
                  color={bannerEntryOpen ? "primary" : "secondary"}
                  aria-label={t("orgDetailEdit.set_banner")}
                  onClick={async () => {
                    if (bannerEntryOpen && newBannerURL) {
                      await submitUpdate({ banner_url: newBannerURL })
                    }
                    setBannerEntryOpen((v) => !v)
                  }}
                  sx={{
                    transition: "0.3s",
                    marginLeft: 2,
                  }}
                >
                  {bannerEntryOpen ? <SaveRounded /> : <EditRounded />}
                </Fab>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  )
}
