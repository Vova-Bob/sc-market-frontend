import { Navigate, Outlet, RouteProps, useLocation } from "react-router-dom"
import React, { useMemo } from "react"
import LoadingBar from "react-top-loading-bar"
import { useGetUserProfileQuery } from "../../store/profile"
import { BACKEND_URL } from "../../util/constants"
import { useGetContractorBySpectrumIDQuery } from "../../store/contractor"
import { useCookies } from "react-cookie"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { has_permission } from "../../views/contractor/OrgRoles"
import { ContractorRole } from "../../datatypes/Contractor"

export function LoggedInRoute() {
  // const [profile, setProfile] = useUserProfile()
  const profile = useGetUserProfileQuery()
  const location = useLocation()

  const doNavigate = useMemo(() => {
    if (profile.error) {
      window.location.href = `${BACKEND_URL}/auth/discord?path=${encodeURIComponent(
        location.pathname,
      )}`
    } else if (
      !profile.isLoading &&
      profile.data &&
      !profile?.data?.rsi_confirmed
    ) {
      if (location.pathname !== "/settings") {
        return "/settings"
      }
    }
    return null
  }, [profile, location])

  if (doNavigate) {
    return <Navigate to={doNavigate} />
  }

  if (profile.isLoading) {
    return <LoadingBar color="#f11946" progress={0.5} />
  }

  return <Outlet />
}

export function SiteAdminRoute() {
  const profile = useGetUserProfileQuery()

  return profile.isSuccess && profile.data.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/404"} />
  )
}

export function OrgRoute() {
  const [cookies] = useCookies(["current_contractor"])
  const contractor = useGetContractorBySpectrumIDQuery(
    cookies.current_contractor,
    { skip: !cookies.current_contractor },
  )
  const [currentOrg] = useCurrentOrg()

  return contractor.isSuccess ? <Outlet /> : <Navigate to={"/"} />
}

export function OrgAdminRoute(props: {
  permission?: keyof ContractorRole
  anyPermission?: (keyof ContractorRole)[]
}) {
  const { permission, anyPermission, ...routeProps } = props
  const [cookies] = useCookies(["current_contractor"])
  const contractor = useGetContractorBySpectrumIDQuery(
    cookies.current_contractor,
    { skip: !cookies.current_contractor },
  )
  const [currentOrg] = useCurrentOrg()

  const { data: profile } = useGetUserProfileQuery()
  const canView = useMemo(() => {
    if (permission) {
      return has_permission(contractor.data!, profile!, permission)
    } else if (anyPermission) {
      return anyPermission.some((perm) =>
        has_permission(contractor.data!, profile!, perm),
      )
    } else {
      return false
    }
  }, [anyPermission, contractor.data, permission, profile])

  return canView ? <Outlet /> : <Navigate to={"/"} />
}
