import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  MarketAggregate,
  MarketListingType,
  UniqueListing,
} from "../../datatypes/MarketListing"

export function MarketList(props: {
  title?: string | null
  listings: (MarketListingType & { quantity: number })[]
}) {
  const listings = useMemo(
    () => props.listings.filter((l) => l),
    [props.listings],
  )

  return (
    <List
      subheader={
        props.title ? <ListSubheader>{props.title}</ListSubheader> : undefined
      }
      sx={{ width: "100%" }}
    >
      {listings.map((l, i) => (
        <ListItemButton
          component={Link}
          key={i}
          to={
            (l as MarketAggregate)?.details?.game_item_id
              ? `/market/aggregate/${
                  (l as MarketAggregate)?.details?.game_item_id
                }`
              : `/market/${(l as UniqueListing).listing.listing_id}`
          }
        >
          <ListItemAvatar>
            <Avatar
              variant={"rounded"}
              src={l?.photos[0]}
              alt={`Photo of ${l?.details?.title}`}
            />
          </ListItemAvatar>
          <ListItemText>
            {l.details?.title} (x{l.quantity})
          </ListItemText>
        </ListItemButton>
      ))}
    </List>
  )
}
