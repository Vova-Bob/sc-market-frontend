import React, { useCallback, useEffect, useMemo } from "react"
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useMarketGetMyListingsQuery,
  useMarketUpdateMultipleListingMutation,
} from "../../store/market"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import {
  MarketMultiple,
  MarketMultipleBody,
  MarketMultipleListingComposite,
  UniqueListing,
} from "../../datatypes/MarketListing"
import { Section } from "../../components/paper/Section"
import { useCurrentMarketListing } from "../../hooks/market/CurrentMarketItem"
import { SelectGameCategory } from "../../components/select/SelectGameItem"

export function MarketMultipleEditView() {
  const [current_listing] = useCurrentMarketListing<MarketMultiple>()

  const [state, setState] = React.useState<
    MarketMultipleBody & {
      multiple_id: string
    }
  >({
    default_listing_id: current_listing.default_listing.listing.listing_id,
    description: current_listing.details.description,
    item_type: current_listing.details.item_type,
    listings: current_listing.listings.map((l) => l.listing.listing_id),
    title: current_listing.details.title,
    multiple_id: current_listing.multiple_id,
  })

  useEffect(() => {
    setState((s) => ({
      default_listing_id: current_listing.default_listing.listing.listing_id,
      description: current_listing.details.description,
      item_type: current_listing.details.item_type,
      listings: current_listing.listings.map((l) => l.listing.listing_id),
      title: current_listing.details.title,
      multiple_id: current_listing.multiple_id,
    }))
  }, [current_listing])

  const [updateListing, { isLoading }] =
    useMarketUpdateMultipleListingMutation()

  const issueAlert = useAlertHook()

  const [currentOrg] = useCurrentOrg()

  const updateMarketListing = useCallback(
    async (event: any) => {
      const res: { data?: any; error?: any } = await updateListing(state)

      if (res?.data && !res?.error) {
        issueAlert({
          message: "Submitted!",
          severity: "success",
        })
      } else {
        issueAlert({
          message: `Failed to submit! ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }

      return false
    },
    [
      updateListing,
      currentOrg?.spectrum_id,
      issueAlert,
      state,
      current_listing,
    ],
  )

  const { data: currentListings } = useMarketGetMyListingsQuery(
    currentOrg?.spectrum_id,
  )
  const listingOptions = useMemo(
    () =>
      (currentListings || []).filter(
        (l) =>
          ["unique", "multiple_listing"].includes(l.type) &&
          ["multiple", "sale"].includes(
            (l as UniqueListing | MarketMultipleListingComposite).listing
              .sale_type,
          ),
      ) as (UniqueListing | MarketMultipleListingComposite)[],
    [currentListings],
  )

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            About
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              fullWidth
              label="Title"
              id="order-title"
              value={state.title}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, title: event.target.value })
              }}
              color={"secondary"}
            />
          </Grid>

          <Grid item xs={12} lg={12}>
            <SelectGameCategory
              item_type={state.item_type}
              onTypeChange={(newValue) =>
                setState({ ...state, item_type: newValue })
              }
              TextfieldProps={{
                size: "small",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <MarkdownEditor
              onChange={(value: string) => {
                setState({ ...state, description: value })
              }}
              value={state.description}
              TextFieldProps={{
                label: "Description",
                helperText: "E.g. Exclusive subscriber flare for August 2020",
              }}
              variant={"vertical"}
            />
          </Grid>
        </Grid>
      </Section>

      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            Listings
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              // multiple
              disablePortal
              options={listingOptions}
              getOptionLabel={(option) => option.details.title}
              renderInput={(params) => (
                <TextField {...params} label="Default Listing" />
              )}
              filterSelectedOptions
              onChange={(event, value) =>
                setState((s) => {
                  if (value) {
                    if (state.listings!.includes(value.listing.listing_id)) {
                      return {
                        ...s,
                        default_listing_id: value.listing.listing_id,
                      }
                    } else {
                      state.listings!.push(value.listing.listing_id)
                      return {
                        ...s,
                        default_listing_id: value.listing.listing_id,
                        listings: s.listings,
                      }
                    }
                  } else {
                    return s
                  }
                })
              }
              value={
                listingOptions.find(
                  (l) => l.listing.listing_id === state.default_listing_id,
                ) || null
              }
              color={"secondary"}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              disablePortal
              options={listingOptions}
              getOptionLabel={(option) => option.details.title}
              renderInput={(params) => (
                <TextField {...params} label="Listings to Include" />
              )}
              onChange={(event, value) =>
                setState((s) => ({
                  ...s,
                  listings: value.map((l) => l.listing.listing_id),
                }))
              }
              value={state.listings
                .map(
                  (r) =>
                    listingOptions.find((l) => l.listing.listing_id === r)!,
                )
                .filter((l) => l)}
              color={"secondary"}
            />
          </Grid>
        </Grid>
      </Section>
      <Grid item xs={12} container justifyContent={"right"}>
        <Button
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          onClick={updateMarketListing}
          disabled={isLoading}
        >
          Update
        </Button>
      </Grid>
    </>
    // </FormControl>
  )
}
