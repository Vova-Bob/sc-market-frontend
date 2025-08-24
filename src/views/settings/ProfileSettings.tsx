import React from "react"
import { useGetUserProfileQuery } from "../../store/profile"
import { AuthenticateRSI } from "../authentication/AuthenticateRSI"
import { ReVerifyProfile } from "./ReVerifyProfile"

export function ProfileSettings() {
  const { data: profile } = useGetUserProfileQuery()

  return profile?.rsi_confirmed ? <ReVerifyProfile /> : <AuthenticateRSI />
}
