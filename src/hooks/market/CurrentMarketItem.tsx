import React from "react"
import { MarketListing, MarketListingType } from "../../datatypes/MarketListing"

export const CurrentMarketListingContext = React.createContext<
  [MarketListingType, () => void] | null
>(null)

export function useCurrentMarketListing<T>() {
  let val = React.useContext(CurrentMarketListingContext)
  if (val == null) {
    throw new Error(
      "Cannot use useCurrentMarketListing outside of CurrentMarketListingContext",
    )
  }
  return [val[0] as T, val[1]] as const
}
