import { Rating } from "./Contractor"

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
  market_order_template: string
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
