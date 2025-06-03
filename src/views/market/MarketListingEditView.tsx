import React, { useCallback, useMemo, useState } from "react"
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import {
  AddAPhotoRounded,
  ArchiveRounded,
  EditRounded,
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { useCurrentMarketListing } from "../../hooks/market/CurrentMarketItem"
import { useUpdateMarketListing } from "../../store/market"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import { Navigate } from "react-router-dom"
import { ImageSearch } from "./ImageSearch"
import { MISSING_IMAGE_URL } from "../../hooks/styles/Theme"
import {
  MarketListingUpdateBody,
  UniqueListing,
} from "../../datatypes/MarketListing"
import { has_permission } from "../contractor/OrgRoles"
import { NumericFormat } from "react-number-format"
import { SelectGameItemStack } from "../../components/select/SelectGameItem"
import { Stack } from "@mui/system"
import { SelectPhotosArea } from "../../components/modal/SelectPhotosArea"

export function MarketListingEditView() {
  // TODO: Update listing details
  const [listing] = useCurrentMarketListing<UniqueListing>()
  const { data: profile } = useGetUserProfileQuery()
  const [currentOrg] = useCurrentOrg()

  const amContractor = useMemo(
    () =>
      currentOrg?.spectrum_id ===
      listing?.listing.contractor_seller?.spectrum_id,
    [currentOrg?.spectrum_id, listing?.listing?.contractor_seller],
  )
  const amSeller = useMemo(
    () =>
      profile?.username === listing?.listing.user_seller?.username &&
      !currentOrg,
    [currentOrg, listing?.listing?.user_seller?.username, profile?.username],
  )

  const amContractorManager = useMemo(
    () => amContractor && has_permission(currentOrg, profile, "manage_market"),
    [currentOrg, profile, amContractor],
  )

  const amRelated = useMemo(
    () => amSeller || amContractorManager || profile?.role === "admin",
    [amSeller, amContractorManager, profile?.role],
  )

  const { data: contractor } = useGetContractorBySpectrumIDQuery(
    listing.listing.contractor_seller?.spectrum_id!,
    { skip: !listing.listing.contractor_seller },
  )

  const issueAlert = useAlertHook()

  const [
    updateListing, // This is the mutation trigger
    { isLoading }, // This is the destructured mutation result
  ] = useUpdateMarketListing()

  const [quantity, setQuantity] = useState(listing.listing.quantity_available)
  const [price, setPrice] = useState(listing.listing.price)
  const [increment, setIncrement] = useState(
    listing.auction_details?.minimum_bid_increment,
  )
  const [description, setDescription] = useState(listing.details.description)
  const [title, setTitle] = useState(listing.details.title)
  const [type, setType] = useState(listing.details.item_type)
  const [item, setItem] = useState(listing.details.item_name)
  const [imageOpen, setImageOpen] = useState(false)
  const [photos, setPhotos] = useState(listing.photos)

  const updateListingCallback = useCallback(
    async (body: MarketListingUpdateBody) => {
      const res: { data?: any; error?: any } = await updateListing({
        listing_id: listing.listing.listing_id,
        body,
      })

      if (res?.data && !res?.error) {
        issueAlert({
          message: "Updated!",
          severity: "success",
        })
      } else {
        issueAlert({
          message: `Error while updating! ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }
    },
    [listing, issueAlert, updateListing],
  )

  return (
    <>
      <Grid item xs={12} lg={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Fade in={true}>
              <Card
                sx={{
                  borderRadius: 3,
                  minHeight: 400,
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",
                    minHeight: 192,
                    padding: 3,
                  }}
                >
                  <Box
                    sx={{
                      marginBottom: 2,
                      // minWidth: 200
                    }}
                  >
                    {listing.listing.status !== "archived" && (
                      <>
                        {listing.listing.status === "active" ? (
                          <Button
                            variant={"outlined"}
                            color={"warning"}
                            onClick={() =>
                              updateListingCallback({
                                status:
                                  listing.listing.status === "active"
                                    ? "inactive"
                                    : "active",
                              })
                            }
                            startIcon={<RadioButtonUncheckedRounded />}
                          >
                            Deactivate Listing
                          </Button>
                        ) : (
                          <Button
                            variant={"outlined"}
                            color={"success"}
                            onClick={() =>
                              updateListingCallback({
                                status:
                                  listing.listing.status === "active"
                                    ? "inactive"
                                    : "active",
                              })
                            }
                            startIcon={<RadioButtonCheckedRounded />}
                          >
                            Activate Listing
                          </Button>
                        )}
                        <Button
                          variant={"outlined"}
                          color={"error"}
                          onClick={() =>
                            updateListingCallback({ status: "archived" })
                          }
                          startIcon={<ArchiveRounded />}
                          sx={{ marginLeft: 1 }}
                        >
                          Archive Listing
                        </Button>
                      </>
                    )}
                  </Box>
                  {listing.type === "unique" && (
                    <Box
                      sx={{
                        paddingBottom: 2,
                        display: "flex",
                        "& > *": { marginRight: 2 },
                      }}
                    >
                      <TextField
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        sx={{
                          marginRight: 2,
                          width: "75%",
                        }}
                        size="small"
                        label={"Title"}
                        value={title}
                        onChange={(
                          event: React.ChangeEvent<{ value: string }>,
                        ) => {
                          setTitle(event.target.value)
                        }}
                        color={"secondary"}
                      />
                      <Button
                        onClick={() => updateListingCallback({ title })}
                        variant={"contained"}
                      >
                        Update
                      </Button>
                    </Box>
                  )}
                  {listing.type === "unique" && (
                    <Box
                      sx={{
                        paddingBottom: 2,
                        display: "flex",
                        "& > *": { marginRight: 2 },
                      }}
                    >
                      <SelectGameItemStack
                        onItemChange={(value) => setItem(value)}
                        onTypeChange={(value) => {
                          setType(value)
                          setItem(null)
                        }}
                        item_type={type}
                        item_name={item}
                      />
                      <Button
                        onClick={() =>
                          updateListingCallback({
                            item_type: type,
                            item_name: item,
                          })
                        }
                        variant={"contained"}
                      >
                        Update
                      </Button>
                    </Box>
                  )}
                  <Box
                    sx={{
                      paddingBottom: 2,
                    }}
                  >
                    <Divider light />
                  </Box>
                  <Box
                    sx={{
                      paddingBottom: 2,
                      display: "flex",
                      "& > *": { marginRight: 2 },
                    }}
                  >
                    <NumericFormat
                      decimalScale={0}
                      allowNegative={false}
                      customInput={TextField}
                      thousandSeparator
                      onValueChange={async (values, sourceInfo) => {
                        setQuantity(values.floatValue || 0)
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      sx={{
                        marginRight: 2,
                        width: "75%",
                      }}
                      size="small"
                      label={"Quantity Available"}
                      value={quantity}
                      color={"secondary"}
                    />
                    <Button
                      onClick={() =>
                        updateListingCallback({
                          quantity_available: quantity,
                        })
                      }
                      variant={"contained"}
                    >
                      Update
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      paddingBottom: 2,
                      display: "flex",
                      "& > *": { marginRight: 2 },
                    }}
                  >
                    <NumericFormat
                      decimalScale={0}
                      allowNegative={false}
                      customInput={TextField}
                      thousandSeparator
                      onValueChange={async (values, sourceInfo) => {
                        setPrice(values.floatValue || 0)
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      sx={{
                        marginRight: 2,
                        width: "75%",
                      }}
                      size="small"
                      label={"Price"}
                      value={price}
                      InputProps={{
                        readOnly: listing.listing.sale_type === "auction",
                        endAdornment: (
                          <InputAdornment position="end">aUEC</InputAdornment>
                        ),
                      }}
                      color={"secondary"}
                    />
                    <Button
                      onClick={() => updateListingCallback({ price })}
                      variant={"contained"}
                      disabled={listing.listing.sale_type === "auction"}
                    >
                      Update
                    </Button>
                  </Box>
                  {listing.listing.sale_type === "auction" ? (
                    <Box
                      sx={{
                        paddingBottom: 2,
                        display: "flex",
                        "& > *": { marginRight: 2 },
                      }}
                    >
                      <NumericFormat
                        decimalScale={0}
                        allowNegative={false}
                        customInput={TextField}
                        thousandSeparator
                        onValueChange={async (values, sourceInfo) => {
                          setIncrement(values.floatValue || 0)
                        }}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        sx={{
                          marginRight: 2,
                          width: "75%",
                        }}
                        size="small"
                        label={"Minimum Bid Increment"}
                        value={increment || 0}
                        InputProps={{
                          readOnly: listing.listing.sale_type === "auction",
                          endAdornment: (
                            <InputAdornment position="end">aUEC</InputAdornment>
                          ),
                        }}
                        color={"secondary"}
                      />
                      <Button
                        onClick={() =>
                          updateListingCallback({
                            minimum_bid_increment: increment,
                          })
                        }
                        variant={"contained"}
                        disabled={listing.listing.sale_type !== "auction"}
                      >
                        Update
                      </Button>
                    </Box>
                  ) : null}
                  {listing.type === "unique" && (
                    <>
                      <Divider light />
                      <Box sx={{ marginTop: 2 }}>
                        <MarkdownEditor
                          sx={{ marginRight: 2, marginBottom: 1 }}
                          onChange={(value: string) => {
                            setDescription(value)
                          }}
                          value={description}
                          TextFieldProps={{ label: "Description" }}
                          BarItems={
                            <Button
                              onClick={() =>
                                updateListingCallback({ description })
                              }
                              variant={"contained"}
                            >
                              Update
                            </Button>
                          }
                          variant={"vertical"}
                        />
                      </Box>
                    </>
                  )}
                  <Grid item xs={12}>
                    <SelectPhotosArea setPhotos={setPhotos} photos={photos} />
                    <Button
                      onClick={() => updateListingCallback({ photos })}
                      variant={"contained"}
                    >
                      Update
                    </Button>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
