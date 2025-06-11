import {
  Autocomplete,
  Button,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import {
  useMarketCreateListingMutation,
  useMarketCreateAggregateListingMutation,
  useMarketCreateMultipleListingMutation,
  useMarketGetAggregateByIDQuery,
  useMarketGetMyListingsQuery,
  useSearchMarketQuery,
} from "../../store/market"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  AggregateMarketListingBody,
  MarketListingBody,
  MarketMultipleBody,
  UniqueListing,
} from "../../datatypes/MarketListing"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import {
  AddCircleOutlineRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import { DateTimePicker } from "@mui/x-date-pickers"
import { useNavigate } from "react-router-dom"
import { PageSearch } from "./PageSearch"
import { convertToLegacy, DisplayListingsHorizontal } from "./ItemListings"
import { NumericFormat } from "react-number-format"
import { FormPaper } from "../../components/paper/FormPaper"
import {
  SelectGameCategory,
  SelectGameItemStack,
} from "../../components/select/SelectGameItem"
import LoadingButton from "@mui/lab/LoadingButton"
import { SelectPhotosArea } from "../../components/modal/SelectPhotosArea"

export function MarketListingForm(props: { sale_type: "sale" | "auction" }) {
  const [state, setState] = React.useState<MarketListingBody>({
    title: "",
    description: "",
    sale_type: props.sale_type,
    item_type: "Other",
    price: 0,
    quantity_available: 1,
    photos: [
      "https://media.starcitizen.tools/thumb/9/93/Placeholderv2.png/399px-Placeholderv2.png.webp",
    ],
    minimum_bid_increment: 1000,
    internal: false,
    status: "active",
    end_time: null,
    item_name: null,
  })

  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchMarketQuery(
      {
        index: 0,
        page_size: 10,
        quantityAvailable: 1,
        query: state.item_name || state.title,
        seller_rating: 0,
        minCost: 0,
        sort: "activity",
      },
      { skip: (state.item_name || state.title).length < 3 },
    )

  const [imageOpen, setImageOpen] = useState(false)

  const [
    createListing, // This is the mutation trigger
    { isLoading }, // This is the destructured mutation result
  ] = useMarketCreateListingMutation()

  const issueAlert = useAlertHook()

  const [currentOrg] = useCurrentOrg()

  const navigate = useNavigate()

  const submitMarketListing = useCallback(
    async (event: any) => {
      createListing({
        body: state,
        spectrum_id: currentOrg?.spectrum_id,
      })
        .unwrap()
        .then((res) => {
          setState({
            title: "",
            description: "",
            sale_type: props.sale_type,
            item_type: "Other",
            price: 0,
            quantity_available: 1,
            photos: [
              "https://media.starcitizen.tools/thumb/9/93/Placeholderv2.png/399px-Placeholderv2.png.webp",
            ],
            minimum_bid_increment: 1000,
            internal: false,
            status: "active",
            end_time: null,
            item_name: null,
          })

          issueAlert({
            message: "Submitted!",
            severity: "success",
          })

          navigate(`/market/${res.listing_id}`)
        })
        .catch((err) => {
          issueAlert(err)
        })

      return false
    },
    [
      createListing,
      currentOrg?.spectrum_id,
      navigate,
      props.sale_type,
      issueAlert,
      state,
    ],
  )

  const filledResults = useMemo(
    () => (searchResults?.listings || []).map((l) => convertToLegacy(l)),
    [searchResults],
  )

  const [relatedOpen, setRelatedOpen] = useState(false)

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      <FormPaper title={"About"}>
        <Grid item xs={12} lg={12}>
          <TextField
            fullWidth
            label="Title"
            id="order-title"
            value={state.title}
            onChange={(event: React.ChangeEvent<{ value: string }>) => {
              setState((state) => ({ ...state, title: event.target.value }))
            }}
            color={"secondary"}
          />
        </Grid>

        <SelectGameItemStack
          onItemChange={(value) =>
            setState((state) => ({ ...state, item_name: value }))
          }
          onTypeChange={(value) =>
            setState((state) => ({
              ...state,
              item_type: value,
              item_name: null,
            }))
          }
          item_type={state.item_type}
          item_name={state.item_name}
        />

        <Grid item xs={12} lg={12}>
          <NumericFormat
            decimalScale={0}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            onValueChange={async (values, sourceInfo) => {
              setState((state) => ({
                ...state,
                quantity_available: values.floatValue || 0,
              }))
            }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Quantity Available"
            id="quantity-available"
            value={state.quantity_available}
            defaultValue={1}
            color={"secondary"}
          />
        </Grid>

        <Grid item xs={12}>
          <MarkdownEditor
            onChange={(value: string) => {
              setState((state) => ({ ...state, description: value }))
            }}
            value={state.description}
            TextFieldProps={{
              label: "Description",
              helperText: "E.g. Exclusive subscriber flare for August 2020",
            }}
            variant={"vertical"}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography color={"text.secondary"} variant={"body2"}>
            Search for images or upload your own
          </Typography>
          <SelectPhotosArea
            setPhotos={(photos) => setState((state) => ({ ...state, photos }))}
            photos={state.photos}
          />
        </Grid>
      </FormPaper>

      <Grid item xs={12}>
        <Typography
          variant={"h6"}
          align={"left"}
          color={"text.secondary"}
          sx={{ fontWeight: "bold" }}
        >
          Related Listings{" "}
          <IconButton onClick={() => setRelatedOpen((o) => !o)}>
            {relatedOpen ? (
              <KeyboardArrowUpRounded />
            ) : (
              <KeyboardArrowDownRoundedIcon />
            )}
          </IconButton>
        </Typography>
        <Collapse in={relatedOpen}>
          {!!filledResults.length && (
            <Grid container>
              <DisplayListingsHorizontal listings={filledResults} />
            </Grid>
          )}
        </Collapse>
      </Grid>

      <FormPaper title={"Availability"}>
        <Grid item xs={12} lg={12} display={"flex"} justifyContent={"right"}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={state.status === "active"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setState((state) => ({
                      ...state,
                      status: event.target.checked ? "active" : "inactive",
                    }))
                  }
                />
              }
              label="Listing Active"
            />
            {currentOrg && (
              <FormControlLabel
                control={
                  <Switch
                    checked={state.internal}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setState({
                        ...state,
                        internal: event.target.checked,
                      })
                    }
                  />
                }
                label="Org Internal Listing"
              />
            )}
          </FormGroup>
        </Grid>
      </FormPaper>

      <FormPaper title={"Costs"}>
        <Grid item xs={12}>
          <NumericFormat
            decimalScale={0}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            onValueChange={async (values, sourceInfo) => {
              setState((state) => ({
                ...state,
                price: values.floatValue || 0,
              }))
            }}
            fullWidth={true}
            label={state.sale_type === "sale" ? "Price" : "Starting Bid"}
            id="collateral"
            color={"secondary"}
            value={state.price}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{`aUEC`}</InputAdornment>
              ),
              inputMode: "numeric",
            }}
            type={"tel"}
          />
        </Grid>
        {state.sale_type === "auction" ? (
          <>
            <Grid item xs={12}>
              <NumericFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                onValueChange={async (values, sourceInfo) => {
                  setState((state) => ({
                    ...state,
                    minimum_bid_increment: values.floatValue || 0,
                  }))
                }}
                fullWidth={true}
                label={"Minimum bid increment"}
                id="collateral"
                color={"secondary"}
                value={state.minimum_bid_increment}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">{`aUEC`}</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                type={"tel"}
              />
            </Grid>
            <Grid item>
              <DateTimePicker
                label={`End Time (${
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                })`}
                value={state.end_time}
                onChange={(newValue) =>
                  setState((state) => ({ ...state, end_time: newValue }))
                }
              />
            </Grid>
          </>
        ) : null}
      </FormPaper>
      <Grid item xs={12} container justifyContent={"right"}>
        <LoadingButton
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          // component={Link}
          // to={'/p/myoffers'}
          onClick={submitMarketListing}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </Grid>
    </>
    // </FormControl>
  )
}

export function AggregateMarketListingForm() {
  const [state, setState] = React.useState<AggregateMarketListingBody>({
    price: 0,
    quantity_available: 1,
    wiki_id: "",
    status: "active",
    internal: false,
  })

  const [imageOpen, setImageOpen] = useState(false)

  const [
    createAggregateListing, // This is the mutation trigger
    { isLoading }, // This is the destructured mutation result
  ] = useMarketCreateAggregateListingMutation()

  const [aggregateChoice, setAggregateChoice] = useState<
    | string
    | {
        label: string
        id: string | number
      }
    | null
  >(null)

  useEffect(() => {
    if (typeof aggregateChoice !== "string" && aggregateChoice) {
      setState((state) => ({ ...state, wiki_id: aggregateChoice.id }))
    }
  }, [aggregateChoice])

  const { data: aggregate } = useMarketGetAggregateByIDQuery(state.wiki_id, {
    skip: !state.wiki_id,
  })

  const issueAlert = useAlertHook()

  const [currentOrg] = useCurrentOrg()
  const navigate = useNavigate()

  const submitMarketListing = useCallback(
    async (event: any) => {
      const res: { data?: any; error?: any } = await createAggregateListing({
        body: state,
        spectrum_id: currentOrg?.spectrum_id,
      })

      if (res?.data && !res?.error) {
        setState({
          price: 0,
          quantity_available: 1,
          wiki_id: "",
          status: "active",
          internal: false,
        })

        issueAlert({
          message: "Submitted!",
          severity: "success",
        })

        navigate(`/market/aggregate/${res.data.aggregate_id}`)
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
    [createAggregateListing, currentOrg?.spectrum_id, issueAlert, state],
  )

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      <FormPaper title={"About"}>
        {aggregate && (
          <>
            <Grid item xs={12} lg={12}>
              <Typography variant={"h5"}>{aggregate?.details.title}</Typography>
            </Grid>

            <Grid item xs={12} lg={12}>
              <Typography
                variant={"subtitle1"}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {aggregate?.details.item_type}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant={"body1"}>
                {aggregate?.details.description}
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12} lg={12}>
          <NumericFormat
            decimalScale={0}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            onValueChange={async (values, sourceInfo) => {
              setState({
                ...state,
                quantity_available: values.floatValue || 0,
              })
            }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Quantity Available"
            id="quantity-available"
            value={state.quantity_available}
            defaultValue={1}
            fullWidth
            color={"secondary"}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container alignItems={"center"}>
            <Grid item xs={12} md={8}>
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  // whiteSpace: "pre-line",
                }}
              >
                {(aggregate?.photos || [])[0]}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant={"contained"}
                startIcon={<AddCircleOutlineRounded />}
                onClick={() => setImageOpen(true)}
              >
                Choose New Item
              </Button>
            </Grid>
          </Grid>

          <PageSearch
            open={imageOpen}
            setOpen={setImageOpen}
            callback={(arg) => {
              if (arg) {
                setState({
                  ...state,
                  wiki_id: arg.pageid,
                })
                setAggregateChoice({ id: arg.pageid, label: arg.title })
              }
            }}
          />
        </Grid>
      </FormPaper>

      <FormPaper title={"Availability"}>
        <Grid item xs={12} lg={12} display={"flex"} justifyContent={"right"}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={state.status === "active"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setState({
                      ...state,
                      status: event.target.checked ? "active" : "inactive",
                    })
                  }}
                />
              }
              label="Listing Active"
            />
            {currentOrg && (
              <FormControlLabel
                control={
                  <Switch
                    checked={state.internal}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setState({
                        ...state,
                        internal: event.target.checked,
                      })
                    }
                  />
                }
                label="Org Internal Listing"
              />
            )}
          </FormGroup>
        </Grid>
      </FormPaper>

      <FormPaper title={"Costs"}>
        <Grid item xs={12}>
          <NumericFormat
            decimalScale={0}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            onValueChange={async (values, sourceInfo) => {
              setState({
                ...state,
                price: +(values.floatValue || 0),
              })
            }}
            value={state.price}
            fullWidth={true}
            label={"Price"}
            id="price"
            color={"secondary"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{`aUEC`}</InputAdornment>
              ),
            }}
          />
        </Grid>
      </FormPaper>
      <Grid item xs={12} container justifyContent={"right"}>
        <LoadingButton
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          // component={Link}
          // to={'/p/myoffers'}
          onClick={submitMarketListing}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </Grid>
    </>
    // </FormControl>
  )
}

export function MarketMultipleForm() {
  const [state, setState] = React.useState<MarketMultipleBody>({
    title: "",
    description: "",
    item_type: "armor",
    default_listing_id: "",
    listings: [],
  })

  const [imageOpen, setImageOpen] = useState(false)

  const [createListing, { isLoading }] =
    useMarketCreateMultipleListingMutation()

  const issueAlert = useAlertHook()

  const [currentOrg] = useCurrentOrg()

  const navigate = useNavigate()

  const submitMarketListing = useCallback(
    async (event: any) => {
      const res: { data?: any; error?: any } = await createListing({
        body: state,
        spectrum_id: currentOrg?.spectrum_id,
      })

      if (res?.data && !res?.error) {
        setState({
          title: "",
          description: "",
          item_type: "armor",
          default_listing_id: "",
          listings: [],
        })

        issueAlert({
          message: "Submitted!",
          severity: "success",
        })

        navigate(`/market/multiple/${res.data.multiple_id}`)
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
    [createListing, currentOrg?.spectrum_id, issueAlert, state],
  )

  const { data: currentListings } = useMarketGetMyListingsQuery(
    currentOrg?.spectrum_id,
  )
  const uniqueListings = useMemo(
    () =>
      (currentListings || []).filter(
        (l) => l.type === "unique" && l.listing.sale_type === "sale",
      ) as UniqueListing[],
    [currentListings],
  )

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      <FormPaper title={"About"}>
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
            onTypeChange={(value) =>
              setState({
                ...state,
                item_type: value,
              })
            }
            item_type={state.item_type}
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
      </FormPaper>

      <FormPaper title={"Listings"}>
        <Grid item xs={12}>
          <Autocomplete
            // multiple
            disablePortal
            options={uniqueListings}
            getOptionLabel={(option) => option.details.title}
            renderInput={(params) => (
              <TextField {...params} label="Default Listing" />
            )}
            onChange={(event, value) =>
              setState((s) => {
                if (value) {
                  if (s.listings.includes(value.listing.listing_id)) {
                    return {
                      ...s,
                      default_listing_id: value.listing.listing_id,
                    }
                  } else {
                    s.listings.push(value.listing.listing_id)
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
              uniqueListings.find(
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
            options={uniqueListings}
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
                (r) => uniqueListings.find((l) => l.listing.listing_id === r)!,
              )
              .filter((l) => l)}
            color={"secondary"}
          />
        </Grid>
      </FormPaper>
      <Grid item xs={12} container justifyContent={"right"}>
        <LoadingButton
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          onClick={submitMarketListing}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </Grid>
    </>
    // </FormControl>
  )
}
