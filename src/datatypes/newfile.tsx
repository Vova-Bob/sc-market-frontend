import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded"
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded"
import FlightRoundedIcon from "@mui/icons-material/FlightRounded"
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded"
import PublicRoundedIcon from "@mui/icons-material/PublicRounded"
import {
  CarRentalRounded,
  InfoRounded,
  LocalHospitalRounded,
} from "@mui/icons-material"
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded"
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"
import React from "react"
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded"
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded"
import SwordCrossIcon from "mdi-material-ui/SwordCross"
import TowTruckIcon from "mdi-material-ui/TowTruck"
import HydraulicOilTemperatureIcon from "mdi-material-ui/HydraulicOilTemperature"
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded"
import { DiceD20 } from "mdi-material-ui"

export type ContractKindIconKey = keyof typeof orderIcons
export type AlertColor = "success" | "info" | "warning" | "error"

export const contractorKindIcons = {
  freight: <LocalShippingRoundedIcon />,
  refuel: <LocalGasStationRoundedIcon />,
  repair: <HandymanRoundedIcon />,
  escort: <GppGoodRoundedIcon />,
  transport: <FlightRoundedIcon />,
  mining: <PublicRoundedIcon />,
  exploration: <ExploreRoundedIcon />,
  combat: <SwordCrossIcon />,
  salvage: <TowTruckIcon />,
  refining: <HydraulicOilTemperatureIcon />,
  construction: <ConstructionRoundedIcon />,
  social: <PeopleAltRoundedIcon />,
  roleplay: <DiceD20 />,
  medical: <LocalHospitalRounded />,
  intelligence: <InfoRounded />,
}

export type ContractorKindIconKey = keyof typeof contractorKindIcons

export interface AlertInterface {
  message: string
  severity: AlertColor
}

export interface Notification {
  read: boolean
  notification_id: string
  action: string
  entity_type: string
  entity:
    | ContractorInvite
    | Order
    | Contractor
    | MarketListing
    | MarketBid
    | OrderReview
    | OrderComment
    | OfferSession
  timestamp: string
  actors: MinimalUser[]
}

export interface AccountSettings {
  discord_order_share: boolean
  discord_public: boolean
}

export interface AccountSettingsBody {
  discord_order_share?: boolean
  discord_public?: boolean
}

export interface AvailabilitySelection {
  start: number
  finish: number
}

export interface AccountAvailabilityBody {
  contractor: string | null
  selections: AvailabilitySelection[]
}

export interface AccountAvailability {
  contractor: string | null
  selections: AvailabilitySelection[]
}

export interface UserProfileState {
  username: string
  display_name: string
  discord_username: string
  avatar: string
  role: "user" | "admin"
  contractors: ({ role: string } & MinimalContractor)[]
  balance: number
  rsi_confirmed?: boolean
  profile_description: string
  // notifications: Notification[],
  settings: AccountSettings
}

export interface OfferSessionStub {
  id: string
  contractor: MinimalContractor | null
  assigned_to: MinimalUser | null
  customer: MinimalUser
  status: string
  timestamp: string
  most_recent_offer: {
    template_name: string | null
    cost: string
    title: string
    payment_type: string
    count: number
  }
}

export interface OfferSession {
  id: string
  contractor: MinimalContractor | null
  assigned_to: MinimalUser | null
  customer: MinimalUser
  status: string
  timestamp: string
  offers: Offer[]
}

export interface Offer {
  id: string
  actor: MinimalUser | null
  session_id: string
  kind: string
  cost: string
  title: string
  description: string
  timestamp: string
  status: string
  collateral?: string | number | null
  template: Service | null
  market_listings: OfferMarketListing[]
  payment_type: "one-time" | "hourly" | "daily"
}

export interface CounterOfferBody {
  session_id: string
  title: string
  kind: string
  cost: string
  description: string
  template_id: string | null
  market_listings: { listing_id: string; quantity: number }[]
  payment_type: string
}

export interface OfferMarketListing {
  quantity: number
  listing_id: string
  listing: UniqueListing
}

export const orderIcons = {
  Support: <HandymanRoundedIcon />,
  Escort: <GppGoodRoundedIcon />,
  Transport: <FlightRoundedIcon />,
  Construction: <ConstructionRoundedIcon />,
  "Resource Acquisition": <PublicRoundedIcon />,
  Rental: <CarRentalRounded />,
  Delivery: <LocalShippingRoundedIcon />,
  Medical: <LocalHospitalRounded />,
  "Intelligence Services": <InfoRounded />,
  Misc: <MiscellaneousServicesRoundedIcon />,
  Custom: <MiscellaneousServicesRoundedIcon />,
}

export type OrderStatus =
  | "fulfilled"
  | "in-progress"
  | "not-started"
  | "cancelled"

export interface Order {
  order_id: string
  status: OrderStatus
  kind: keyof typeof orderIcons
  cost: number
  rush: boolean
  assigned_to: string | null
  contractor: string | null
  customer: string
  title: string
  description: string
  timestamp: string
  comments: OrderComment[]
  applicants: OrderApplicant[]
  market_listings?: OfferMarketListing[]
  customer_review?: OrderReview
  contractor_review?: OrderReview
  template_id?: string | null
  payment_type: "one-time" | "daily" | "hourly"
  availability?: {
    customer: AvailabilitySelection[]
    assigned: AvailabilitySelection[] | null
  }
  offer_session_id: string | null
}

export interface OrderApplicant {
  order_id: string
  user_applicant: MinimalUser | null
  org_applicant: MinimalContractor | null
  timestamp: number
  message: string
}

export interface OrderBody {
  title: string
  rush: boolean
  description: string
  kind: string
  collateral: number
  departure: string | null
  destination: string | null
  cost: number
  contractor?: string | null
  assigned_to?: string | null
  template_id?: string | null
  payment_type: "one-time" | "daily" | "hourly"
}

export interface ServiceBody {
  template_name: string
  template_description: string
  title: string
  rush: boolean
  description: string
  kind: string
  collateral: number
  departure: string | null
  destination: string | null
  cost: number
  payment_type: "one-time" | "daily" | "hourly"
  contractor?: string | null
  status: string
  photos: string[]
}

export interface Service {
  timestamp: string
  template_id: string
  template_name: string
  template_description: string
  title: string
  rush: boolean
  description: string
  kind: ContractKindIconKey
  collateral: number
  offer: number
  payment_type: "one-time" | "hourly" | "daily"
  departure: string | null
  destination: string | null
  cost: number
  contractor?: Contractor | null
  assigned_to?: string | null
  user?: User | null
  status: "active" | "inactive"
  photos: string[]
}

export interface OrderComment {
  author: User
  content: string
  timestamp: number
  comment_id: string
  order_id: string
}

export interface OrderReview {
  user_author: MinimalUser | null
  contractor_author: MinimalContractor | null
  content: string
  timestamp: number
  review_id: string
  order_id: string
  rating: number
}

export interface OrderTrendDatapoint {
  All: number
  Fulfilled: number
  "Not Started": number
  name: string
  "In-Progress": number
}

export function makeOrderTrend(): {
  data: OrderTrendDatapoint[]
  labels: string[]
} {
  const data = [
    {
      name: "Dec 11",
      All: 8,
      Fulfilled: 1,
      "Not Started": 3,
      "In-Progress": 4,
    },
    {
      name: "Dec 12",
      All: 12,
      Fulfilled: 5,
      "Not Started": 3,
      "In-Progress": 4,
    },
    {
      name: "Dec 13",
      All: 10,
      Fulfilled: 3,
      "Not Started": 2,
      "In-Progress": 5,
    },
    {
      name: "Dec 14",
      All: 7,
      Fulfilled: 3,
      "Not Started": 2,
      "In-Progress": 2,
    },
    {
      name: "Dec 15",
      All: 15,
      Fulfilled: 5,
      "Not Started": 5,
      "In-Progress": 5,
    },
  ]

  return {
    data: data,
    labels: ["All", "Fulfilled", "Not Started", "In-Progress"],
  }
}

export interface OrderStub {
  order_id: string
  contractor: MinimalContractor | null
  assigned_to: MinimalUser | null
  customer: MinimalUser
  status: OrderStatus
  timestamp: string
  template_name: string | null
  cost: string
  title: string
  payment_type: string
  count: number
}

export interface Ship {
  image: string
  name: ShipName
  size: "ground" | "snub" | "small" | "medium" | "large" | "capital"
  kind:
    | "combat"
    | "freight"
    | "refuel"
    | "repair"
    | "mining"
    | "transport"
    | "exploration"
  manufacturer: string
  condition: "flight-ready" | "in-repair" | "awaiting-repair" | "in-concept"
  // active: boolean
  ship_id: number
}

export type ShipName =
  | "Avenger Stalker"
  | "Avenger Titan"
  | "Avenger Titan Renegade"
  | "Avenger Warlock"
  | "Eclipse"
  | "Gladius"
  | "Gladius Valiant"
  | "Hammerhead"
  | "Hammerhead Best In Show Edition"
  | "Idris-M"
  | "Idris-P"
  | "Javelin"
  | "Nautilus"
  | "Nautilus Solstice Edition"
  | "Reclaimer"
  | "Reclaimer Best In Show Edition"
  | "Redeemer"
  | "Retaliator Base"
  | "Retaliator Bomber"
  | "Sabre"
  | "Sabre Comet"
  | "Sabre Raven"
  | "Vanguard Harbinger"
  | "Vanguard Hoplite"
  | "Vanguard Sentinel"
  | "Vanguard Warden"
  | "Vulcan"
  | "Arrow"
  | "Ballista"
  | "Ballista Dunestalker"
  | "Ballista Snowblind"
  | "C8 Pisces"
  | "Carrack"
  | "Crucible"
  | "F7C Hornet"
  | "F7C Hornet Wildfire"
  | "F7C-M Super Hornet"
  | "F7C-M Super Hornet Heartseeker"
  | "F7C-R Hornet Tracker"
  | "F7C-S Hornet Ghost"
  | "Gladiator"
  | "Hawk"
  | "Hurricane"
  | "Terrapin"
  | "Valkyrie"
  | "Valkyrie Liberator Edition"
  | "Khartu-al"
  | "Nox"
  | "Nox Kue"
  | "San tok.Yāi"
  | "Mole"
  | "Mole Carbon Edition"
  | "Mole Talus Edition"
  | "MPUV-1C"
  | "MPUV-1P"
  | "SRV"
  | "Defender"
  | "Merchantman"
  | "Mustang Alpha"
  | "Mustang Alpha Vindicator"
  | "Mustang Beta"
  | "Mustang Delta"
  | "Mustang Gamma"
  | "Mustang Omega"
  | "Nomad"
  | "Pioneer"
  | "A2 Hercules"
  | "Ares Inferno"
  | "Ares Ion"
  | "C2 Hercules"
  | "Genesis Starliner"
  | "M2 Hercules"
  | "Mercury Star Runner"
  | "Buccaneer"
  | "Caterpillar"
  | "Caterpillar Best In Show Edition"
  | "Caterpillar Pirate Edition"
  | "Corsair"
  | "Cutlass Black"
  | "Cutlass Black Best In Show Edition"
  | "Cutlass Blue"
  | "Cutlass Red"
  | "Dragonfly Black"
  | "Herald"
  | "Kraken"
  | "Kraken Privateer"
  | "Vulture"
  | "Blade"
  | "Glaive"
  | "Prowler"
  | "Talon"
  | "Talon Shrike"
  | "Railen"
  | "PTV"
  | "ROC"
  | "P-52 Merlin"
  | "P-72 Archimedes"
  | "P-72 Archimedes Emerald"
  | "Enveador"
  | "Freelancer"
  | "Freelancer DUR"
  | "Freelancer MAX"
  | "Freelancer MIS"
  | "Hull A"
  | "Hull B"
  | "Hull C"
  | "Hull D"
  | "Hull E"
  | "Prospector"
  | "Razor"
  | "Razor EX"
  | "Razor LX"
  | "Reliant Kore"
  | "Reliant Mako"
  | "Reliant Sen"
  | "Reliant Tana"
  | "Starfarer"
  | "Starfarer Gemini"
  | "100i"
  | "125a"
  | "135c"
  | "300i"
  | "315p"
  | "325a"
  | "350r"
  | "600i Explorer"
  | "600i Touring"
  | "85X"
  | "890 Jump"
  | "G12"
  | "G12-A"
  | "G12-R"
  | "M50"
  | "X1 Base"
  | "X1 Force"
  | "X1 Velocity"
  | "Apollo Medivac"
  | "Apollo Triage"
  | "Aurora CL"
  | "Aurora ES"
  | "Aurora LN"
  | "Aurora LX"
  | "Aurora MR"
  | "Constellation Andromeda"
  | "Constellation Aquila"
  | "Constellation Phoenix"
  | "Constellation Phoenix Emerald"
  | "Constellation Taurus"
  | "Mantis"
  | "Orion"
  | "Perseus"
  | "Polaris"
  | "Ursa Rover"
  | "Cyclone"
  | "Cyclone AA"
  | "Cyclone RC"
  | "Cyclone RN"
  | "Cyclone TR"
  | "Nova"
  | "Ranger CV"
  | "Ranger RC"
  | "Ranger TR"
  | "RAFT"
  | "Cutlass Steel"
  | "Quadette"
  | "Endeavor"

export const shipList: ShipName[] = [
  "Avenger Stalker",
  "Avenger Titan",
  "Avenger Titan Renegade",
  "Avenger Warlock",
  "Eclipse",
  "Gladius",
  "Gladius Valiant",
  "Hammerhead",
  "Hammerhead Best In Show Edition",
  "Idris-M",
  "Idris-P",
  "Javelin",
  "Nautilus",
  "Nautilus Solstice Edition",
  "Reclaimer",
  "Reclaimer Best In Show Edition",
  "Redeemer",
  "Retaliator Base",
  "Retaliator Bomber",
  "Sabre",
  "Sabre Comet",
  "Sabre Raven",
  "Vanguard Harbinger",
  "Vanguard Hoplite",
  "Vanguard Sentinel",
  "Vanguard Warden",
  "Vulcan",
  "Arrow",
  "Ballista",
  "Ballista Dunestalker",
  "Ballista Snowblind",
  "C8 Pisces",
  "Carrack",
  "Crucible",
  "F7C Hornet",
  "F7C Hornet Wildfire",
  "F7C-M Super Hornet",
  "F7C-M Super Hornet Heartseeker",
  "F7C-R Hornet Tracker",
  "F7C-S Hornet Ghost",
  "Gladiator",
  "Hawk",
  "Hurricane",
  "Terrapin",
  "Valkyrie",
  "Valkyrie Liberator Edition",
  "Khartu-al",
  "Nox",
  "Nox Kue",
  "San tok.Yāi",
  "Mole",
  "Mole Carbon Edition",
  "Mole Talus Edition",
  "MPUV-1C",
  "MPUV-1P",
  "SRV",
  "Defender",
  "Merchantman",
  "Mustang Alpha",
  "Mustang Alpha Vindicator",
  "Mustang Beta",
  "Mustang Delta",
  "Mustang Gamma",
  "Mustang Omega",
  "Nomad",
  "Pioneer",
  "A2 Hercules",
  "Ares Inferno",
  "Ares Ion",
  "C2 Hercules",
  "Genesis Starliner",
  "M2 Hercules",
  "Mercury Star Runner",
  "Buccaneer",
  "Caterpillar",
  "Caterpillar Best In Show Edition",
  "Caterpillar Pirate Edition",
  "Corsair",
  "Cutlass Black",
  "Cutlass Black Best In Show Edition",
  "Cutlass Blue",
  "Cutlass Red",
  "Dragonfly Black",
  "Herald",
  "Kraken",
  "Kraken Privateer",
  "Vulture",
  "Blade",
  "Glaive",
  "Prowler",
  "Talon",
  "Talon Shrike",
  "Railen",
  "PTV",
  "ROC",
  "P-52 Merlin",
  "P-72 Archimedes",
  "P-72 Archimedes Emerald",
  "Enveador",
  "Freelancer",
  "Freelancer DUR",
  "Freelancer MAX",
  "Freelancer MIS",
  "Hull A",
  "Hull B",
  "Hull C",
  "Hull D",
  "Hull E",
  "Prospector",
  "Razor",
  "Razor EX",
  "Razor LX",
  "Reliant Kore",
  "Reliant Mako",
  "Reliant Sen",
  "Reliant Tana",
  "Starfarer",
  "Starfarer Gemini",
  "100i",
  "125a",
  "135c",
  "300i",
  "315p",
  "325a",
  "350r",
  "600i Explorer",
  "600i Touring",
  "85X",
  "890 Jump",
  "G12",
  "G12-A",
  "G12-R",
  "M50",
  "X1 Base",
  "X1 Force",
  "X1 Velocity",
  "Apollo Medivac",
  "Apollo Triage",
  "Aurora CL",
  "Aurora ES",
  "Aurora LN",
  "Aurora LX",
  "Aurora MR",
  "Constellation Andromeda",
  "Constellation Aquila",
  "Constellation Phoenix",
  "Constellation Phoenix Emerald",
  "Constellation Taurus",
  "Mantis",
  "Orion",
  "Perseus",
  "Polaris",
  "Ursa Rover",
  "Cyclone",
  "Cyclone AA",
  "Cyclone RC",
  "Cyclone RN",
  "Cyclone TR",
  "Nova",
  "Ranger CV",
  "Ranger RC",
  "Ranger TR",
  "RAFT",
  "Cutlass Steel",
  "Quadette",
  "Endeavor",
]

export interface ActiveDelivery {
  location: string
  departure: string
  destination: string
  status: "OK" | "Damaged" | "Low Fuel" | "Under Attack" | "Offline"
  progress: number
  id: number
}

export function makeActiveDeliveries(): ActiveDelivery[] {
  return [
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 30,
      id: 0,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 30,
      id: 1,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 20,
      id: 2,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 20,
      id: 3,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 4,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 5,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 6,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 7,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 8,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 9,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Low Fuel",
      progress: 30,
      id: 10,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 11,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Offline",
      progress: 70,
      id: 12,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 13,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 14,
    },
  ]
}

export const item_types = [
  "Armor",
  "Clothing",
  "Weapon",
  "Paint",
  "Bundle",
  "Flair",
  "Addon",
  "Consumable",
  "Other",
] as const
export const item_types_lower = [
  "armor",
  "clothing",
  "weapon",
  "paint",
  "bundle",
  "flair",
  "addon",
  "consumable",
  "other",
] as const

export type ItemType = (typeof item_types_lower)[number]

export type SellerListingType =
  | UniqueListing
  | MarketMultiple
  | MarketAggregateListingComposite
  | MarketMultipleListingComposite

export type BaseListingType =
  | UniqueListing
  | MarketAggregateListingComposite
  | MarketMultipleListingComposite
  | MarketMultipleListing

export type MarketListingType =
  | SellerListingType
  | MarketAggregate
  | UniqueListing
  | MarketAggregateListingComposite
  | MarketMultiple
  | MarketMultipleListingComposite
  | MarketMultipleListing

export interface MarketListing {
  listing_id: string
  sale_type: "auction" | "sale"
  price: number
  timestamp: number
  quantity_available: number
  status: string
  user_seller?: MinimalUser | null
  contractor_seller?: MinimalContractor | null
  orders?: Order[] | null
  expiration: number
}

export interface UniqueListing {
  type: "unique"
  details: ListingDetails
  listing: MarketListing
  accept_offers: boolean
  photos: string[]
  offers?: MarketOffer[]
  bids?: MarketBid[]
  auction_details?: {
    listing_id: string
    status: string
    minimum_bid_increment: number
    end_time: number
  }
}

export interface MinimalAggregate {
  aggregate_id: string
  wiki_id: string | number
  details: ListingDetails
}

export interface BuyOrder {
  aggregate_id: string
  buy_order_id: string
  quantity: number
  price: number
  buyer: MinimalUser
  expiry: string
  fulfilled_timestamp: string
}

export interface MarketAggregate {
  type: "aggregate"
  details: ListingDetails
  photos: string[]
  listings: MarketAggregateListing[]
  buy_orders: BuyOrder[]
}

export interface MarketMultipleListingComposite {
  type: "multiple_listing"
  multiple_id: string | number
  details: ListingDetails
  listing: MarketListing
  photos: string[]
}

export interface MarketMultipleListing {
  type: "multiple_listing"
  multiple_id: string | number
  details: ListingDetails
  listing: MarketListing
  photos: string[]
}

export interface MarketMultiple {
  type: "multiple"
  multiple_id: string
  details: ListingDetails
  photos: string[]
  default_listing: MarketMultipleListing
  listings: MarketMultipleListing[]
  contractor_seller: MinimalContractor | null
  user_seller: MinimalUser | null
}

export interface ListingDetails {
  details_id: string
  item_type: string
  title: string
  description: string
  item_name: string | null
  game_item_id: string | null
}

export interface MarketAggregateListingComposite {
  type: "aggregate_composite"
  listing: MarketListing
  aggregate_id: string
  aggregate: {
    aggregate_id: string
    wiki_id: number
    details_id: string
  }
  details: ListingDetails
  photos: string[]
}

export interface MarketAggregateListing {
  aggregate_id: string | number
  listing_id: string
  user_seller?: MinimalUser | null
  contractor_seller?: MinimalContractor | null
  price: number
  timestamp: number
  quantity_available: number
  status: string
}

// export interface MarketAggregateListingComposite {
//     aggregate_id: string | number,
//     listing_id: string,
//     user_seller?: MinimalUser | null,
//     contractor_seller?: MinimalContractor | null,
//     price: number,
//     timestamp: number,
//     quantity_available: number,
//     status: string,
//     aggregate: MarketAggregate
// }

export interface MarketOffer {
  offer_id: string
  user: MinimalUser | null
  contractor: MinimalContractor | null
  listing_id: string
  quantity: number
  timestamp: number
  offer: number
}

export interface MarketBid {
  bid_id: string
  user_bidder: MinimalUser | null
  contractor_bidder: MinimalContractor | null
  listing_id: string
  timestamp: number
  bid: number
}

export interface MarketListingBody {
  price: number
  title: string
  description: string
  sale_type: string
  item_type: string
  item_name: string | null
  quantity_available: number
  photos: string[]
  minimum_bid_increment: number
  internal: boolean
  status: string
  end_time: Date | null
}

export interface MarketBuyOrderBody {
  price: number
  quantity: number
  game_item_id: string | null
  expiry: Date
}

export interface MarketMultipleBody {
  title: string
  description: string
  item_type: string
  default_listing_id: string
  listings: string[]
}

export interface AggregateMarketListingBody {
  price: number
  quantity_available: number
  wiki_id: number | string
  status: string
  internal: boolean
}

export interface AggregateMarketListing {
  price: number
  quantity_available: number
  aggregate_id: number | string
}

export interface MarketListingUpdateBody {
  status?: string
  price?: number
  title?: string
  description?: string
  item_type?: string
  item_name?: string | null
  quantity_available?: number
  photos?: string[]
  minimum_bid_increment?: number
}

export interface AggregateListingUpdateBody {
  title?: string
  description?: string
  photo?: string
}

// {
//     title: string,
//     description: string,
//     saleType: string,
//     itemType: string,
//     currentPrice: number,
//     quantityAvailable: number
// }

// export function makeMarketListings(): MarketListing[] {
//     return [
//         {
//             price: 100000,
//             kind: "auction",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 0,
//             rating: 4.5
//         },
//         {
//             price: 133134,
//             kind: "auction",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 1,
//             rating: 4.5
//         },
//         {
//             price: 200810,
//             kind: "auction",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 2,
//             rating: 4.5
//         },
//         {
//             price: 50000,
//             kind: "service",
//             title: "Drive Overclocking",
//             description: "Hand overclocking drives",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 3,
//             rating: 4.5
//         },
//         {
//             price: 2000,
//             kind: "service",
//             title: "Drive Recycling",
//             description: "Hand recycled drives",
//             seller: "Henry",
//             photo: "https://media.robertsspaceindustries.com/wj92rqzvhnecb/source.jpg",
//             listing_id: 4,
//             rating: 4.5
//         },
//         {
//             price: 500000,
//             kind: "sale",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 5,
//             rating: 4.5
//         },
//         {
//             price: 500000,
//             kind: "sale",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 6,
//             rating: 4.5
//         },
//         {
//             price: 500000,
//             kind: "sale",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 7,
//             rating: 4.5
//         },
//         {
//             price: 500000,
//             kind: "sale",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 8,
//             rating: 4.5
//         },
//         {
//             price: 500000,
//             kind: "sale",
//             title: "TS-2 Drive Overclocked",
//             description: "Hand overclocked TS-2 drive",
//             seller: "Henry",
//             photo: "https://starcitizen.tools/images/6/6b/QuantumDrive-WETK-TS2.jpg",
//             listing_id: 9,
//             rating: 4.5
//         },
//     ]
// }

export interface GameItemCategory {
  category: string
  subcategory: string
}

export interface GameItem {
  type: string
  name: string
  id: string
}

export interface Chat {
  chat_id: string
  participants: { username: string; avatar: string }[]
  messages: Message[]
  order_id: string | null
}

export interface Message {
  author: string | null
  content: string
  timestamp: number
}

// export function makeChats(): Chat[] {
//     return [
//         {
//             chat_id: '0',
//             participants: ['Pumpkintitan', 'Henry'],
//             messages: [
//                 {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                 {author: "Henry", content: "Hello", timestamp: 1640736494},
//             ]
//         },
//         {
//             chat_id: '1',
//             participants: ['Pumpkintitan', 'Bridge4', 'Henry'],
//             messages:
//                 [
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//
//                 ]
//         },
//         {
//             chat_id: '2',
//             participants: ['Pumpkintitan', 'Bridge4', 'Henry', 'John', 'Steve'],
//             messages: [
//                 {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                 {author: "Henry", content: "Hello", timestamp: 1640735494},
//                 {author: "Bridge4", content: "Hello", timestamp: 1640736494}
//             ]
//         },
//     ]
// }

export interface Commodity {
  code: string
  name: string
  trade_price_sell: number
  kind:
    | "Agricultural"
    | "Waste"
    | "Metal"
    | "Drug"
    | "Natural"
    | "Mineral"
    | "Halogen"
    | "Temporary"
    | "Scrap"
    | "Gas"
    | "Vice"
    | "Medical"
    | "Food"

  [key: string]: string | number
}

/*
      "code": "ACSU",
      "name": "Agricultural Supplies",
      "kind": "Agricultural",
      "trade_price_buy": 1.05,
      "trade_price_sell": 1.16,
      "date_added": 1608949515,
      "date_modified": 1625097602
 */

export function makeCommodities(): Commodity[] {
  return [
    {
      code: "ACSU",
      name: "Agricultural Supplies",
      kind: "Agricultural",
      trade_price_buy: 1,
      trade_price_sell: 1.11,
      date_added: 1608949515,
      date_modified: 1639710002,
    },
    {
      code: "AGRI",
      name: "Agricium",
      kind: "Metal",
      trade_price_buy: 23.78,
      trade_price_sell: 27.5,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "AGRW",
      name: "Agricium (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 13.75,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "ALTX",
      name: "Altruciatoxin",
      kind: "Drug",
      trade_price_buy: 12.12,
      trade_price_sell: 0,
      date_added: 0,
      date_modified: 1624645707,
    },
    {
      code: "ALUM",
      name: "Aluminum",
      kind: "Metal",
      trade_price_buy: 1.13,
      trade_price_sell: 1.3,
      date_added: 1608949515,
      date_modified: 1639710002,
    },
    {
      code: "ALUW",
      name: "Aluminum (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 0.67,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "AMIO",
      name: "Amioshi Plague",
      kind: "Natural",
      trade_price_buy: 0,
      trade_price_sell: 13.2,
      date_added: 1620497784,
      date_modified: 1639364403,
    },
    {
      code: "APHO",
      name: "Aphorite",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 152.5,
      date_added: 1608949515,
      date_modified: 1639407602,
    },
    {
      code: "ASTA",
      name: "Astatine",
      kind: "Halogen",
      trade_price_buy: 7.63,
      trade_price_sell: 9,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "AVEQ",
      name: "Audio Visual Equipment",
      kind: "Temporary",
      trade_price_buy: 249.08,
      trade_price_sell: 252.4,
      date_added: 1621264403,
      date_modified: 1623183211,
    },
    {
      code: "BERW",
      name: "Beryl (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 2.21,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "BERY",
      name: "Beryl",
      kind: "Mineral",
      trade_price_buy: 4.09,
      trade_price_sell: 4.35,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "BEXA",
      name: "Bexalite",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 44,
      date_added: 1608949515,
      date_modified: 1638414002,
    },
    {
      code: "BEXW",
      name: "Bexalite (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 20.33,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "BORA",
      name: "Borase",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 35.21,
      date_added: 1608949515,
      date_modified: 1639105202,
    },
    {
      code: "BORW",
      name: "Borase (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 16.29,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "CHLO",
      name: "Chlorine",
      kind: "Halogen",
      trade_price_buy: 1.3,
      trade_price_sell: 1.71,
      date_added: 1608949515,
      date_modified: 1639710002,
    },
    {
      code: "CMAT",
      name: "Construction Materials",
      kind: "Temporary",
      trade_price_buy: 124.55,
      trade_price_sell: 126.43,
      date_added: 1621264661,
      date_modified: 1623172455,
    },
    {
      code: "COMP",
      name: "Compboard",
      kind: "Scrap",
      trade_price_buy: 0,
      trade_price_sell: 22.5,
      date_added: 0,
      date_modified: 1639645202,
    },
    {
      code: "COPP",
      name: "Copper",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 6.15,
      date_added: 1608949515,
      date_modified: 1639796402,
    },
    {
      code: "COPW",
      name: "Copper (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 2.87,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "CORU",
      name: "Corundum",
      kind: "Mineral",
      trade_price_buy: 2.32,
      trade_price_sell: 2.71,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "CORW",
      name: "Corundum (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 1.35,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "DIAM",
      name: "Diamond",
      kind: "Metal",
      trade_price_buy: 6.22,
      trade_price_sell: 7.35,
      date_added: 1608949515,
      date_modified: 1639710002,
    },
    {
      code: "DIAW",
      name: "Diamond (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 3.68,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "DISP",
      name: "Distilled Spirits",
      kind: "Vice",
      trade_price_buy: 4.45,
      trade_price_sell: 5.57,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "DOLI",
      name: "Dolivine",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 130,
      date_added: 1608949515,
      date_modified: 1639407602,
    },
    {
      code: "ETAM",
      name: "E'tam",
      kind: "Drug",
      trade_price_buy: 90.03,
      trade_price_sell: 102.92,
      date_added: 0,
      date_modified: 1631107947,
    },
    {
      code: "FIRE",
      name: "Fireworks",
      kind: "Temporary",
      trade_price_buy: 1.27,
      trade_price_sell: 13.8,
      date_added: 1621264584,
      date_modified: 1623183211,
    },
    {
      code: "FLUO",
      name: "Fluorine",
      kind: "Halogen",
      trade_price_buy: 2.34,
      trade_price_sell: 2.95,
      date_added: 1608949515,
      date_modified: 1639710002,
    },
    {
      code: "GMED",
      name: "Golden Medmon",
      kind: "Natural",
      trade_price_buy: 0,
      trade_price_sell: 19.8,
      date_added: 1620496195,
      date_modified: 1639364403,
    },
    {
      code: "GOLD",
      name: "Gold",
      kind: "Metal",
      trade_price_buy: 5.45,
      trade_price_sell: 6.41,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "GOLW",
      name: "Gold (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 3.2,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "HADA",
      name: "Hadanite",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 275,
      date_added: 1608949515,
      date_modified: 1639407602,
    },
    {
      code: "HELI",
      name: "Helium",
      kind: "Gas",
      trade_price_buy: 1.87,
      trade_price_sell: 2.2,
      date_added: 1621264799,
      date_modified: 1623183211,
    },
    {
      code: "HEPH",
      name: "Hephaestanite",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 15.85,
      date_added: 1608949515,
      date_modified: 1638414002,
    },
    {
      code: "HEPW",
      name: "Hephaestanite (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 7.38,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "HYDR",
      name: "Hydrogen",
      kind: "Gas",
      trade_price_buy: 0.92,
      trade_price_sell: 1.12,
      date_added: 1608949515,
      date_modified: 1639623603,
    },
    {
      code: "IODI",
      name: "Iodine",
      kind: "Halogen",
      trade_price_buy: 0.36,
      trade_price_sell: 0.45,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "LARA",
      name: "Laranite",
      kind: "Metal",
      trade_price_buy: 27.08,
      trade_price_sell: 30.94,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "LARW",
      name: "Laranite (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 15.51,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "MAZE",
      name: "Maze",
      kind: "Drug",
      trade_price_buy: 0,
      trade_price_sell: 0,
      date_added: 0,
      date_modified: 0,
    },
    {
      code: "MEDS",
      name: "Medical Supplies",
      kind: "Medical",
      trade_price_buy: 16.96,
      trade_price_sell: 17.6,
      date_added: 1608949515,
      date_modified: 1639623603,
    },
    {
      code: "NEON",
      name: "Neon",
      kind: "Drug",
      trade_price_buy: 72.45,
      trade_price_sell: 85.16,
      date_added: 0,
      date_modified: 1631107947,
    },
    {
      code: "PITA",
      name: "Pitambu",
      kind: "Food",
      trade_price_buy: 0,
      trade_price_sell: 16.5,
      date_added: 1624071081,
      date_modified: 1639364403,
    },
    {
      code: "PRFO",
      name: "Processed Food",
      kind: "Food",
      trade_price_buy: 1.28,
      trade_price_sell: 1.53,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "PROT",
      name: "Prota",
      kind: "Natural",
      trade_price_buy: 0,
      trade_price_sell: 13.81,
      date_added: 1639327415,
      date_modified: 1639364403,
    },
    {
      code: "QUAN",
      name: "Quantanium",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 88,
      date_added: 1608949515,
      date_modified: 1639796402,
    },
    {
      code: "QUAR",
      name: "Quartz",
      kind: "Metal",
      trade_price_buy: 1.26,
      trade_price_sell: 1.55,
      date_added: 1608949515,
      date_modified: 1639796403,
    },
    {
      code: "QUAW",
      name: "Quantanium (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 44,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "QUAW",
      name: "Quartz (Raw)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 0.78,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "RDUN",
      name: "Ranta Dung",
      kind: "Agricultural",
      trade_price_buy: 0,
      trade_price_sell: 44,
      date_added: 1620496320,
      date_modified: 1639364403,
    },
    {
      code: "RTPO",
      name: "Revenant Tree Pollen",
      kind: "Vice",
      trade_price_buy: 1.36,
      trade_price_sell: 1.69,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "SCRA",
      name: "Scrap",
      kind: "Scrap",
      trade_price_buy: 1.36,
      trade_price_sell: 1.86,
      date_added: 1608949515,
      date_modified: 1639796402,
    },
    {
      code: "SLAM",
      name: "SLAM",
      kind: "Drug",
      trade_price_buy: 132.96,
      trade_price_sell: 0,
      date_added: 0,
      date_modified: 1631107947,
    },
    {
      code: "STIM",
      name: "Stims",
      kind: "Vice",
      trade_price_buy: 2.88,
      trade_price_sell: 3.83,
      date_added: 1608949515,
      date_modified: 1639623603,
    },
    {
      code: "SVRS",
      name: "Souvenirs",
      kind: "Temporary",
      trade_price_buy: 9.71,
      trade_price_sell: 10.58,
      date_added: 1621264705,
      date_modified: 1623183211,
    },
    {
      code: "TARA",
      name: "Taranite",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 35.21,
      date_added: 1608949515,
      date_modified: 1639796403,
    },
    {
      code: "TARW",
      name: "Taranite (Raw)",
      kind: "Mineral",
      trade_price_buy: 0,
      trade_price_sell: 16.29,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "TITA",
      name: "Titanium",
      kind: "Metal",
      trade_price_buy: 7.87,
      trade_price_sell: 8.78,
      date_added: 1608949515,
      date_modified: 1639688402,
    },
    {
      code: "TITW",
      name: "Titanium (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 4.47,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "TUNG",
      name: "Tungsten",
      kind: "Metal",
      trade_price_buy: 3.61,
      trade_price_sell: 4.06,
      date_added: 1608949515,
      date_modified: 1639796403,
    },
    {
      code: "TUNW",
      name: "Tungsten (Ore)",
      kind: "Metal",
      trade_price_buy: 0,
      trade_price_sell: 2.05,
      date_added: 1608949515,
      date_modified: 0,
    },
    {
      code: "WAST",
      name: "Waste",
      kind: "Waste",
      trade_price_buy: 0.01,
      trade_price_sell: 0.01,
      date_added: 1608949515,
      date_modified: 1624053604,
    },
    {
      code: "WIDO",
      name: "WiDoW",
      kind: "Drug",
      trade_price_buy: 108.15,
      trade_price_sell: 123.46,
      date_added: 0,
      date_modified: 1631107947,
    },
  ]
}

export interface DiscordSettings {
  guild_avatar: string
  guild_name: string
  channel_name: string
  official_server_id: string
  discord_thread_channel_id: string
}

export interface Rating {
  avg_rating: number
  rating_count: number
  streak: number
  total_orders: number
}

export interface Contractor {
  kind: "independent" | "organization"
  avatar: string
  banner: string
  site_url?: string
  rating: Rating
  size: number
  name: string
  description: string
  fields: ContractorKindIconKey[]
  spectrum_id: string
  members: {
    username: string
    roles: string[]
  }[]
  roles?: ContractorRole[]
  default_role?: string
  owner_role?: string
  balance?: number
}

export interface MinimalContractor {
  avatar: string
  name: string
  spectrum_id: string
  rating: Rating
}

export interface UserContractorState {
  kind: "independent" | "organization"
  avatar: string
  site_url?: string
  rating: Rating
  size: string
  name: string
  description: string
  fields: ContractorKindIconKey[]
  spectrum_id: string
  members: {
    username: string
    roles: string[]
  }[]
  balance: number
  roles?: ContractorRole[]
}

export interface OrderWebhook {
  webhook_id: string
  name: string
  webhook_url: string
  actions: string[]
}

export interface ContractorInviteCode {
  invite_id: string
  max_uses: number
  times_used: number
}

export interface ContractorInvite {
  spectrum_id: string
  message: string
}

export interface ContractorRole {
  contractor_id: string
  name: string
  position: number
  role_id: string
  manage_roles: boolean
  manage_orders: boolean
  kick_members: boolean
  manage_invites: boolean
  manage_org_details: boolean
  manage_stock: boolean
  manage_market: boolean
  manage_recruiting: boolean
  manage_webhooks: boolean
}

export interface Transaction {
  transaction_id: string
  kind: "Payment" | "Purchase" | "Order" | "Withdrawal"
  timestamp: Date
  amount: number
  status: "Completed" | "Pending" | "Cancelled"
  contractor_sender_id: string
  contractor_recipient_id: string
  user_sender_id: string
  user_recipient_id: string
  note: string
}

export interface TransactionBody {
  amount: number
  contractor_recipient_id?: string | null
  user_recipient_id?: string | null
  note: string
}

// export function makeTransactions(): Transaction[] {
//     return [
//         {
//             id: 0,
//             kind: "Withdrawal",
//             date: new Date(),
//             status: "Pending",
//             recipient: "External Account",
//             sender: "DEICOMPANY",
//             amount: 167740
//         },
//         {
//             id: 1,
//             kind: "Payment",
//             date: new Date(1640468052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "UEXCORP",
//             amount: 1500000
//         },
//         {
//             id: 2,
//             kind: "Purchase",
//             date: new Date(1640338052 * 1000),
//             status: "Cancelled",
//             recipient: "DEICOMPANY",
//             sender: "Henry",
//             amount: 32000
//         },
//         {
//             id: 3,
//             kind: "Order",
//             date: new Date(1640218052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Henry",
//             amount: 61200
//         },
//         {
//             id: 4,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 5,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 6,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 7,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 8,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 9,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 10,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 11,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 12,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 13,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//         {
//             id: 14,
//             kind: "Order",
//             date: new Date(1640108052 * 1000),
//             status: "Completed",
//             recipient: "DEICOMPANY",
//             sender: "Pumpkintitan",
//             amount: 33000
//         },
//     ]
// }

export interface CartItem {
  listing_id: string
  quantity: number
  price?: number
  aggregate_id?: number | string
  type: string
}

export interface CartSeller {
  user_seller_id?: string | null
  contractor_seller_id?: string | null
  items: CartItem[]
  note?: string
}

export type Cart = CartSeller[]

export interface OrgReview {
  username: string
  rating: number
  message: string
  org_id: string
}

export function makeOrgReviews(): OrgReview[] {
  return [
    {
      username: "Henry",
      rating: 5,
      message: "They did a great job",
      org_id: "DEICOMPANY",
    },
    {
      username: "Pumpkintitan",
      rating: 2.5,
      message: "They did a great job",
      org_id: "DEICOMPANY",
    },
    {
      username: "Bridge4",
      rating: 2.0,
      message: "Terrible delivery, they ate some of my fries",
      org_id: "DEICOMPANY",
    },
    {
      username: "John",
      rating: 3.5,
      message: "They did a great job",
      org_id: "DEICOMPANY",
    },
  ]
}

export interface User {
  username: string
  display_name: string
  orders: number
  spent: number
  avatar: string
  banner: string
  // [key: string]: string | number
  contractors: { spectrum_id: string; role: string; name: string }[]
  profile_description: string
  rating: Rating
  discord_profile?: {
    id: string
    discriminator: string
    username: string
  }
  created_at?: number
}

export interface MinimalUser {
  username: string
  display_name: string
  avatar: string
  rating: Rating
  discord_profile?: {
    id: string
    discriminator: string
    username: string
  }
}
