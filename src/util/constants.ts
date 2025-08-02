import SCMarketLogo from "../assets/scmarket-logo.png"

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost"

export const defaultAvatar = SCMarketLogo

export const DISCORD_INVITE = "https://discord.com/invite/N4Gy8py8J4"

export const PAYMENT_TYPES = [
  { value: "one-time", translationKey: "paymentTypes.one_time" },
  { value: "hourly", translationKey: "paymentTypes.hourly" },
  { value: "daily", translationKey: "paymentTypes.daily" },
  { value: "unit", translationKey: "paymentTypes.unit" },
  { value: "box", translationKey: "paymentTypes.box" },
  { value: "scu", translationKey: "paymentTypes.scu" },
  { value: "cscu", translationKey: "paymentTypes.cscu" },
  { value: "mscu", translationKey: "paymentTypes.mscu" },
] as const
