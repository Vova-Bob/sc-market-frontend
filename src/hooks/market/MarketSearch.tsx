import React from "react"
import { useSearchParams } from "react-router-dom"

export interface MarketSearchState {
  sale_type?: string | undefined
  item_type?: string | undefined
  minCost?: number
  maxCost?: number | null
  quantityAvailable?: number
  query: string
  sort?: string | null | undefined
  status?: string
  index?: number
  page_size?: number
  listing_type?: string
}

export const MarketSearchContext = React.createContext<
  | [MarketSearchState, React.Dispatch<React.SetStateAction<MarketSearchState>>]
  | null
>(null)

export const useMarketSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const setSearchState = (searchState: MarketSearchState) => {
    const obj = {
      query: searchState.query || undefined,
      kind: searchState.sale_type === "any" ? undefined : searchState.sale_type,
      type: searchState.item_type === "any" ? undefined : searchState.item_type,
      quantityAvailable:
        searchState.quantityAvailable !== undefined &&
        searchState.quantityAvailable !== 1
          ? searchState.quantityAvailable.toString()
          : undefined!,
      minCost: searchState.minCost ? searchState.minCost.toString() : undefined,
      maxCost:
        searchState.maxCost != null
          ? searchState.maxCost.toString()
          : undefined,
      sort:
        searchState.sort !== "activity"
          ? searchState.sort || undefined
          : undefined,
      status: searchState.status || undefined,
      index: searchState.index === 0 ? undefined : searchState.index,
      page_size:
        searchState.page_size === 48 ? undefined : searchState.page_size,
    }

    setSearchParams(
      Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined),
      ) as {
        [k: string]: string
      },
    )
  }

  return [
    {
      sort: searchParams.get("sort") || "activity",
      sale_type: searchParams.get("kind") || undefined,
      item_type: searchParams.get("type") || undefined,
      quantityAvailable:
        searchParams.get("quantityAvailable") !== null
          ? +searchParams.get("quantityAvailable")!
          : 1,
      minCost: +searchParams.get("minCost")! || 0,
      maxCost: +searchParams.get("maxCost")! || undefined,
      query: searchParams.get("query") || "",
      status: searchParams.get("status") ? "active" : undefined,
      index: +searchParams.get("index")! ? 0 : undefined,
      page_size: searchParams.get("page_size")! ? 48 : undefined,
    } as MarketSearchState,
    setSearchState as (k: MarketSearchState) => void,
  ] as const
}
