import {
  MarketAggregateListingComposite,
  MarketMultiple,
} from "../datatypes/MarketListing"
import { Service } from "../datatypes/Order"
import { Contractor } from "../datatypes/Contractor"

interface FormattableListingType {
  type: string
  details: { title: string }
  listing: { listing_id: string }
}

export function formatListingSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

export function formatMarketUrl(listing: FormattableListingType) {
  const composite = listing as MarketAggregateListingComposite | undefined

  try {
    return listing?.type === "aggregate_composite"
      ? `/market/aggregate/${composite?.aggregate_id}/#/${formatListingSlug(
          listing.details.title,
        )}`
      : `/market/${listing?.listing?.listing_id}/#/${formatListingSlug(
          listing.details.title,
        )}`
  } catch (e) {
    console.log(listing, e)
    return ""
  }
}

export function formatMarketMultipleUrl(multiple: MarketMultiple) {
  return `/market/multiple/${multiple.multiple_id}/#/${formatListingSlug(
    multiple.details.title,
  )}`
}

export function formatServiceUrl(service: Service) {
  return `/order/service/${service.service_id}/#/${formatListingSlug(
    service.title,
  )}`
}

export function formatContractorUrl(contractor: Contractor) {
  return `/contractor/${contractor?.spectrum_id}/#/${formatListingSlug(
    contractor.name,
  )}`
}
