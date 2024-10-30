import React from "react"
import { MarketAggregate } from "../../datatypes/MarketListing"

export const CurrentMarketAggregateContext = React.createContext<
  [MarketAggregate, () => void] | null
>(null)

export const useCurrentMarketAggregate = () => {
  let val = React.useContext(CurrentMarketAggregateContext)
  if (val == null) {
    throw new Error(
      "Cannot use useCurrentMarketAggregate outside of CurrentMarketAggregateContext",
    )
  }
  return val
}
