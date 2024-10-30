import { Link } from "react-router-dom"
import { Button, Grid } from "@mui/material"
import {
  CreateRounded,
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material"
import React, { useCallback, useContext } from "react"
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded"
import { ItemStockContext } from "../../views/market/ItemStock"
import { MarketListingUpdateBody } from "../../datatypes/MarketListing"
import { useUpdateMarketListing } from "../../store/market"
import LoadingButton from "@mui/lab/LoadingButton"

export function MarketActions() {
  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item>
          <Link
            to={"/market/create"}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Button
              color={"secondary"}
              startIcon={<CreateRounded />}
              variant={"contained"}
              size={"large"}
            >
              Create Listing
            </Button>
          </Link>
        </Grid>

        <Grid item>
          <Link
            to={"/market/cart"}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Button
              color={"primary"}
              startIcon={<ShoppingCartRoundedIcon />}
              variant={"contained"}
              size={"large"}
            >
              My Cart
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

export function ManageListingsActions() {
  const [selectedListings] = useContext(ItemStockContext)!

  const [updateListing, { isLoading }] = useUpdateMarketListing()
  const updateListingCallback = useCallback(
    async (body: MarketListingUpdateBody) => {
      selectedListings.forEach((listing_id) => {
        updateListing({
          listing_id,
          body,
        })
      })
    },
    [selectedListings, updateListing],
  )

  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item>
          <Link
            to={"/market/create"}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Button
              color={"secondary"}
              startIcon={<CreateRounded />}
              variant={"contained"}
              size={"large"}
            >
              Create Listing
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <LoadingButton
            color={"success"}
            startIcon={<RadioButtonCheckedRounded />}
            variant={"contained"}
            size={"large"}
            loading={isLoading}
            disabled={!selectedListings.length}
            onClick={() => {
              updateListingCallback({ status: "active" })
            }}
          >
            Activate Listings
          </LoadingButton>
        </Grid>

        <Grid item>
          <LoadingButton
            color={"error"}
            startIcon={<RadioButtonUncheckedRounded />}
            variant={"contained"}
            size={"large"}
            disabled={!selectedListings.length}
            loading={isLoading}
            onClick={() => {
              updateListingCallback({ status: "inactive" })
            }}
          >
            Deactivate Listings
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export function BuyOrderActions() {
  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item>
          <Link
            to={"/buyorder/create"}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Button
              color={"secondary"}
              startIcon={<CreateRounded />}
              variant={"contained"}
              size={"large"}
            >
              Create Buy Order
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}
