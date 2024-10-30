import SCMarketLogo from "../assets/scmarket-logo.png"

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost"

export const defaultAvatar = SCMarketLogo
